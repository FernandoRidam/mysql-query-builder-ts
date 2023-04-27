import { Table } from '../types/global';
export declare const prepareCommands: <TableSchema, Columns, TableType>(database: string, table: TableType) => () => Table<TableSchema, Columns, TableType>;
