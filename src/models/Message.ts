import { prepareCommands } from '../commands';

import { TableType } from '../@types/tables';

import { AsParams } from '../types';
const database = 'Teste';
const table = 'Message';

export interface SchemaMessage {
  id: number;
  user_id: number;
  message: string;
};

export type MessageColumns = 'Message.id' | 'Message.user_id' | 'Message.message';

export const Message = prepareCommands<SchemaMessage, MessageColumns, TableType>( database, table as TableType )();