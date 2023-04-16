export type Data = string | Number | Date;

export type RelationalOperator = '=' | '<>' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'BETWEEN' | 'IN';

export type LogicalOperator = 'AND' | 'OR' | 'NOT';

export type Priority = 'START' | 'END';

export type LikeOperator = 'STARTS' | 'ENDS' | 'CONTAINS';

export type TypeJoin = 'INNER' | 'LEFT' | 'RIGHT';

export type Exec = () => string;

export type Types = 'string' | 'number' | 'date';

export interface TableSchema {
  [ key: string ]: Types;
};

export interface LikeData {
  data: string;
  likeOperator: LikeOperator;
  not?: boolean;
};

export interface BetweenData {
  rangeStart: Data;
  rangeEnd: Data;
  not?: boolean;
};

export interface InData {
  data: Array<Data>;
  not?: boolean;
};

export type ConditionData = Data | LikeData | BetweenData | InData;

export interface QueryCondition {
  logicalOperator?: LogicalOperator;
  conditionBase: string;
  query: string;
  priority?: Priority;
};

export interface DB {
  [ key: string ]: Array<string>;
};
