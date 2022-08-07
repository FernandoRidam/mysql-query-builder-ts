import {
  createSchema,
} from './commands';

interface PersonSchema {
  id?: number;
  name: string;
  age: number;
  height: number;
};

const Person = createSchema<PersonSchema>('Person');

console.log('');
console.log('==== INSERT ====');

console.log(
  Person
    .insert({
      age: 12,
      name: 'João',
      height: 1.55,
    })
    .exec()
);

console.log('');
console.log('==== UPDATE ====');

console.log(
  Person
    .update({
      height: 1.65,
    })
    .where({ column: 'id', operation: '=', data: 1 })
    .exec()
);

console.log('');
console.log('==== SELECT ====');

console.log(
  Person
    .select()
    .exec()
);

console.log('');
console.log('==== SELECT WITH WHERE/AND/OR ====');

console.log(
  Person
    .select('age', 'name')
    .where({ column: 'name', operation: '=', data: 'Maria'})
    .and({ column: 'age', operation: 'BETWEEN', data: { rangeStart: 11, rangeEnd: 19, not: true }})
    .exec()
);

console.log(
  Person
    .select('age', 'name')
    .where({ column: 'name', operation: 'IN', data: { data: ['Maria', 'João'], not: true }})
    .exec()
);

interface ProductSchema {
  description: string;
  weight: number;
};

const Product = createSchema<ProductSchema>('Product');

console.log('');
console.log('==== INSERT ====');

console.log(
  Product
    .insert({
      description: 'Pão Francês',
      weight: 1.0
    })
    .exec()
);
