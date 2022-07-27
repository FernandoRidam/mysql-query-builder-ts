"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = exports.select = void 0;
;
;
const select = (columns) => {
    console.log(columns);
};
exports.select = select;
const createSchema = (table) => {
    const columns = '';
    return (0, exports.select)(columns);
};
exports.createSchema = createSchema;
