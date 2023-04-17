

import {
  formatConditionBase,
  formatConditionWithPriority,
  prepareColumns,
  prepareColumnsWithValues,
  prepareValues
} from "../utils";

export const prepareCommands = <TableSchema, Columns, TableType>( database: string, table: TableType ) => {
  const commands = (): Table<TableSchema, Columns, TableType> => {
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
      const select = ( ...columns: Array<Columns | T | AsParams<Columns | T>>): SelectReturnJoin<Columns, T> => {
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
    }: Join<Columns, T> ): JoinReturn<Columns, T> => {
      const query = ` ${ type } JOIN ${ database }.${ _table } ON ${ database }.${ String( leftColumn )} = ${ database }.${ String( rightColumn )}`;

      return {
        ...prepareSelectJoin<T>( query ),
      };
    };

    const prepareWhere = ( query: string ) => {
      const where = ({ column, operator, data }: Condition<Columns> ): WhereReturn => {
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
      const where = ({ column, operator, data }: ConditionJoin<Columns, T> ): WhereReturnJoin<Columns, T> => {
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
      const and = ({ column, operator, data, priority }: AndOrCondition<Columns> ): AndReturn => {
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
      const and = ({ column, operator, data, priority }: AndOrConditionJoin<Columns, T> ): AndReturnJoin<Columns, T> => {
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
          ...prepareOrJoin( query ),
          and,
        };
      };

      return {
        and,
      };
    };

    const prepareOr = ( query: string ) => {
      const or = ({ column, operator, data, priority }: AndOrCondition<Columns> ): OrReturn<Columns> => {
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
      const or = ({ column, operator, data, priority }: AndOrConditionJoin<Columns, T> ): OrReturnJoin<Columns, T> => {
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
          ...prepareAndJoin( query ),
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
