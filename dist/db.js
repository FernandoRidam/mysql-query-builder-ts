"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const db = (name) => {
    const table = (table, tableSchema) => {
        (0, utils_1.createAndUpdateTypeFiles)(name, table, tableSchema);
    };
    return {
        table,
    };
};
exports.default = db;
