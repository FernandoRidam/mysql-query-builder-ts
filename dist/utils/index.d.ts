export declare const prepareData: <Type>(data: Type) => any;
export declare const prepareColumns: <Schema>(params: Schema) => string;
export declare const prepareValues: <Schema>(params: Schema) => string;
export declare const prepareColumnsWithValues: <Schema>(params: Partial<Schema>) => string;
export declare const formatConditionWithPriority: ({ logicalOperator, priority, conditionBase, query }: QueryCondition) => string;
export declare const formatConditionBase: ({ column, operator, data }: any) => string;
export declare const createAndUpdateTypeFiles: (name: string, table: string, tableSchema: TableSchema) => Promise<void>;
