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
