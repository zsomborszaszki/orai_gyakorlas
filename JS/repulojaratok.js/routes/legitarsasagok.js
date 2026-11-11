import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get("" , async (req,res) => {

    let sql = `SELECT legitarsasagok.kod, legitarsasagok.nev, 
    COUNT(DISTINCT jaratok.id) AS jaratDb, 
    COUNT(DISTINCT jaratok.hova_id) AS celallomasDb, ROUND(MIN(jaratok.ar)) AS legolcsobb, ROUND(AVG(jaratok.ar)) AS atlagAr 
    FROM legitarsasagok LEFT JOIN jaratok ON legitarsasagok.id = jaratok.legitarsasag_id
    GROUP BY legitarsasagok.kod ORDER BY jaratDb DESC , legitarsasagok.nev DESC`;

    let [eredmeny] = await pool.query(sql);

    res.send(eredmeny);
})


export default router;
