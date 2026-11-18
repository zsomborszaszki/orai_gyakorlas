import express from 'express';
import mysql from 'mysql2/promise';

const dbConfig = {
    host:'localhost',
    user:'root',
    database:'receptek',
    password:'',
    port:3306,
    dateStrings: true
}

const pool = mysql.createPool(dbConfig);

export default pool;