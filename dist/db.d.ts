import { TableSchema } from './types';
declare const db: (name: string) => {
    table: (table: string, tableSchema: TableSchema) => void;
};
export default db;
