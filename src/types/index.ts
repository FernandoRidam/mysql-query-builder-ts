export type Data = string | Number | Date;

export type RelationalOperation = '=' | '<>' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'BETWEEN' | 'IN';

export type LogicalOperation = 'AND' | 'OR' | 'NOT';

export type Priority = 'START' | 'END';

export type LikeOperator = 'STARTS' | 'ENDS' | 'CONTAINS';

export interface LikeData {
  data: string;
  operator: LikeOperator;
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
  logicalOperation?: LogicalOperation;
  conditionBase: string;
  query: string;
  priority?: Priority;
};

export interface Condition {
  column: unknown;
  operation: RelationalOperation;
  data: ConditionData;
};

export interface AndOrCondition {
  column: unknown;
  operation: RelationalOperation;
  data: ConditionData;
  priority?: Priority;
};
