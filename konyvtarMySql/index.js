import express from 'express';
import pool from './db.js';

const app = express();
const PORT = 3000;

const kolcsonzesek = async () =>{
    try{
        let sql = 'SELECT * FROM kolcsonzesek';
        const [response] = await pool.query(sql);
        return JSON.parse(response);
    }
    catch(error){
        console.error("Hiba történt az adatok adatbázisból történő beolvasásakor.", error);
        return [];
    }
}

const konyvek = async () =>{
    try{
        let sql = 'SELECT * FROM konyvek';
        const [response] = await pool.query(sql);
        return JSON.parse(response);
    }
    catch(error){
        console.error("Hiba történt az adatok adatbázisból történő beolvasásakor.", error);
        return [];
    }
}

const olvasok = async () =>{
    try{
        let sql = 'SELECT * FROM olvasok';
        const [response] = await pool.query(sql);
        return JSON.parse(response);
    }
    catch(error){
        console.error("Hiba történt az adatok adatbázisból történő beolvasásakor.", error);
        return [];
    }
}