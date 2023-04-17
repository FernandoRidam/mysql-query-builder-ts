export declare global {
  type Data = string | Number | Date;

  type RelationalOperator = '=' | '<>' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'BETWEEN' | 'IN';

  type LogicalOperator = 'AND' | 'OR' | 'NOT';

  type Priority = 'START' | 'END';

  type LikeOperator = 'STARTS' | 'ENDS' | 'CONTAINS';

  type TypeJoin = 'INNER' | 'LEFT' | 'RIGHT';

  type Exec = () => string;

  type Types = 'string' | 'number' | 'date';

  interface TableSchema {
    [ key: string ]: Types;
  };

  interface LikeData {
    data: string;
    likeOperator: LikeOperator;
    not?: boolean;
  };

  interface BetweenData {
    rangeStart: Data;
    rangeEnd: Data;
    not?: boolean;
  };

  interface InData {
    data: Array<Data>;
    not?: boolean;
  };

  type ConditionData = Data | LikeData | BetweenData | InData;

  interface QueryCondition {
    logicalOperator?: LogicalOperator;
    conditionBase: string;
    query: string;
    priority?: Priority;
  };

  interface DB {
    [ key: string ]: Array<string>;
  };

  // ==

  interface AsParams<Columns> {
    column: Columns;
    as: string;
  };

  interface Condition<Columns> {
    column: Columns;
    operator: RelationalOperator;
    data: ConditionData;
  };

  interface ConditionJoin<Columns, T> {
    column: Columns | T;
    operator: RelationalOperator;
    data: ConditionData;
  };

  interface AndOrCondition<Columns> {
    column: Columns;
    operator: RelationalOperator;
    data: ConditionData;
    priority?: Priority;
  };

  interface AndOrConditionJoin<Columns, T> {
    column: Columns | T;
    operator: RelationalOperator;
    data: ConditionData;
    priority?: Priority;
  };

  interface Join<Columns, T> {
    type: TypeJoin;
    leftColumn: T;
    table: string;
    rightColumn: Columns;
  };

  interface DefaultReturn {
    exec: Exec;
  };

  interface InsertReturn extends DefaultReturn {};

  interface OrReturn<Columns> extends DefaultReturn {
    or: ( condition: AndOrCondition<Columns> ) => OrReturn<Columns>;
    and: ( condition: AndOrCondition<Columns> ) => AndReturn<Columns>;
  };

  interface OrReturnJoin<Columns, T> extends DefaultReturn {
    or: ( condition: AndOrCondition<Columns, T> ) => OrReturn;
    and: ( condition: AndOrCondition<Columns, T> ) => AndReturn;
  };

  interface AndReturn extends DefaultReturn {
    or: ( condition: AndOrCondition ) => OrReturn;
    and: ( condition: AndOrCondition ) => AndReturn;
  };

  interface AndReturnJoin<Columns, T> extends DefaultReturn {
    or: ( condition: AndOrConditionJoin<Columns, T> ) => OrReturnJoin<Columns, T>;
    and: ( condition: AndOrConditionJoin<Columns, T> ) => AndReturnJoin<Columns, T>;
  };

  interface WhereReturn extends DefaultReturn {
    or: ( condition: AndOrCondition ) => OrReturn;
    and: ( condition: AndOrCondition ) => AndReturn;
  };

  interface WhereReturnJoin<Columns, T> extends DefaultReturn {
    or: ( condition: AndOrConditionJoin<Columns, T> ) => OrReturnJoin<Columns, T>;
    and: ( condition: AndOrConditionJoin<Columns, T> ) => AndReturnJoin<Columns, T>;
  };

  interface UpdateReturn {
    where: ( condition: Condition ) => WhereReturn;
  };

  interface DeleteReturn extends DefaultReturn {
    where: ( condition: Condition ) => WhereReturn;
  };

  interface JoinReturn<Columns, T> {
    select: ( ...args: Array<Columns | T | AsParams<Columns | T>>) => SelectReturnJoin<Columns, T>;
  };

  interface SelectReturn extends DefaultReturn {
    where: ( condition: Condition ) => WhereReturn;
  };

  interface SelectReturnJoin<Columns, T> extends DefaultReturn {
    where: ( condition: ConditionJoin<Columns, T> ) => WhereReturnJoin<Columns, T>;
  };

  interface Table<TableSchema, Columns, TableType> {
    insert: ( ...args: TableSchema[]) => InsertReturn;
    update: ( ...args: any[]) => UpdateReturn;
    delete: () => DeleteReturn;
    select: ( ...args: Array<Columns | AsParams<Columns>>) => SelectReturn;
    join: <T>( join: Join<Columns, T>) => JoinReturn<Columns, T>
    name: TableType;
  };
}
