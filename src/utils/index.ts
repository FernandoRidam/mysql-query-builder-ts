import fs from "fs";
import path from "path";

import {
  BetweenData,
  InData,
  LikeData,
  QueryCondition, TableSchema,
} from "../types";

export const prepareData = <Type>( data: Type ): any => {
  if( typeof data === 'string')
    return `'${ data }'`;

  return data;
};

export const prepareColumns = <Schema>( params: Schema ): string => {
  return Object.keys( params as Object ).join(', ');
};

export const prepareValues = <Schema>( params: Schema ) => {
  type Columns = keyof Schema;

  const keys: Array<string> = Object.keys( params as Object );

  return keys
    .map(( key: string ) => {
      let data = params[ key as Columns ];

      data = prepareData<typeof data>( data );

      return data;
    })
    .join(', ');
};

export const prepareColumnsWithValues = <Schema>( params: Partial<Schema> ) => {
  type Columns = keyof Schema;

  const keys: Array<string> = Object.keys( params );

  return keys
    .map(( key: string ) => {
      let data = params[ key as Columns ];

      return `${ key } = ${ prepareData<typeof data>( data )}`;
    })
    .join(', ');
};

export const formatConditionWithPriority = ({ logicalOperator, priority, conditionBase, query }: QueryCondition ) => {
  if( priority ) {
    switch ( priority ) {
      case 'START':
        query = query.concat(` ${ logicalOperator }`, ' (', ` ${ conditionBase }`);

        break;
      case 'END':
        query = query.concat(` ${ logicalOperator } ${ conditionBase }`, ' )');

        break;
    }

  } else {
    query = query.concat(` ${ logicalOperator } ${ conditionBase }`);
  }

  return query;
};

export const formatConditionBase = ({ column, operator, data }: any ) => {
  switch ( operator ) {
    case 'BETWEEN':
      return formatConditionBetween({ column, operator, data });

    case 'LIKE':
      return formatConditionLike({ column, operator, data });

    case 'IN':
      return formatConditionIn({ column, operator, data });

    default:
      data = prepareData<typeof data>( data );

      return `${ column as String } ${ operator } ${ data }`;
  }
};

export const createAndUpdateTypeFiles = async ( name: string, table: string, tableSchema: TableSchema ) => {
  await createAndUpdateTablesType( table );

  await createAndUpdateTablesSchema( name, table, tableSchema );
};

const createAndUpdateTablesType = async ( table: string ) => {
  const pathTablesTypeFile = path.resolve(`${ __dirname }/../types/tables.d.ts`);

  const tables = fs.readFileSync( pathTablesTypeFile ).toString()
    .replace('export declare type TableType = ', '')
    .replace(';', '')
    .trim();

    let newListTables: string;

    if( !tables.includes( table )) {
      if( tables !== `''`) newListTables = `${ tables } | '${ table }'`;
      else newListTables = `'${ table }'`;

      const newFileContent = `export declare type TableType = ${ newListTables };`;

      fs.unlinkSync( pathTablesTypeFile );

      fs.writeFileSync( pathTablesTypeFile, newFileContent );
    }
};

const createAndUpdateTablesSchema = async ( name: string, table: string, tableSchema: TableSchema ) => {
  const pathModels = path.resolve(`${ __dirname }/../models`);
  const pathModelsIndexTs = path.resolve(`${ pathModels }/index.d.ts`);
  const pathModelsIndexJs = path.resolve(`${ pathModels }/index.js`);

  const tablesTs = fs.readFileSync( pathModelsIndexTs ).toString();
  const tablesJs = fs.readFileSync( pathModelsIndexJs ).toString();

  let newExportTableSchemaTs: string;
  let newExportTableSchemaJs: string;

  if( !tablesTs.includes(`export * from './${ table }';`) && !tablesJs.includes(`__exportStar(require("./${ table }"), exports);`)) {
    if( !tablesTs.includes('declare const _default: null;')) {
      newExportTableSchemaTs = `${ tablesTs }\nexport * from './${ table }';`;
    } else {
      newExportTableSchemaTs = `export * from './${ table }';`;
    }

    if( !tablesJs.includes(`exports.default = null;`)) {
      newExportTableSchemaJs = `${ tablesJs }\n__exportStar(require("./${ table }"), exports);`;
    } else {
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
      Object.defineProperty(exports, "__esModule", { value: true });\n__exportStar(require("./${ table }"), exports);`;
    }

    const keys = Object.keys( tableSchema );

    const tableSchemaContentTs = `export interface Schema${ table } {\n${
      keys
      .map(( column: string ) => `  ${ column }: ${ tableSchema[ column ]};`)
      .join(`\n`)
    }\n};\n\export declare type ${ table }Columns = ${
      keys.map(( column: string ) => `'${ table }.${ column }'`).join(` | `)
    };\n\export declare const ${ table }: import("../types/global").Table<Schema${ table }, ${ table }Columns, "">;`;

    const tableSchemaContentJs = `"use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.${ table } = void 0;
      const commands_1 = require("../commands");
      const database = '${ name }';
      const table = '${ table }';
      ;
      exports.${ table } = (0, commands_1.prepareCommands)(database, table)();`;

    fs.writeFileSync( path.resolve(`${ pathModels }/${ table }.d.ts`), tableSchemaContentTs );
    fs.writeFileSync( path.resolve(`${ pathModels }/${ table }.js`), tableSchemaContentJs );

    fs.unlinkSync( pathModelsIndexTs );
    fs.writeFileSync( pathModelsIndexTs, newExportTableSchemaTs );

    fs.unlinkSync( pathModelsIndexJs );
    fs.writeFileSync( pathModelsIndexJs, newExportTableSchemaJs );
  }
};

const formatConditionBetween = ({ column, operator, data }: any ) => {
  const {
    rangeStart,
    rangeEnd,
    not,
  } = data as BetweenData;

  return `${ column as String } ${ not ? 'NOT ' : ''}${ operator } ${ prepareData<typeof rangeStart>( rangeStart )} AND ${ prepareData<typeof rangeEnd>( rangeEnd )}`;
};

const formatConditionIn = ({ column, operator, data }: any ) => {
  const {
    data: inData,
    not,
  } = data as InData;

  const values = inData
    .map(( value ) => prepareData<typeof value>( value ))
    .join(', ');

  return `${ column as String } ${ not ? 'NOT ' : ''}${ operator } (${ values })`;
};

const formatConditionLike = ({ column, operator, data }: any ) => {
  const {
    data: likeData,
    likeOperator,
    not,
  } = data as LikeData;

  switch ( likeOperator ) {
    case 'STARTS':
      return `${ column as String } ${ operator } '${ likeData }%'`;
    case 'ENDS':
      return `${ column as String } ${ operator } '%${ likeData }'`;
    case 'CONTAINS':
      return `${ column as String } ${ operator } '%${ likeData }%'`;
  };
};
