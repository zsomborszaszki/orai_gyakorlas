import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/fogyo', async (req,res) => {

    let sql;
    let eredmeny;
    const min = req.query.min;

    if(min!=null && isNaN(min))
    {
        return res.status(400).json({error:'Hibás megadott paraméter.'});
    }

    if(Object.keys(req.query).length==0)
    {
        sql = `SELECT alkatreszek.id, alkatreszek.nev, alkatreszek.ar, alkatreszek.keszlet FROM alkatreszek WHERE keszlet<3 ORDER BY keszlet ASC`;

        [eredmeny] = await pool.query(sql);

        const alkatreszek = eredmeny.map(sor => ({
                ...sor,
                ar: Number(sor.ar)
        }));
    
        return res.status(200).json(alkatreszek);
    }
        
    sql = `SELECT alkatreszek.id, alkatreszek.nev, alkatreszek.ar, alkatreszek.keszlet FROM alkatreszek WHERE keszlet< ? ORDER BY keszlet ASC`;
    [eredmeny] = await pool.query(sql,min);

    const alkatreszek = eredmeny.map(sor => ({
                ...sor,
                ar: Number(sor.ar)
    }));
    
    return res.status(200).json(alkatreszek);

})


export default router;