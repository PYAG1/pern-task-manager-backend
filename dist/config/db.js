"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const Pool = require("pg").Pool;
//defining config for db connection
exports.pool = new Pool({
    "user": "postgres",
    "password": "pyag",
    "host": "localhost",
    "port": "5432",
    "database": "pernstack"
});
