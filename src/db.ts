import {
  TableSchema,
} from './types';

import {
  createAndUpdateTypeFiles,
} from './utils';

const db = ( name: string ) => {
  const table = ( table: string, tableSchema: TableSchema ) => {
    createAndUpdateTypeFiles( name, table, tableSchema );
  }

  return {
    table,
  };
};

export default db;
