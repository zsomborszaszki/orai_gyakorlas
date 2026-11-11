import express from 'express';
import pool from '../db.js';

const router = express.Router();



router.get('/fajok', async (req,res) => {

       let sql = `SELECT allatok.faj, COUNT(DISTINCT allatok.id) AS allatDb, COUNT(kezelesek.id) AS kezelesDb, 
       COALESCE(SUM(kezelesek.dij), 0) AS bevetel FROM allatok LEFT JOIN kezelesek ON allatok.id = kezelesek.allat_id
       GROUP BY allatok.faj ORDER BY allatok.faj`;

       let [eredmeny] = await pool.query(sql);

       res.send(eredmeny);
})

router.get('/havi', async (req,res) => {

       let sql = `SELECT DATE_FORMAT(datum, '%Y-%m') AS honap, COUNT(id) AS kezelesDb, SUM(dij) AS bevetel
       FROM kezelesek GROUP BY DATE_FORMAT(datum, '%Y-%m') ORDER BY honap ASC`;

       let [eredmeny] = await pool.query(sql);

       res.send(eredmeny);
})

router.get('/gazdak', async (req,res) => {

       let sql = `SELECT gazdak.nev AS gazda, COUNT(DISTINCT allatok.id) AS allatDb, 
       COALESCE(SUM(kezelesek.dij), 0) AS osszKoltes 
    FROM gazdak LEFT JOIN allatok ON gazdak.id = allatok.gazda_id
    LEFT JOIN kezelesek ON allatok.id = kezelesek.allat_id GROUP BY gazdak.id, gazdak.nev 
    ORDER BY osszKoltes DESC;`;

       let [eredmeny] = await pool.query(sql);

       res.send(eredmeny);
})


export default router;