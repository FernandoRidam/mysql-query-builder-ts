"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareCommands = void 0;
const utils_1 = require("../utils");
const prepareCommands = (database, table) => {
    const commands = () => {
        const defaultReturn = (query) => {
            const exec = () => {
                query = query.concat(';');
                console.log("Query => ", query);
                return query;
            };
            return {
                exec,
            };
        };
        const insert = (params) => {
            const columns = (0, utils_1.prepareColumns)(params);
            const values = (0, utils_1.prepareValues)(params);
            let query = `INSERT INTO ${database}.${table} (${columns}) VALUES (${values})`;
            return defaultReturn(query);
        };
        const update = (params) => {
            const values = (0, utils_1.prepareColumnsWithValues)(params);
            let query = `UPDATE ${database}.${table} SET ${values}`;
            return {
                ...prepareWhere(query),
            };
        };
        const del = () => {
            let query = `DELETE FROM ${database}.${table}`;
            return {
                ...defaultReturn(query),
                ...prepareWhere(query),
            };
        };
        const select = (...columns) => {
            let query = `SELECT ${columns.length > 0 ? columns.map((column) => {
                if (!!column) {
                    switch (typeof column) {
                        case 'string':
                            return column;
                        case 'object':
                            let current = column;
                            return `${String(current.column)} as ${current.as}`;
                        default:
                            return column;
                    }
                }
            }).join(', ') : '*'} FROM ${database}.${table}`;
            return {
                ...defaultReturn(query),
                ...prepareWhere(query),
            };
        };
        const prepareSelectJoin = (join) => {
            const select = (...columns) => {
                let query = `SELECT ${columns.length > 0 ? columns.map((column) => {
                    if (!!column) {
                        switch (typeof column) {
                            case 'string':
                                return column;
                            case 'object':
                                let current = column;
                                return `${String(current.column)} as ${current.as}`;
                            default:
                                return column;
                        }
                    }
                }).join(', ') : '*'} FROM ${database}.${table}${join}`;
                return {
                    ...defaultReturn(query),
                    ...prepareWhereJoin(query),
                };
            };
            return {
                select,
            };
        };
        const join = ({ type, table: _table, leftColumn, rightColumn, }) => {
            const query = ` ${type} JOIN ${database}.${_table} ON ${database}.${String(leftColumn)} = ${database}.${String(rightColumn)}`;
            return {
                ...prepareSelectJoin(query),
            };
        };
        const prepareWhere = (query) => {
            const where = ({ column, operator, data }) => {
                const conditionBase = (0, utils_1.formatConditionBase)({
                    column,
                    operator,
                    data,
                });
                query = query.concat(` WHERE ${conditionBase}`);
                return {
                    ...defaultReturn(query),
                    ...prepareOr(query),
                    ...prepareAnd(query),
                };
            };
            return {
                where,
            };
        };
        const prepareWhereJoin = (query) => {
            const where = ({ column, operator, data }) => {
                const conditionBase = (0, utils_1.formatConditionBase)({
                    column,
                    operator,
                    data,
                });
                query = query.concat(` WHERE ${conditionBase}`);
                return {
                    ...defaultReturn(query),
                    ...prepareOrJoin(query),
                    ...prepareAndJoin(query),
                };
            };
            return {
                where,
            };
        };
        const prepareAnd = (query) => {
            const and = ({ column, operator, data, priority }) => {
                const conditionBase = (0, utils_1.formatConditionBase)({
                    column,
                    operator,
                    data,
                });
                query = (0, utils_1.formatConditionWithPriority)({
                    query,
                    conditionBase,
                    priority,
                    logicalOperator: 'AND',
                });
                return {
                    ...defaultReturn(query),
                    ...prepareOr(query),
                    and,
                };
            };
            return {
                and,
            };
        };
        const prepareAndJoin = (query) => {
            const and = ({ column, operator, data, priority }) => {
                const conditionBase = (0, utils_1.formatConditionBase)({
                    column,
                    operator,
                    data,
                });
                query = (0, utils_1.formatConditionWithPriority)({
                    query,
                    conditionBase,
                    priority,
                    logicalOperator: 'AND',
                });
                return {
                    ...defaultReturn(query),
                    ...prepareOrJoin(query),
                    and,
                };
            };
            return {
                and,
            };
        };
        const prepareOr = (query) => {
            const or = ({ column, operator, data, priority }) => {
                const conditionBase = (0, utils_1.formatConditionBase)({
                    column,
                    operator,
                    data,
                });
                query = (0, utils_1.formatConditionWithPriority)({
                    query,
                    conditionBase,
                    priority,
                    logicalOperator: 'OR',
                });
                return {
                    ...defaultReturn(query),
                    ...prepareAnd(query),
                    or,
                };
            };
            return {
                or,
            };
        };
        const prepareOrJoin = (query) => {
            const or = ({ column, operator, data, priority }) => {
                const conditionBase = (0, utils_1.formatConditionBase)({
                    column,
                    operator,
                    data,
                });
                query = (0, utils_1.formatConditionWithPriority)({
                    query,
                    conditionBase,
                    priority,
                    logicalOperator: 'OR',
                });
                return {
                    ...defaultReturn(query),
                    ...prepareAndJoin(query),
                    or,
                };
            };
            return {
                or,
            };
        };
        return {
            insert,
            update,
            delete: del,
            select,
            join,
            name: table,
        };
    };
    return commands;
};
exports.prepareCommands = prepareCommands;
