"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../dist");
const dbname = (0, dist_1.Database)('dbname');
dbname.table('User', {
    code: 'pk',
    name: 'string',
});
dbname.table('Rating', {
    id: 'pk_auto_increment',
    user_id: 'number',
    note: 'number',
});
dist_1.Models.User
    .insert({
    name: ''
})
    .exec();
dist_1.Models.User
    .update({
    name: ''
})
    .where({
    column: 'User.id',
    operator: '=',
    data: 1
})
    .exec();
dist_1.Models.Rating
    .join({
    type: 'RIGHT',
    table: dist_1.Models.User.name,
    leftColumn: 'User.id',
    rightColumn: 'Rating.user_id'
})
    .select()
    .exec();
dist_1.Models.User
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
