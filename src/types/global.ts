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

type ConditionData = Data | LikeData | BetweenData | InData;

export interface QueryCondition {
  logicalOperator?: LogicalOperator;
  conditionBase: string;
  query: string;
  priority?: Priority;
}

export interface DB {
  [ key: string ]: Array<string>;
}

// ==

export interface AsParams<Columns> {
  column: Columns;
  as: string;
}

export interface Condition<Columns> {
  column: Columns;
  operator: RelationalOperator;
  data: ConditionData;
}

export interface ConditionJoin<Columns, T> {
  column: Columns | T;
  operator: RelationalOperator;
  data: ConditionData;
}

export interface AndOrCondition<Columns> {
  column: Columns;
  operator: RelationalOperator;
  data: ConditionData;
  priority?: Priority;
}

export interface AndOrConditionJoin<Columns, T> {
  column: Columns | T;
  operator: RelationalOperator;
  data: ConditionData;
  priority?: Priority;
}

export interface Join<Columns, T> {
  type: TypeJoin;
  leftColumn: T;
  table: string;
  rightColumn: Columns;
}

export interface DefaultReturn {
  exec: Exec;
}

export interface InsertReturn extends DefaultReturn {}

export interface OrReturn<Columns> extends DefaultReturn {
  or: ( condition: AndOrCondition<Columns> ) => OrReturn<Columns>;
  and: ( condition: AndOrCondition<Columns> ) => AndReturn<Columns>;
}

export interface OrReturnJoin<Columns, T> extends DefaultReturn {
  or: ( condition: AndOrConditionJoin<Columns, T> ) => OrReturnJoin<Columns, T>;
  and: ( condition: AndOrConditionJoin<Columns, T> ) => AndReturnJoin<Columns, T>;
}

export interface AndReturn<Columns> extends DefaultReturn {
  or: ( condition: AndOrCondition<Columns> ) => OrReturn<Columns>;
  and: ( condition: AndOrCondition<Columns> ) => AndReturn<Columns>;
}

export interface AndReturnJoin<Columns, T> extends DefaultReturn {
  or: ( condition: AndOrConditionJoin<Columns, T> ) => OrReturnJoin<Columns, T>;
  and: ( condition: AndOrConditionJoin<Columns, T> ) => AndReturnJoin<Columns, T>;
}

export interface WhereReturn<Columns> extends DefaultReturn {
  or: ( condition: AndOrCondition<Columns> ) => OrReturn<Columns>;
  and: ( condition: AndOrCondition<Columns> ) => AndReturn<Columns>;
}

export interface WhereReturnJoin<Columns, T> extends DefaultReturn {
  or: ( condition: AndOrConditionJoin<Columns, T> ) => OrReturnJoin<Columns, T>;
  and: ( condition: AndOrConditionJoin<Columns, T> ) => AndReturnJoin<Columns, T>;
}

export interface UpdateReturn<Columns> {
  where: ( condition: Condition<Columns> ) => WhereReturn<Columns>;
}

export interface DeleteReturn<Columns> extends DefaultReturn {
  where: ( condition: Condition<Columns> ) => WhereReturn<Columns>;
}

export interface JoinReturn<Columns, T> {
  select: ( ...args: Array<Columns | T | AsParams<Columns | T>>) => SelectReturnJoin<Columns, T>;
}

export interface SelectReturn<Columns> extends DefaultReturn {
  where: ( condition: Condition<Columns> ) => WhereReturn<Columns>;
}

export interface SelectReturnJoin<Columns, T> extends DefaultReturn {
  where: ( condition: ConditionJoin<Columns, T> ) => WhereReturnJoin<Columns, T>;
}

export interface Table<TableSchema, Columns, TableType> {
  insert: ( ...args: TableSchema[]) => InsertReturn;
  update: ( ...args: any[]) => UpdateReturn<Columns>;
  delete: () => DeleteReturn<Columns>;
  select: ( ...args: Array<Columns | AsParams<Columns>>) => SelectReturn<Columns>;
  join: <T>( join: Join<Columns, T>) => JoinReturn<Columns, T>
  name: TableType;
}
