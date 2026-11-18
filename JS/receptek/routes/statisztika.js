import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/kategoriak', async (req, res) => {

    const sql = ` SELECT r.kategoria, COUNT(r.id) AS receptDb, ROUND(AVG(r.ido)) AS atlagIdo, 
    ROUND(AVG(k.koltseg)) AS atlagKoltseg FROM receptek r LEFT JOIN 
    ( SELECT rh.recept_id, SUM(ROUND(rh.mennyiseg * h.egysegar)) AS koltseg 
    FROM recept_hozzavalok rh JOIN hozzavalok h ON h.id = rh.hozzavalo_id GROUP BY rh.recept_id ) k 
    ON k.recept_id = r.id GROUP BY r.kategoria ORDER BY FIELD( r.kategoria, 'reggeli', 'leves', 'főétel', 'desszert' )`;

    let [eredmeny] = await pool.query(sql);

    eredmeny = eredmeny.map(sor =>
    ({
        ...sor,
        atlagIdo: Number(sor.atlagIdo),
        atlagKoltseg: Number(sor.atlagKoltseg)
    })
    )

    return res.status(200).json(eredmeny);
});

export default router;