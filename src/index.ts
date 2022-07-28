import { createSchema } from './commands';

interface PersonSchema {
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
    .where({ column: 'age', operation: '>=', data: 18 })
    .or({ column: 'height', operation: '>', data: 1.45, priority: 'start' })
    .and({ column: 'name', operation: '=', data: 'Maria'})
    .and({ column: 'age', operation: '>=', data: 16, priority: 'end' })
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
