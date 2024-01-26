# Query Builder

## Create Reference Database
```javascript
const dbname = Database('dbname');
```

## Create Table Schema
```javascript
dbname.table('User', {
  code: 'pk',
  name: 'string',
});

dbname.table('Rating', {
  id: 'pk_auto_increment',
  user_code: 'fk',
  note: 'number',
});
```

## Data Manipulation
### SQL Commands
- [x] INSERT
  ```javascript
  // INSERT INTO dbname.User (code, name) VALUES ('1234', 'Jhon');
  Models.User
    .insert({
      code: '1234',
      name: 'Jhon'
    })
    .exec();
  ```
- [x] UPDATE
  ```javascript
  // UPDATE dbname.User SET name = 'Zoe' WHERE User.code = '1234';
  Models.User
    .update({
      name: 'Zoe',
    })
    .where({
      column: 'User.code',
      operator: '=',
      data: '1234'
    })
    .exec();
  ```
- [x] DELETE
  ```javascript
  // DELETE FROM dbname.User WHERE User.code = '1234';
  Models.User
    .delete()
    .where({
      column: 'User.code',
      operator: '=',
      data: '1234'
    })
    .exec();
  ```

## Data Query
### SQL Commands
- [x] SELECT
  - All attributes
    ```javascript
    // SELECT * FROM dbname.User;
    User
      .select()
      .exec();
    ```
  - Only attributes
    ```javascript
    // SELECT User.name FROM dbname.User;
    User
      .select('User.name')
      .exec();
    ```

### Join Clauses
- [x] INNER JOIN
  ```javascript
  // SELECT * FROM dbname.Rating INNER JOIN dbname.User ON dbname.User.code = dbname.Rating.user_code;
  Models.Rating
    .join<Models.UserColumns>({
      type: 'INNER',
      table: Models.User.name,
      leftColumn: 'User.code',
      rightColumn: 'Rating.user_code'
    })
    .select()
    .exec();
  ```
- [x] LEFT JOIN
  ```javascript
  // SELECT * FROM dbname.Rating LEFT JOIN dbname.User ON dbname.User.code = dbname.Rating.user_code;
  Models.Rating
    .join<Models.UserColumns>({
      type: 'LEFT',
      table: Models.User.name,
      leftColumn: 'User.code',
      rightColumn: 'Rating.user_code'
    })
    .select()
    .exec();
  ```
- [x] RIGHT JOIN
  ```javascript
  // SELECT * FROM dbname.Rating RIGHT JOIN dbname.User ON dbname.User.code = dbname.Rating.user_code;
  Models.Rating
    .join<Models.UserColumns>({
      type: 'RIGHT',
      table: Models.User.name,
      leftColumn: 'User.code',
      rightColumn: 'Rating.user_code'
    })
    .select()
    .exec();
  ```

### Clauses
- [x] WHERE
  ```javascript
  // SELECT * FROM dbname.User WHERE User.code = '1234';
  Models.User
    .select()
    .where({
      column: 'User.code',
      operator: '=',
      data: '1234',
    })
    .exec();
  ```
- [ ] GROUP BY
- [ ] HAVING
- [ ] ORDER BY
- [ ] DISTINCT
- [ ] UNION

### Logical Operators
- [x] AND
  ```javascript
  // SELECT * FROM dbname.User WHERE User.code = '1234' AND User.name = 'Jhon';
  Models.User
    .select()
    .where({
      column: 'User.code',
      operator: '=',
      data: '1234',
    })
    .and({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
    })
    .exec();

  // SELECT * FROM dbname.User WHERE User.code = '1234' AND ( User.name = 'Jhon' OR User.name = 'Zoe' );
  Models.User
    .select()
    .where({
      column: 'User.code',
      operator: '=',
      data: '1234',
    })
    .and({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
      priority: 'START',
    }).or({
      column: 'User.name',
      operator: '=',
      data: 'Zoe',
      priority: 'END',
    })
    .exec();
  ```
