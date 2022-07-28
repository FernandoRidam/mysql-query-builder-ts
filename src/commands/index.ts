import { prepareColumns, prepareData, prepareValues } from "../utils";

type Type = String | Number | Date;

type Operation = '=' | '<>' | '<' | '>' | '<=' | '>=' | 'like';

type Priority = 'start' | 'end';

export const createSchema = <Schema>( table: string ) => {
  type Columns = keyof Schema;

  interface Condition {
    column: Columns;
    operation: Operation;
    data: Type;
  };

  interface AndOrCondition extends Condition {
    priority?: Priority;
  };

  const defaultReturn = ( query: string ) => {
    const exec = () => query.concat(';');

    return {
      exec,
    };
  };

  const select = ( ...columns: Array<Columns>) => {
    let query = `SELECT ${ columns.length> 0 ? columns.join(', ') : '*'} FROM ${ table }`;

    const where = ({ column, operation, data }: Condition ) => {
      data = prepareData<typeof data>( data );

      query = query.concat(` WHERE ${ column as String } ${ operation } ${ data }`);

      return {
        ...defaultReturn( query ),
        and,
        or,
      };
    };

    const and = ({ column, operation, data, priority }: AndOrCondition ) => {
      data = prepareData<typeof data>( data );

      const conditionBase = `${ column as String } ${ operation } ${ data }`;

      if( priority ) {
        if( priority === 'start')
          query = query.concat(' AND', ' (', ` ${ conditionBase }`);

        if( priority === 'end')
          query = query.concat(` AND ${ conditionBase }`, ' )');

      } else {
        query = query.concat(` AND ${ conditionBase }`);
      }

      return {
        ...defaultReturn( query ),
        and,
        or,
      };
    };

    const or = ({ column, operation, data, priority }: AndOrCondition ) => {
      data = prepareData<typeof data>( data );

      const conditionBase = `${ column as String } ${ operation } ${ data }`;

      if( priority ) {
        if( priority === 'start')
          query = query.concat(' OR', ' (', ` ${ conditionBase }`);

        if( priority === 'end')
          query = query.concat(` OR ${ conditionBase }`, ' )');

      } else {
        query = query.concat(` OR ${ conditionBase }`);
      }

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
