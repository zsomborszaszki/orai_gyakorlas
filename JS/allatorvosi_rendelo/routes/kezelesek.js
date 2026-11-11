import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    const {tol,ig,faj} = req.query;

    let sql = ` SELECT kezelesek.id, DATE_FORMAT(kezelesek.datum, '%Y-%m-%d') AS datum, 
    allatok.nev AS allat, allatok.faj, gazdak.nev AS gazda, kezelesek.leiras, kezelesek.dij 
    FROM kezelesek LEFT JOIN allatok ON kezelesek.allat_id = allatok.id 
    LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id WHERE 1=1`;


    if (tol) {
        sql += ` AND kezelesek.datum >= ?`;
    }

    if (ig) {
        sql += ` AND kezelesek.datum <= ?`;
    }

    if (faj) {
        sql += ` AND allatok.faj = ?`;
    }

    sql += ` ORDER BY kezelesek.datum ASC`;

    let [eredmeny] = await pool.query(sql, [tol,ig,faj]);

    res.send(eredmeny);


})



export default router;