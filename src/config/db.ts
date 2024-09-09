const Pool = require("pg").Pool;
//defining config for db connection
export const pool = new Pool({
    "user":"postgres",
    "password":"pyag",
    "host":"localhost",
    "port":"5432",
    "database":"pernstack"
})

