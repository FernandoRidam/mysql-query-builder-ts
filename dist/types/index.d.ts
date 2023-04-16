export declare type Data = string | Number | Date;
export declare type RelationalOperator = '=' | '<>' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'BETWEEN' | 'IN';
export declare type LogicalOperator = 'AND' | 'OR' | 'NOT';
export declare type Priority = 'START' | 'END';
export declare type LikeOperator = 'STARTS' | 'ENDS' | 'CONTAINS';
export declare type TypeJoin = 'INNER' | 'LEFT' | 'RIGHT';
export declare type Exec = () => string;
export declare type Types = 'string' | 'number' | 'date';
export interface TableSchema {
    [key: string]: Types;
}
export interface LikeData {
    data: string;
    likeOperator: LikeOperator;
    not?: boolean;
}
export interface BetweenData {
    rangeStart: Data;
    rangeEnd: Data;
    not?: boolean;
}
export interface InData {
    data: Array<Data>;
    not?: boolean;
}
export declare type ConditionData = Data | LikeData | BetweenData | InData;
export interface QueryCondition {
    logicalOperator?: LogicalOperator;
    conditionBase: string;
    query: string;
    priority?: Priority;
}
export interface DB {
    [key: string]: Array<string>;
}
