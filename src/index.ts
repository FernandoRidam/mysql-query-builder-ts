import { createSchema } from './commands';

interface Schema {
  name: string;
  age: number;
  height: number;
};

const PersonSchema = createSchema<Schema>('Person');

console.log('');
console.log('==== INSERT ====');

console.log(
  PersonSchema
    .insert({
      age: 12,
      name: 'João',
      height: 1.55,
    })
    .exec()
);

console.log('');
console.log('==== SELECT ====');

console.log(
  PersonSchema
    .select()
    .exec()
);

console.log('');
console.log('==== SELECT WITH WHERE/AND/OR ====');

console.log(
  PersonSchema
    .select('age', 'name')
    .where({ column: 'age', operation: '>=', data: 18 })
    .and({ column: 'height', operation: '>', data: 1.45 })
    .exec()
);
