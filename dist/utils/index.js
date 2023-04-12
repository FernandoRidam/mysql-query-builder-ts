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
    const pathTablesTypeFile = path_1.default.resolve(`${__dirname}/../@types/tables.d.ts`);
    const tables = fs_1.default.readFileSync(pathTablesTypeFile).toString()
        .replace('export type TableType = ', '')
        .replace(';', '')
        .trim();
    let newListTables;
    if (!tables.includes(table)) {
        if (tables !== `''`)
            newListTables = `${tables} | '${table}'`;
        else
            newListTables = `'${table}'`;
        const newFileContent = `export type TableType = ${newListTables};`;
        fs_1.default.unlinkSync(pathTablesTypeFile);
        fs_1.default.writeFileSync(pathTablesTypeFile, newFileContent);
    }
};
const createAndUpdateTablesSchema = async (name, table, tableSchema) => {
    const pathModels = path_1.default.resolve(`${__dirname}/../models`);
    const pathModelsIndex = path_1.default.resolve(`${pathModels}/index.ts`);
    const tables = fs_1.default.readFileSync(pathModelsIndex).toString();
    let newExportTableSchema;
    if (!tables.includes(`export * from './${table}';`)) {
        if (tables) {
            newExportTableSchema = `${tables}\nexport * from './${table}';`;
        }
        else
            newExportTableSchema = `export * from './${table}';`;
        const keys = Object.keys(tableSchema);
        const tableSchemaContent = `import { prepareCommands } from '../commands';\n\nimport { TableType } from '../@types/tables';\n\nconst database = '${name}';\nconst table = '${table}';\n\nexport interface Schema${table} {\n${keys
            .map((column) => `  ${column}: ${tableSchema[column]};`)
            .join(`\n`)}\n};\n\nexport type ${table}Columns = ${keys.map((column) => `'${table}.${column}'`).join(` | `)};\n\nexport const ${table} = prepareCommands<Schema${table}, ${table}Columns, TableType>( database, table as TableType )();`;
        fs_1.default.writeFileSync(path_1.default.resolve(`${pathModels}/${table}.ts`), tableSchemaContent);
        fs_1.default.unlinkSync(pathModelsIndex);
        fs_1.default.writeFileSync(pathModelsIndex, newExportTableSchema);
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
