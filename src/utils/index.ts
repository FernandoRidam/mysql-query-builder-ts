import {
  BetweenData,
  Condition,
  InData,
  LikeData,
  QueryCondition,
} from "../types";

export const prepareData = <Type>( data: Type ): any => {
  if( typeof data === 'string')
    return `'${ data }'`;

  return data;
};

export const prepareColumns = <Schema>( params: Schema ): string => {
  return Object.keys( params ).join(', ');
};

export const prepareValues = <Schema>( params: Schema ) => {
  type Columns = keyof Schema;

  const keys: Array<string> = Object.keys( params );

  return keys
    .map(( key: string ) => {
      let data = params[ key as Columns ];

      data = prepareData<typeof data>( data );

      return data;
    })
    .join(', ');
};

export const prepareColumnsWithValues = <Schema>( params: Partial<Schema> ) => {
  type Columns = keyof Schema;

  const keys: Array<string> = Object.keys( params );

  return keys
    .map(( key: string ) => {
      let data = params[ key as Columns ];

      return `${ key } = ${ prepareData<typeof data>( data )}`;
    })
    .join(', ');
};

export const formatConditionWithPriority = ({ logicalOperation, priority, conditionBase, query }: QueryCondition ) => {
  if( priority ) {
    switch ( priority ) {
      case 'START':
        query = query.concat(` ${ logicalOperation }`, ' (', ` ${ conditionBase }`);

        break;
      case 'END':
        query = query.concat(` ${ logicalOperation } ${ conditionBase }`, ' )');

        break;
    }

  } else {
    query = query.concat(` ${ logicalOperation } ${ conditionBase }`);
  }

  return query;
};

export const formatConditionBase = ({ column, operation, data }: Condition ) => {
  switch ( operation ) {
    case 'BETWEEN':
      return formatConditionBetween({ column, operation, data });

    case 'LIKE':
      return formatConditionLike({ column, operation, data });

    case 'IN':
      return formatConditionIn({ column, operation, data });

    default:
      data = prepareData<typeof data>( data );

      return `${ column as String } ${ operation } ${ data }`;
  }
};

const formatConditionBetween =  ({ column, operation, data }: Condition ) => {
  const {
    rangeStart,
    rangeEnd,
    not,
  } = data as BetweenData;

  return `${ column as String } ${ not ? 'NOT ' : ''}${ operation } ${ prepareData<typeof rangeStart>( rangeStart )} AND ${ prepareData<typeof rangeEnd>( rangeEnd )}`;
};

const formatConditionIn = ({ column, operation, data }: Condition ) => {
  const {
    data: inData,
    not,
  } = data as InData;

  const values = inData
    .map(( value ) => prepareData<typeof value>( value ))
    .join(', ');

  return `${ column as String } ${ not ? 'NOT ' : ''}${ operation } (${ values })`;
};

const formatConditionLike = ({ column, operation, data }: Condition ) => {
  const {
    data: likeData,
    operator,
    not,
  } = data as LikeData;

  switch ( operator ) {
    case 'STARTS':
      return `${ column as String } ${ operation } '${ data }%'`;
    case 'ENDS':
      return `${ column as String } ${ operation } '%${ data }'`;
    case 'CONTAINS':
      return `${ column as String } ${ operation } '%${ data }%'`;
  };
};
