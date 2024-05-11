const { Pool, types } = require('pg');


// connection string for development 
let DB_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
if(process.env.POSTGRES_URL) {
    DB_URL = process.env.POSTGRES_URL;
}
// cast numeric (OID 1700) as float (string is default in node-postgres)
types.setTypeParser(1700, function (val) {
    return parseFloat(val);
});

// instantiate pool 
const pool = new Pool({
    connectionString: DB_URL
});

module.exports = pool;