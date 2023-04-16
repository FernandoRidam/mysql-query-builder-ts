import {
  Database,
  Models,
} from './index';

const testeDatabase = Database('Teste');

testeDatabase.table('User', {
  id: 'number',
  nickname: 'string',
});

testeDatabase.table('Message', {
  id: 'number',
  user_id: 'number',
  message: 'string',
});

console.log('');
console.log('==== INSERT ====');

Models.User
  .insert({
    id: 1,
    nickname: 'João'
  })
  .exec()

Models.Message
  .insert({
    id: 1,
    user_id: 1,
    message: 'Testando querybuilder'
  })
  .exec()

console.log('');
console.log('==== SELECT WITH JOIN ====');

Models.User
  .join<Models.MessageColumns>({
    type: 'INNER',
    table: Models.Message.name,
    leftColumn: 'Message.user_id',
    rightColumn: 'User.id',
  })
  .select('User.id', 'User.nickname', 'Message.id', 'Message.user_id', 'Message.message')
  .where({
    column: 'User.nickname',
    operator: 'IN',
    data: {
      data: ['João', 'Maria'],
      not: true,
    }
  })
  .and({
    column: 'User.nickname',
    operator: '=',
    data: 1,
    priority: 'START'
  })
  .and({
    column: 'User.nickname',
    operator: '=',
    data: 1,
    priority: 'END'
  })
  .or({
    column: 'User.nickname',
    operator: '=',
    data: 1,
  })
  .exec()

  Models.User
  .select('User.id', 'User.nickname', { column: 'User.id', as: 'userId' })
  .exec()

// testeDatabase.table('Person', {
//   id: 'number',
//   name: 'string',
//   age: 'number',
//   height: 'number',
// });

// testeDatabase.table('Product', {
//   id: 'number',
//   description: 'string',
//   weight: 'number',
// });

// console.log('');
// console.log('==== INSERT ====');

// console.log(
//   Models.Person
//     .insert({
//       id: 1,
//       name: 'João Silva',
//       age: 12,
//       height: 1.55
//     })
//   .exec()
// );

// console.log('');
// console.log('==== UPDATE ====');

// console.log(
//   Models.Person
//     .update({
//       age: 13,
//       height: 1.55
//     })
//     .where({
//       column: 'Person.id',
//       operator: '=',
//       data: 1
//     })
//     .exec()
// );

// console.log('');
// console.log('==== DELETE ====');

// console.log(
//   Models.Person
//     .delete()
//     .where({
//       column: 'Person.id',
//       operator: '=',
//       data: 1
//     })
//     .exec()
// );

// console.log('');
// console.log('==== SELECT ====');

// console.log(
//   Models.Person
//     .select()
//     .exec()
// );

// console.log(
//   Models.Person
//     .select('Person.name', 'Person.age')
//     .exec()
// );

// console.log('');
// console.log('==== SELECT WITH WHERE/AND/OR ====');

// console.log(
//   Models.Person
//     .select('Person.age', 'Person.name')
//     .where({ column: 'Person.name', operator: '=', data: 'Maria'})
//     .and({ column: 'Person.age', operator: 'BETWEEN', data: { rangeStart: 11, rangeEnd: 19, not: true }})
//     .exec()
// );

// console.log(
//   Models.Person
//     .select('Person.age', 'Person.name')
//     .where({ column: 'Person.name', operator: 'IN', data: { data: ['Maria', 'João']}})
//     .exec()
// );

// console.log('');
// console.log('==== SELECT WITH JOIN ====');

// console.log(
//   Models.Person
//     .join<Models.ProductColumns>({
//       type: 'INNER',
//       table: Models.Person.name,
//       column: 'Person.age',
//       on: 'Product.weight',
//     })
//     .select('Person.age', 'Person.name', 'Person.name')
//     .where({
//       column: 'Person.age',
//       operator: '=',
//       data: 1
//     })
//     .exec()
// );
