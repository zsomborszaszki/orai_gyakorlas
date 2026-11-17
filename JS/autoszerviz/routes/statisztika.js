import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/statuszok', async (req,res) => {

    const statuszok = ['felvéve', 'javítás alatt', 'kész', 'átadva'];

    let sql = `SELECT m.statusz, COUNT(m.id) db FROM munkalapok m GROUP BY m.statusz ORDER BY 
    FIELD(m.statusz, 'felvéve', 'javítás alatt', 'kész', 'átadva')`;

    let [eredmeny] = await pool.query(sql);

    return res.status(200).json(eredmeny);

})

router.get('/alkatreszek', async (req,res) => {

        let sql = `SELECT a.nev alkatresz, SUM(f.db) felhasznaltDb, SUM(f.db * a.ar) bevetel
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id GROUP BY a.id, a.nev ORDER BY bevetel DESC`;

        const [eredmeny] = await pool.query(sql);

        const statisztika = eredmeny.map(sor => ({
            alkatresz: sor.alkatresz,
            felhasznaltDb: Number(sor.felhasznaltDb),
            bevetel: Number(sor.bevetel)
        }));

        return res.status(200).json(statisztika);
});


export default router;