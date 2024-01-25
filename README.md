# Query Builder

## Data Manipulation
### SQL Commands
- [x] INSERT
  ```javascript
  // INSERT INTO dbname.User (name) VALUES ('Jhon');
  User
    .insert({
      name: 'Jhon',
    })
    .exec();
  ```
- [x] UPDATE
  ```javascript
  // UPDATE dbname.User SET name = 'Jhon' WHERE User.id = 1;
  User
    .update({
      id: 1,
      name: 'Jhon',
    })
    .where({
      column: 'User.id',
      operator: '=',
      data: 1
    })
    .exec();
  ```
- [x] DELETE
  ```javascript
  // DELETE FROM dbname.User WHERE User.id = 1;
  User
    .delete()
    .where({
      column: 'User.id',
      operator: '=',
      data: 1
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
- [x] LEFT JOIN
- [x] RIGHT JOIN

### Clauses
- [x] WHERE
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1;
  User
    .select()
    .where({
      column: 'User.id',
      operator: '=',
      data: 1
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
  // SELECT * FROM dbname.User WHERE User.id = 1 AND User.name = 'Jhon';
  User
    .select()
    .where({
      column: 'User.id',
      operator: '=',
      data: 1,
    }).and({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
    })
    .exec();

  // SELECT * FROM dbname.User WHERE User.id = 1 AND ( User.name = 'Jhon' OR User.name = 'Lorem' );
  User
    .select()
    .where({
      column: 'User.id',
      operator: '=',
      data: 1,
    }).and({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
      priority: 'START'
    })
    .or({
      column: 'User.name',
      operator: '=',
      data: 'Lorem',
      priority: 'END'
    })
    .exec();
  ```
- [x] OR
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1 OR User.name = 'Jhon';
  User
    .select()
    .where({
      column: 'User.id',
      operator: '=',
      data: 1,
    }).or({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
    })
    .exec();

  // SELECT * FROM dbname.User WHERE User.id = 1 OR ( User.name = 'Jhon' AND User.name = 'Lorem' );
  User
    .select()
    .where({
      column: 'User.id',
      operator: '=',
      data: 1,
    }).or({
      column: 'User.name',
      operator: '=',
      data: 'Jhon',
      priority: 'START'
    })
    .and({
      column: 'User.name',
      operator: '=',
      data: 'Lorem',
      priority: 'END'
    })
    .exec();
  ```
- [ ] NOT

### Relational Operators
- [x] EQUAL
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1;
  User
    .select()
    .where({
      column: 'User.id',
      operator: '=', // Equal Operator
      data: 1
    })
    .exec();
  ```
- [x] GREATER THAN
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1;
  User
    .select()
    .where({
      column: 'User.id',
      operator: '>', // Greater Than operator
      data: 1
    })
    .exec();
  ```
- [x] LESS THAN
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1;
  User
    .select()
    .where({
      column: 'User.id',
      operator: '<', // Less Than operator
      data: 1
    })
    .exec();
  ```
- [x] GREATER THAN OR EQUAL
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1;
  User
    .select()
    .where({
      column: 'User.id',
      operator: '>=', // Greater Than Or Equal operator
      data: 1
    })
    .exec();
  ```
- [x] LESS THAN OR EQUAL
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1;
  User
    .select()
    .where({
      column: 'User.id',
      operator: '<=', // Less Than Or Equal operator
      data: 1
    })
    .exec();
  ```
- [x] DIFFERENT THAN
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id = 1;
  User
    .select()
    .where({
      column: 'User.id',
      operator: '<>', // Different Than operator
      data: 1
    })
    .exec();
  ```
- [x] LIKE
  ```javascript
  // SELECT * FROM dbname.User WHERE User.name LIKE 'Jh%';
  User
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
  // SELECT * FROM dbname.User WHERE User.id BETWEEN 1 AND 10;
  User
    .select()
    .where({
      column: 'User.id',
      operator: 'BETWEEN',
      data: {
        rangeStart: 1,
        rangeEnd: 10,
        not: false,
      }
    })
    .exec();
  ```
- [x] IN
  ```javascript
  // SELECT * FROM dbname.User WHERE User.id IN (1, 2, 5);
  User
    .select()
    .where({
      column: 'User.id',
      operator: 'IN',
      data: {
        data: [1, 2, 5],
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
