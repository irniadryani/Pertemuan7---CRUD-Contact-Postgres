//mpdule pg
const Pool = require('pg').Pool

//connect dengan database
const pool = new Pool({
    user:"postgres",
    password:"irinn1601",
    database: "postgres",
    host:"localhost",
    port:5432
})

module.exports= pool