import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    const {nap,vanHely} = req.query;
    let sql;
    let eredmeny;

    if(Object.keys(req.query)==0)
    {
        sql = `SELECT szakkorok.id, szakkorok.nev, 
        szakkorok.tanar, szakkorok.nap, szakkorok.max_letszam,
        COUNT(jelentkezesek.diak_id) jelentkezett,
        (szakkorok.max_letszam -  COUNT(jelentkezesek.diak_id)) AS szabadhely
        FROM szakkorok LEFT JOIN jelentkezesek on szakkorok.id = jelentkezesek.szakkor_id 
        GROUP BY  szakkorok.id, szakkorok.nev, 
        szakkorok.tanar, szakkorok.nap, szakkorok.max_letszam ORDER BY
        FIELD(szakkorok.nap, 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'),
        szakkorok.nev ASC;`;

        [eredmeny] = await pool.query(sql);

        res.json(eredmeny);
    }

    if(nap!=null)
    {
        sql = `SELECT szakkorok.nev, 
        (szakkorok.max_letszam -  COUNT(jelentkezesek.diak_id)) AS szabadhely  
        FROM szakkorok LEFT JOIN jelentkezesek 
        ON szakkorok.id = jelentkezesek.szakkor_id WHERE nap = ? GROUP BY szakkorok.nev`;

        [eredmeny] = await pool.query(sql,nap);

        res.json(eredmeny);
    }

    if(vanHely != null)
    {
        sql = sql = `SELECT szakkorok.nev, 
        (szakkorok.max_letszam -  COUNT(jelentkezesek.diak_id)) AS szabadhely  
        FROM szakkorok LEFT JOIN jelentkezesek 
        ON szakkorok.id = jelentkezesek.szakkor_id GROUP BY szakkorok.nev
        HAVING szabadhely > 0`;
    
        [eredmeny] = await pool.query(sql);

        res.json(eredmeny);
    }
})

router.get('/:id', async (req,res) => {

})


export default router;