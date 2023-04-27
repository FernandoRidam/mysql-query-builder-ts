"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndUpdateTypeFiles = exports.formatConditionBase = exports.formatConditionWithPriority = exports.prepareColumnsWithValues = exports.prepareValues = exports.prepareColumns = exports.prepareData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prepareData = (data) => {
    if (typeof data === 'string')
        return `'${data}'`;
    return data;
};
exports.prepareData = prepareData;
const prepareColumns = (params) => {
    return Object.keys(params).join(', ');
};
exports.prepareColumns = prepareColumns;
const prepareValues = (params) => {
    const keys = Object.keys(params);
    return keys
        .map((key) => {
        let data = params[key];
        data = (0, exports.prepareData)(data);
        return data;
    })
        .join(', ');
};
exports.prepareValues = prepareValues;
const prepareColumnsWithValues = (params) => {
    const keys = Object.keys(params);
    return keys
        .map((key) => {
        let data = params[key];
        return `${key} = ${(0, exports.prepareData)(data)}`;
    })
        .join(', ');
};
exports.prepareColumnsWithValues = prepareColumnsWithValues;
const formatConditionWithPriority = ({ logicalOperator, priority, conditionBase, query }) => {
    if (priority) {
        switch (priority) {
            case 'START':
                query = query.concat(` ${logicalOperator}`, ' (', ` ${conditionBase}`);
                break;
            case 'END':
                query = query.concat(` ${logicalOperator} ${conditionBase}`, ' )');
                break;
        }
    }
    else {
        query = query.concat(` ${logicalOperator} ${conditionBase}`);
    }
    return query;
};
exports.formatConditionWithPriority = formatConditionWithPriority;
const formatConditionBase = ({ column, operator, data }) => {
    switch (operator) {
        case 'BETWEEN':
            return formatConditionBetween({ column, operator, data });
        case 'LIKE':
            return formatConditionLike({ column, operator, data });
        case 'IN':
            return formatConditionIn({ column, operator, data });
        default:
            data = (0, exports.prepareData)(data);
            return `${column} ${operator} ${data}`;
    }
};
exports.formatConditionBase = formatConditionBase;
const createAndUpdateTypeFiles = async (name, table, tableSchema) => {
    await createAndUpdateTablesType(table);
    await createAndUpdateTablesSchema(name, table, tableSchema);
};
exports.createAndUpdateTypeFiles = createAndUpdateTypeFiles;
const createAndUpdateTablesType = async (table) => {
    const pathTablesTypeFile = path_1.default.resolve(`${__dirname}/../types/tables.d.ts`);
    const tables = fs_1.default.readFileSync(pathTablesTypeFile).toString()
        .replace('export declare type TableType = ', '')
        .replace(';', '')
        .trim();
    let newListTables;
    if (!tables.includes(table)) {
        if (tables !== `''`)
            newListTables = `${tables} | '${table}'`;
        else
            newListTables = `'${table}'`;
        const newFileContent = `export declare type TableType = ${newListTables};`;
        fs_1.default.unlinkSync(pathTablesTypeFile);
        fs_1.default.writeFileSync(pathTablesTypeFile, newFileContent);
    }
};
const createAndUpdateTablesSchema = async (name, table, tableSchema) => {
    const pathModels = path_1.default.resolve(`${__dirname}/../models`);
    const pathModelsIndexTs = path_1.default.resolve(`${pathModels}/index.d.ts`);
    const pathModelsIndexJs = path_1.default.resolve(`${pathModels}/index.js`);
    const tablesTs = fs_1.default.readFileSync(pathModelsIndexTs).toString();
    const tablesJs = fs_1.default.readFileSync(pathModelsIndexJs).toString();
    let newExportTableSchemaTs;
    let newExportTableSchemaJs;
    if (!tablesTs.includes(`export * from './${table}';`) && !tablesJs.includes(`__exportStar(require("./${table}"), exports);`)) {
        if (!tablesTs.includes('declare const _default: null;')) {
            newExportTableSchemaTs = `${tablesTs}\nexport * from './${table}';`;
        }
        else {
            newExportTableSchemaTs = `export * from './${table}';`;
        }
        if (!tablesJs.includes(`exports.default = null;`)) {
            newExportTableSchemaJs = `${tablesJs}\n__exportStar(require("./${table}"), exports);`;
        }
        else {
            newExportTableSchemaJs = `"use strict";
      var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          var desc = Object.getOwnPropertyDescriptor(m, k);
          if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() { return m[k]; } };
          }
          Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          o[k2] = m[k];
      }));
      var __exportStar = (this && this.__exportStar) || function(m, exports) {
          for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });\n__exportStar(require("./${table}"), exports);`;
        }
        const keys = Object.keys(tableSchema);
        const tableSchemaContentTs = `export interface Schema${table} {\n${keys
            .map((column) => `  ${column}: ${tableSchema[column]};`)
            .join(`\n`)}\n};\n\export declare type ${table}Columns = ${keys.map((column) => `'${table}.${column}'`).join(` | `)};\n\export declare const ${table}: import("../types/global").Table<Schema${table}, ${table}Columns, "">;`;
        const tableSchemaContentJs = `"use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.${table} = void 0;
      const commands_1 = require("../commands");
      const database = '${name}';
      const table = '${table}';
      ;
      exports.${table} = (0, commands_1.prepareCommands)(database, table)();`;
        fs_1.default.writeFileSync(path_1.default.resolve(`${pathModels}/${table}.d.ts`), tableSchemaContentTs);
        fs_1.default.writeFileSync(path_1.default.resolve(`${pathModels}/${table}.js`), tableSchemaContentJs);
        fs_1.default.unlinkSync(pathModelsIndexTs);
        fs_1.default.writeFileSync(pathModelsIndexTs, newExportTableSchemaTs);
        fs_1.default.unlinkSync(pathModelsIndexJs);
        fs_1.default.writeFileSync(pathModelsIndexJs, newExportTableSchemaJs);
    }
};
const formatConditionBetween = ({ column, operator, data }) => {
    const { rangeStart, rangeEnd, not, } = data;
    return `${column} ${not ? 'NOT ' : ''}${operator} ${(0, exports.prepareData)(rangeStart)} AND ${(0, exports.prepareData)(rangeEnd)}`;
};
const formatConditionIn = ({ column, operator, data }) => {
    const { data: inData, not, } = data;
    const values = inData
        .map((value) => (0, exports.prepareData)(value))
        .join(', ');
    return `${column} ${not ? 'NOT ' : ''}${operator} (${values})`;
};
const formatConditionLike = ({ column, operator, data }) => {
    const { data: likeData, likeOperator, not, } = data;
    switch (likeOperator) {
        case 'STARTS':
            return `${column} ${operator} '${likeData}%'`;
        case 'ENDS':
            return `${column} ${operator} '%${likeData}'`;
        case 'CONTAINS':
            return `${column} ${operator} '%${likeData}%'`;
    }
    ;
};
