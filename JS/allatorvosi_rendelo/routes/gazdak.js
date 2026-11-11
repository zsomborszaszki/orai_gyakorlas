import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    const {varos} = req.query;
    let sql;
    let eredmeny;

    if(Object.keys(req.query).length == 0)
    {
        sql = `SELECT gazdak.id, gazdak.nev, gazdak.varos, COUNT(allatok.id) AS allatDb 
        FROM gazdak LEFT JOIN allatok ON gazdak.id = allatok.gazda_id GROUP BY gazdak.id, gazdak.nev, gazdak.varos ORDER BY nev`;
        
        [eredmeny] = await pool.query(sql);

        res.send(eredmeny);
    }

    if(varos!=null)
    {
        sql = `SELECT gazdak.id, gazdak.nev, gazdak.varos, COUNT(allatok.id) AS allatDb 
        FROM gazdak LEFT JOIN allatok ON gazdak.id = allatok.gazda_id WHERE gazdak.varos=? 
        GROUP BY gazdak.id, gazdak.nev, gazdak.varos ORDER BY nev`;

        [eredmeny] = await pool.query(sql,varos);

        res.send(eredmeny);
    }
})


    router.get('/:id', async (req,res) => {

        const id = req.params.id;

        if(isNaN(id))
        {
            return res.status(400).json({error:'Helytelen azonosító formátum.'});
        }

        let sql = `SELECT gazdak.id FROM gazdak WHERE gazdak.id = ?`;
        let [eredmeny] = await pool.query(sql,[id]);

        if(eredmeny.length == 0)
        {
            return res.status(404).json({error:'Nincs ilyen azonosító.'});
        }


         sql = `SELECT gazdak.id, gazdak.nev, gazdak.telefon, gazdak.varos, 
        (SELECT JSON_ARRAYAGG( JSON_OBJECT( 'id', allatok.id,
                    'nev', allatok.nev,
                    'faj', allatok.faj,
                    'szuletes', allatok.szuletes)) FROM allatok WHERE allatok.gazda_id = ?) AS allatok 
        FROM gazdak WHERE gazdak.id = ? GROUP BY gazdak.id, gazdak.nev, gazdak.telefon, gazdak.varos`;         
        
        [eredmeny] = await pool.query(sql,[id,id]);

            res.send(eredmeny);
    })

    export default router;