- [x] OR
  ```javascript
  // SELECT * FROM dbname.User WHERE User.code = '1234' OR User.name = 'Jhon';
  Models.User
    .select()
    .where({
      column: 'User.code',
      operator: '=',
      data: '1234',
    })
    .or({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
    })
    .exec();

  // SELECT * FROM dbname.User WHERE User.code = '1234' OR ( User.name = 'Jhon' AND User.name = 'Zoe' );
  Models.User
    .select()
    .where({
      column: 'User.code',
      operator: '=',
      data: '1234',
    })
    .or({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
      priority: 'START',
    }).and({
      column: 'User.name',
      operator: '=',
      data: 'Zoe',
      priority: 'END',
    })
    .exec();
  ```
- [ ] NOT

### Relational Operators
- [x] EQUAL
  ```javascript
  // SELECT * FROM dbname.User WHERE Rating.note = 1;
  Models.Rating
    .select()
    .where({
      column: 'Rating.note',
      operator: '=', // Equal Operator
      data: 1,
    })
    .exec();
  ```
- [x] GREATER THAN
  ```javascript
  // SELECT * FROM dbname.User WHERE Rating.note > 1;
  Models.Rating
    .select()
    .where({
      column: 'Rating.note',
      operator: '>', // Greater Than operator
      data: 1,
    })
    .exec();
  ```
- [x] LESS THAN
  ```javascript
  // SELECT * FROM dbname.User WHERE Rating.note < 1;
  Models.Rating
    .select()
    .where({
      column: 'Rating.note',
      operator: '<', // Less Than operator
      data: 1,
    })
    .exec();
  ```
- [x] GREATER THAN OR EQUAL
  ```javascript
  // SELECT * FROM dbname.User WHERE Rating.note >= 1;
  Models.Rating
    .select()
    .where({
      column: 'Rating.note',
      operator: '>=', // Greater Than Or Equal operator
      data: 1,
    })
    .exec();
  ```
- [x] LESS THAN OR EQUAL
  ```javascript
  // SELECT * FROM dbname.User WHERE Rating.note <= 1;
  Models.Rating
    .select()
    .where({
      column: 'Rating.note',
      operator: '<=', // Less Than Or Equal operator
      data: 1,
    })
    .exec();
  ```
- [x] DIFFERENT THAN
  ```javascript
  // SELECT * FROM dbname.User WHERE Rating.note <> 1;
  Models.Rating
    .select()
    .where({
      column: 'Rating.note',
      operator: '<>', // Different Than operator
      data: 1,
    })
    .exec();
  ```
- [x] LIKE
  ```javascript
  // SELECT * FROM dbname.User WHERE User.name LIKE 'Jh%';
  Models.User
    .select()
    .where({
      column: 'User.name',
      operator: 'LIKE',
      data: {
        data: 'Jh',
        likeOperator: 'STARTS',
        not: false,
      }
    })
    .exec();
  ```
- [x] BETWEEN
  ```javascript
  // SELECT * FROM dbname.Rating WHERE Rating.note BETWEEN 3 AND 5;
  Models.Rating
    .select()
    .where({
      column: 'Rating.note',
      operator: 'BETWEEN',
      data: {
        rangeStart: 3,
        rangeEnd: 5,
        not: false,
      },
    })
    .exec();
  ```
- [x] IN
  ```javascript
  // SELECT * FROM dbname.User WHERE User.name IN ('Jhon', 'Zoe');
  Models.User
    .select()
    .where({
      column: 'User.name',
      operator: 'IN',
      data: {
        data: ['Jhon', 'Zoe'],
        not: false,
      }
    })
    .exec();
  ```

### Aggregation Functions
- [ ] AVG
- [ ] COUNT
- [ ] SUM
- [ ] MAX
- [ ] MIN

# License
mysql-query-builder-ts is licensed under the MIT license. [MIT](https://github.com/FernandoRidam/mysql-query-builder-ts/blob/master/LICENSE)
