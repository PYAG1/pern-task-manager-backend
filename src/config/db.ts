const Pool = require("pg").Pool;
//defining config for db connection
import dotenv from"dotenv"
dotenv.config();


const devConfig = {
  user: 'postgres',
  password: 'pyag',
  host: 'localhost',
  port: 5432,
  database: 'pernstack',
};

const prodConfig = {
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  database: process.env.DB_NAME,

};

export const pool = new Pool(
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig
);


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