"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const Pool = require("pg").Pool;
//defining config for db connection
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const devConfig = {
    user: 'postgres',
    password: 'pyag',
    host: 'localhost',
    port: 5432,
    database: 'pernstack',
};
const prodConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'), // Ensure port is a number
    database: process.env.DB_NAME,
};
exports.pool = new Pool(process.env.NODE_ENV === 'production' ? prodConfig : devConfig);
/*export const pool = new Pool({
    "user":"postgres",
    "password":"pyag",
    "host":"localhost",
    "port":"5432",
    "database":"pernstack"
})
  ssl: {
    rejectUnauthorized: false, // SSL configuration for production if needed
  },
*/ 
