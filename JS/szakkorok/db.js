import express from 'express';
import mysql from 'mysql2/promise';

const dbConfig = {
    host:'localhost',
    user:'root',
    password:'',
    port:3307,
    database:'szakkorok'
}

const pool = mysql.createPool(dbConfig);

export default pool;