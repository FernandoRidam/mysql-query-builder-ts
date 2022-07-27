export declare type Type = 'number' | 'string' | 'Date';
export interface Column {
    type: Type;
}
export interface Table {
    [key: string]: Column;
}
export declare const select: <T>(columns: T) => void;
export declare const createSchema: (table: Table) => void;
