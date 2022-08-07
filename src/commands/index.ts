import {
  Condition,
  AndOrCondition,
} from "../types";

import {
  formatConditionBase,
  formatConditionWithPriority,
  prepareColumns,
  prepareColumnsWithValues,
  prepareValues
} from "../utils";

export const createSchema = <Schema>( table: string ) => {
  type Columns = keyof Schema;

  interface LocalCondition extends Omit<Condition, 'column'> {
    column: Columns;
  };

  interface LocalAndOrCondition extends Omit<AndOrCondition, 'column'> {
    column: Columns;
  };

  const defaultReturn = ( query: string ) => {
    const exec = () => query.concat(';');

    return {
      exec,
    };
  };

  const insert = ( params: Schema ) => {
    const columns = prepareColumns<Schema>( params );
    const values = prepareValues<Schema>( params );

    let query = `INSERT INTO ${ table } (${ columns }) VALUES (${ values })`;

    return defaultReturn( query );
  };

  const update = ( params: Partial<Schema> ) => {
    const values = prepareColumnsWithValues<Schema>( params );

    let query = `UPDATE ${ table } SET ${ values }`;

    return {
      ...defaultReturn( query ),
      ...prepareWhere( query ),
    };
  };

  const del = () => {
    let query = `DELETE FROM ${ table }`;

    return {
      ...defaultReturn( query ),
      ...prepareWhere( query ),
    };
  };

  const select = ( ...columns: Array<Columns>) => {
    let query = `SELECT ${ columns.length> 0 ? columns.join(', ') : '*'} FROM ${ table }`;

    return {
      ...defaultReturn( query ),
      ...prepareWhere( query ),
    };
  };

  const prepareWhere = ( query: string ) => {
    const where = ({ column, operation, data }: LocalCondition ) => {
      const conditionBase = formatConditionBase({
        column,
        operation,
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

  const prepareAnd = ( query: string ) => {
    const and = ({ column, operation, data, priority }: LocalAndOrCondition ) => {
      const conditionBase = formatConditionBase({
        column,
        operation,
        data,
      });

      query = formatConditionWithPriority({
        query,
        conditionBase,
        priority,
        logicalOperation: 'AND',
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
    const or = ({ column, operation, data, priority }: LocalAndOrCondition ) => {
      const conditionBase = formatConditionBase({
        column,
        operation,
        data,
      });

      query = formatConditionWithPriority({
        query,
        conditionBase,
        priority,
        logicalOperation: 'AND',
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
  };
};
