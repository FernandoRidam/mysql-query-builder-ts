type Type = String | Number | Date;

type Operation = '=' | '<>' | '<' | '>' | '<=' | '>=' | 'like';

export const createSchema = <Schema>( table: string ) => {
  type Columns = keyof Schema;

  interface Condition {
    column: Columns;
    operation: Operation;
    data: Type;
  };

  const defaultReturn = ( query: string ) => {
    const exec = () => query;

    return {
      exec,
    };
  };

  const select = ( ...columns: Array<Columns>) => {
    let query = `SELECT ${ columns.length> 0 ? columns.join(', ') : '*'} FROM ${ table }`;

    const where = ({ column, operation, data }: Condition ) => {
      query = query.concat(` WHERE ${ column as String } ${ operation } ${ data }`);

      return {
        ...defaultReturn( query ),
        where,
        and,
        or,
      };
    };

    const and = ({ column, operation, data }: Condition ) => {
      query = query.concat(` AND ${ column as String } ${ operation } ${ data }`);

      return {
        ...defaultReturn( query ),
        where,
        and,
        or,
      };
    };

    const or = ({ column, operation, data }: Condition ) => {
      query = query.concat(` OR ${ column as String } ${ operation } ${ data }`);

      return {
        ...defaultReturn( query ),
        where,
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
    const keys: Array<string> = Object.keys( params );

    let query = `INSERT INTO ${ table } (${ keys.join(', ')}) VALUES (${ keys.map(( key: string ) => params[ key as Columns ]).join(', ')})`;

    return defaultReturn( query );
  };

  return {
    select,
    insert,
  };
};
