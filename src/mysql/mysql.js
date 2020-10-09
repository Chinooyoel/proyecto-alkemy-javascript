const mysql = require("mysql");

let db_config = {
    host    :'localhost',
    user    :'root',
    password:'123456',
    database:'alkymer'
}

const connection = mysql.createConnection( db_config );

module.exports = connection;

