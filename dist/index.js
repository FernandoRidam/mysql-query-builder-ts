"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
(0, commands_1.createSchema)({
    name: {
        type: 'string'
    },
    age: {
        type: 'number',
    }
});
