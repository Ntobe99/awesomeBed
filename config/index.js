require('dotenv').config();
let {createPool}=require('mysql');

let connection =createPool(
    {
        host:process.env.HOST,
        database:process.env.DB_NAME,
        user:process.env.DB_USER,
        password:process.env.DB_PSWD,
        port:process.env.DB_PORT,
        multipleStatements:true

    }
)
module.exports=connection;