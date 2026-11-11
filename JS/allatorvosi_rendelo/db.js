import mysql from 'mysql2/promise';

const dbConfig = {
    host:'localhost',
    user:'root',
    port:3306,
    password:'',
    database:'rendelo'
}

const pool = mysql.createPool(dbConfig);

export default pool;