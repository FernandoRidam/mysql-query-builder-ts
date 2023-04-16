import { prepareCommands } from '../commands';

import { TableType } from '../@types/tables';

import { AsParams } from '../types';
const database = 'Teste';
const table = 'User';

export interface SchemaUser {
  id: number;
  nickname: string;
};

export type UserColumns = 'User.id' | 'User.nickname';

export const User = prepareCommands<SchemaUser, UserColumns, TableType>( database, table as TableType )();