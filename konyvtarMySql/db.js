import mysql from "mysql2/promise";

const dbConfig = {
    host:'localhost',
    user:'root',
    password:'root',
    database:'filmek',
    port: 3306
};

const pool = mysql.createPool(dbConfig);

export default pool;