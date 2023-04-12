"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Table {
    constructor(name, database) {
        this.query = '';
        this._name = name;
        this.database = database;
    }
    ;
    get name() {
        return this._name;
    }
    ;
    insert(data) {
        const columns = (0, utils_1.prepareColumns)(data);
        const values = (0, utils_1.prepareValues)(data);
        this.query = `INSERT INTO ${this.database}.${this._name} (${columns}) VALUES (${values})`;
        return {
            exec: () => this.query,
        };
    }
    ;
    update(data) {
        const values = (0, utils_1.prepareColumnsWithValues)(data);
        this.query = `UPDATE ${this.database}.${this._name} SET ${values}`;
        return {
            where: this.prepareWhere(),
        };
    }
    ;
    delete() {
        this.query = `DELETE FROM ${this.database}.${this._name}`;
        return {
            where: this.prepareWhere(),
        };
    }
    ;
    select(...columns) {
        this.query = `SELECT ${columns.length > 0 ? columns.join(', ') : '*'} FROM  ${this.database}.${this._name}`;
        return {
            exec: () => this.query,
            join: this.prepareJoin(),
            where: this.prepareWhere(),
        };
    }
    ;
    prepareJoin() {
        ;
        return ({ type, table, on: { leftColumn, rightColumn, } }) => {
            this.query = this.query.concat(` ${type} JOIN ${table} ON ${this.database}.${this._name}.${leftColumn} = ${this.database}.${table}.${rightColumn}`);
            return {
                exec: () => this.query,
                where: this.prepareWhere(),
            };
        };
    }
    ;
    getColumnNameForJoin(column) {
        return column;
    }
    ;
    prepareWhere() {
        ;
        return ({ column, operator, data }) => {
            const conditionBase = (0, utils_1.formatConditionBase)({
                column,
                operator,
                data,
            });
            this.query = this.query.concat(` WHERE ${conditionBase}`);
            return {
                exec: () => this.query,
                and: this.prepareAnd(),
                or: this.prepareOr(),
            };
        };
    }
    ;
    prepareOr() {
        ;
        return ({ column, operator, data, priority }) => {
            const conditionBase = (0, utils_1.formatConditionBase)({
                column,
                operator,
                data,
            });
            this.query = (0, utils_1.formatConditionWithPriority)({
                query: this.query,
                conditionBase,
                priority,
                logicalOperator: 'OR',
            });
            return {
                exec: () => this.query,
                and: this.prepareAnd(),
                or: this.prepareOr(),
            };
        };
    }
    ;
    prepareAnd() {
        ;
        return ({ column, operator, data, priority }) => {
            const conditionBase = (0, utils_1.formatConditionBase)({
                column,
                operator,
                data,
            });
            this.query = (0, utils_1.formatConditionWithPriority)({
                query: this.query,
                conditionBase,
                priority,
                logicalOperator: 'AND',
            });
            return {
                exec: () => this.query,
                and: this.prepareAnd(),
                or: this.prepareOr(),
            };
        };
    }
    ;
}
;
exports.default = Table;
