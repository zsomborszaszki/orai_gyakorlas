import express from 'express';
import pool from '../db.js';

const router = express.Router();


router.get('', async (req,res) => {

    let sql = ` SELECT h.id, h.nev, h.mertekegyseg, h.egysegar, COUNT(rh.recept_id) AS receptDb 
    FROM hozzavalok h LEFT JOIN recept_hozzavalok rh ON rh.hozzavalo_id = h.id 
    GROUP BY h.id, h.nev, h.mertekegyseg, h.egysegar ORDER BY receptDb DESC, h.nev ASC`;

    let [eredmeny] = await pool.query(sql);

    return res.status(200).json(eredmeny);
})


router.get('/nem-hasznalt', async (req,res) => {

    let sql = ` SELECT h.id, h.nev, h.mertekegyseg, h.egysegar, COUNT(rh.recept_id) AS receptDb 
    FROM hozzavalok h LEFT JOIN recept_hozzavalok rh ON rh.hozzavalo_id = h.id 
    GROUP BY h.id, h.nev, h.mertekegyseg, h.egysegar HAVING COUNT(rh.recept_id)<1 ORDER BY receptDb DESC, h.nev ASC`;

    let [eredmeny] = await pool.query(sql);

    return res.status(200).json(eredmeny);
})

export default router;