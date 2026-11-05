import mysql2 from 'mysql2/promise';

const dbConfig = {
    host:'localhost',
    user:'root',
    password:'root',
    database:'jaratok',
    port:'3307'
}

const pool = mysql2.createPool(dbConfig);

export default pool;
