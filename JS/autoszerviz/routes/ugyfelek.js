import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    let sql = `SELECT u.id, u.nev, u.telefon, COUNT(munkalapok.id) munkalapDb,
    COALESCE(
    SUM(
    ROUND(
    (12000*munkalapok.munkaora)+(SELECT COALESCE(SUM(f.db * a.ar), 0) 
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
        WHERE f.munkalap_id = munkalapok.id))),0) osszKoltes FROM ugyfelek u LEFT JOIN munkalapok ON u.id = munkalapok.ugyfel_id 
        GROUP BY u.id, u.nev, u.telefon ORDER BY osszKoltes DESC`;

    let [eredmeny] = await pool.query(sql);

    const ugyfelek = eredmeny.map(sor => ({
                ...sor,
                id: Number(sor.id),
                munkalapDb: Number(sor.munkalapDb),
                osszKoltes: Number(sor.osszKoltes),
    }));

    return res.status(200).json(ugyfelek);
})

export default router;