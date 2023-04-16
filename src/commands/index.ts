import { TableType } from "../@types/tables";
import {
  RelationalOperator,
  ConditionData,
  Priority,
  TypeJoin,
  Exec,
} from "../types";

import {
  formatConditionBase,
  formatConditionWithPriority,
  prepareColumns,
  prepareColumnsWithValues,
  prepareValues
} from "../utils";

export const prepareCommands = <TableSchema, Columns, TableType>( database: string, table: TableType ) => {
  interface AsParams<Columns> {
    column: Columns;
    as: string;
  };

  interface Condition {
    column: Columns;
    operator: RelationalOperator;
    data: ConditionData;
  };

  interface ConditionJoin<T> {
    column: Columns | T;
    operator: RelationalOperator;
    data: ConditionData;
  };

  interface AndOrCondition {
    column: Columns;
    operator: RelationalOperator;
    data: ConditionData;
    priority?: Priority;
  };

  interface AndOrConditionJoin<T> {
    column: Columns | T;
    operator: RelationalOperator;
    data: ConditionData;
    priority?: Priority;
  };

  interface Join<T> {
    type: TypeJoin;
    leftColumn: T;
    table: string;
    rightColumn: Columns;
  };

  interface DefaultReturn {
    exec: Exec;
  };

  interface InsertReturn extends DefaultReturn {};

  interface OrReturn extends DefaultReturn {
    or: ( condition: AndOrCondition ) => OrReturn;
    and: ( condition: AndOrCondition ) => AndReturn;
  };

  interface OrReturnJoin<T> extends DefaultReturn {
    or: ( condition: AndOrCondition ) => OrReturn;
    and: ( condition: AndOrCondition ) => AndReturn;
  };

  interface AndReturn extends DefaultReturn {
    or: ( condition: AndOrCondition ) => OrReturn;
    and: ( condition: AndOrCondition ) => AndReturn;
  };

  interface AndReturnJoin<T> extends DefaultReturn {
    or: ( condition: AndOrCondition ) => OrReturnJoin<T>;
    and: ( condition: AndOrCondition ) => AndReturnJoin<T>;
  };

  interface WhereReturn extends DefaultReturn {
    or: ( condition: AndOrCondition ) => OrReturn;
    and: ( condition: AndOrCondition ) => AndReturn;
  };

  interface WhereReturnJoin<T> extends DefaultReturn {
    or: ( condition: AndOrConditionJoin<T> ) => OrReturnJoin<T>;
    and: ( condition: AndOrConditionJoin<T> ) => AndReturnJoin<T>;
  };

  interface UpdateReturn {
    where: ( condition: Condition ) => WhereReturn;
  };

  interface DeleteReturn extends DefaultReturn {
    where: ( condition: Condition ) => WhereReturn;
  };

  interface OnReturn extends DefaultReturn {
    where: ( condition: Condition ) => WhereReturn;
  };

  interface JoinReturn<T> {
    select: ( ...args: Array<Columns | T | AsParams<Columns | T>>) => SelectReturnJoin<T>;
  };

  interface SelectReturn extends DefaultReturn {
    where: ( condition: Condition ) => WhereReturn;
  };

  interface SelectReturnJoin<T> extends DefaultReturn {
    where: ( condition: ConditionJoin<T> ) => WhereReturnJoin<T>;
  };

  interface Table {
    insert: ( ...args: TableSchema[]) => InsertReturn;
    update: ( ...args: any[]) => UpdateReturn;
    delete: () => DeleteReturn;
    select: ( ...args: Array<Columns | AsParams<Columns>>) => SelectReturn;
    join: <T>( join: Join<T>) => JoinReturn<T>
    name: TableType;
  };

  const commands = (): Table => {
    const defaultReturn = ( query: string ) => {
      const exec = (): string => {
        query = query.concat(';');

        console.log(query);

        return query;
      };

      return {
        exec,
      };
    };

    const insert = ( params: TableSchema ): InsertReturn => {
      const columns = prepareColumns<TableSchema>( params );
      const values = prepareValues<TableSchema>( params );

      let query = `INSERT INTO ${ database }.${ table } (${ columns }) VALUES (${ values })`;

      return defaultReturn( query );
    };

    const update = ( params: Partial<TableSchema> ): UpdateReturn => {
      const values = prepareColumnsWithValues<TableSchema>( params );

      let query = `UPDATE  ${ database }.${ table } SET ${ values }`;

      return {
        ...prepareWhere( query ),
      };
    };

    const del = (): DeleteReturn => {
      let query = `DELETE FROM  ${ database }.${ table }`;

      return {
        ...defaultReturn( query ),
        ...prepareWhere( query ),
      };
    };

    const select = ( ...columns: Array<Columns | AsParams<Columns>>): SelectReturn => {
      let query = `SELECT ${ columns.length > 0 ? columns.map(( column ) => {
        if( !!column ) {
          switch (typeof column) {
            case 'string':
              return column;

            case 'object':
              let current: AsParams<Columns> = column as AsParams<Columns>;
              return `${ String( current.column )} as ${ current.as }`;

            default:
              return column;
          }
        }
      }).join(', ') : '*'} FROM  ${ database }.${ table }`;

      return {
        ...defaultReturn( query ),
        ...prepareWhere( query ),
      };
    };

    const prepareSelectJoin = <T>( join: string ) => {
      const select = ( ...columns: Array<Columns | T | AsParams<Columns | T>>): SelectReturnJoin<T> => {
        let query = `SELECT ${ columns.length> 0 ? columns.map(( column ) => {
          if( !!column ) {
            switch (typeof column) {
              case 'string':
                return column;

              case 'object':
                let current: AsParams<Columns | T> = column as AsParams<Columns | T>;
                return `${ String( current.column )} as ${ current.as }`;

              default:
                return column;
            }
          }
        }).join(', ') : '*'} FROM  ${ database }.${ table }${ join }`;

        return {
          ...defaultReturn( query ),
          ...prepareWhereJoin( query ),
        };
      };

      return {
        select,
      };
    };

    const join = <T>({
      type,
      table: _table,
      leftColumn,
      rightColumn,
    }: Join<T> ): JoinReturn<T> => {
      const query = ` ${ type } JOIN ${ database }.${ _table } ON ${ database }.${ leftColumn as string } = ${ database }.${ rightColumn as string }`;

      return {
        ...prepareSelectJoin<T>( query ),
      };
    };

    const prepareWhere = ( query: string ) => {
      const where = ({ column, operator, data }: Condition ): WhereReturn => {
        const conditionBase = formatConditionBase({
          column,
          operator,
          data,
        });

        query = query.concat(` WHERE ${ conditionBase }`);

        return {
          ...defaultReturn( query ),
          ...prepareOr( query ),
          ...prepareAnd( query ),
        };
      };

      return {
        where,
      };
    };

    const prepareWhereJoin = <T>( query: string ) => {
      const where = ({ column, operator, data }: ConditionJoin<T> ): WhereReturnJoin<T> => {
        const conditionBase = formatConditionBase({
          column,
          operator,
          data,
        });

        query = query.concat(` WHERE ${ conditionBase }`);

        return {
          ...defaultReturn( query ),
          ...prepareOrJoin<T>( query ),
          ...prepareAndJoin<T>( query ),
        };
      };

      return {
        where,
      };
    };

    const prepareAnd = ( query: string ) => {
      const and = ({ column, operator, data, priority }: AndOrCondition ): AndReturn => {
        const conditionBase = formatConditionBase({
          column,
          operator,
          data,
        });

        query = formatConditionWithPriority({
          query,
          conditionBase,
          priority,
          logicalOperator: 'AND',
        });

        return {
          ...defaultReturn( query ),
          ...prepareOr( query ),
          and,
        };
      };

      return {
        and,
      };
    };

    const prepareAndJoin = <T>( query: string ) => {
      const and = ({ column, operator, data, priority }: AndOrConditionJoin<T> ): AndReturnJoin<T> => {
        const conditionBase = formatConditionBase({
          column,
          operator,
          data,
        });

        query = formatConditionWithPriority({
          query,
          conditionBase,
          priority,
          logicalOperator: 'AND',
        });

        return {
          ...defaultReturn( query ),
          ...prepareOr( query ),
          and,
        };
      };

      return {
        and,
      };
    };

    const prepareOr = ( query: string ) => {
      const or = ({ column, operator, data, priority }: AndOrCondition ): OrReturn => {
        const conditionBase = formatConditionBase({
          column,
          operator,
          data,
        });

        query = formatConditionWithPriority({
          query,
          conditionBase,
          priority,
          logicalOperator: 'OR',
        });

        return {
          ...defaultReturn( query ),
          ...prepareAnd( query ),
          or,
        };
      };

      return {
        or,
      };
    };

    const prepareOrJoin = <T>( query: string ) => {
      const or = ({ column, operator, data, priority }: AndOrConditionJoin<T> ): OrReturnJoin<T> => {
        const conditionBase = formatConditionBase({
          column,
          operator,
          data,
        });

        query = formatConditionWithPriority({
          query,
          conditionBase,
          priority,
          logicalOperator: 'OR',
        });

        return {
          ...defaultReturn( query ),
          ...prepareAnd( query ),
          or,
        };
      };

      return {
        or,
      };
    };

    return {
      insert,
      update,
      delete: del,
      select,
      join,
      name: table,
    };
  };

  return commands;
};
