import fs from "fs";
import path from "path";

import {
  BetweenData,
  InData,
  LikeData,
  QueryCondition,
  TableSchema,
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
  const pathTablesTypeFile = path.resolve(`${ __dirname }/../@types/tables.d.ts`);

  const tables = fs.readFileSync( pathTablesTypeFile ).toString()
    .replace('export type TableType = ', '')
    .replace(';', '')
    .trim();

    let newListTables: string;

    if( !tables.includes( table )) {
      if( tables !== `''`) newListTables = `${ tables } | '${ table }'`;
      else newListTables = `'${ table }'`;

      const newFileContent = `export type TableType = ${ newListTables };`;

      fs.unlinkSync( pathTablesTypeFile );

      fs.writeFileSync( pathTablesTypeFile, newFileContent );
    }
};

const createAndUpdateTablesSchema = async ( name: string, table: string, tableSchema: TableSchema ) => {
  const pathModels = path.resolve(`${ __dirname }/../models`);
  const pathModelsIndex = path.resolve(`${ pathModels }/index.ts`);

  const tables = fs.readFileSync( pathModelsIndex ).toString();

  let newExportTableSchema: string;

  if( !tables.includes(`export * from './${ table }';`)) {
    if( tables ) {
      newExportTableSchema = `${ tables }\nexport * from './${ table }';`;
    } else newExportTableSchema = `export * from './${ table }';`;

    const keys = Object.keys( tableSchema );

    const tableSchemaContent = `import { prepareCommands } from '../commands';\n\nimport { TableType } from '../@types/tables';\n\nconst database = '${ name }';\nconst table = '${ table }';\n\nexport interface Schema${ table } {\n${
      keys
      .map(( column: string ) => `  ${ column }: ${ tableSchema[ column ]};`)
      .join(`\n`)
    }\n};\n\nexport type ${ table }Columns = ${
      keys.map(( column: string ) => `'${ table }.${ column }'`).join(` | `)
    };\n\nexport const ${ table } = prepareCommands<Schema${ table }, ${ table }Columns, TableType>( database, table as TableType )();`;

    fs.writeFileSync( path.resolve(`${ pathModels }/${ table }.ts`), tableSchemaContent );

    fs.unlinkSync( pathModelsIndex );

    fs.writeFileSync( pathModelsIndex, newExportTableSchema );
  }

  // let newListTables: string;

  // if( !tables.includes( table )) {
  //   if( tables !== `''`) newListTables = `${ tables } | '${ table }'`;
  //   else newListTables = `'${ table }'`;

  //   const newFileContent = `export type TableType = ${ newListTables };`;

  //   fs.unlinkSync( baseTypeFiles );

  //   fs.writeFileSync( baseTypeFiles, newFileContent );
  // }
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
