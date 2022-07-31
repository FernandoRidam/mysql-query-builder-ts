import {
  Condition,
  AndOrCondition,
} from "../types";

import {
  formatConditionBase,
  formatConditionWithPriority,
  prepareColumns,
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

  const select = ( ...columns: Array<Columns>) => {
    let query = `SELECT ${ columns.length> 0 ? columns.join(', ') : '*'} FROM ${ table }`;

    const where = ({ column, operation, data }: LocalCondition ) => {
      const conditionBase = formatConditionBase({
        column,
        operation,
        data,
      });

      query = query.concat(` WHERE ${ conditionBase }`);

      return {
        ...defaultReturn( query ),
        and,
        or,
      };
    };

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
        and,
        or,
      };
    };

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
        and,
        or,
      };
    };

    return {
      ...defaultReturn( query ),
      where,
    };
  };

  const insert = ( params: Schema ) => {
    const columns = prepareColumns<Schema>( params );
    const values = prepareValues<Schema>( params );

    let query = `INSERT INTO ${ table } (${ columns }) VALUES (${ values })`;

    return defaultReturn( query );
  };

  return {
    select,
    insert,
  };
};
