import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    const faj = req.query.faj;
    let sql;
    let eredmeny;

    if(faj != null)
    {
        sql = `SELECT allatok.id, allatok.nev, allatok.faj, allatok.szuletes, gazdak.nev AS gazda 
        FROM allatok LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id WHERE faj=? 
        GROUP BY allatok.id, allatok.nev, allatok.faj, allatok.szuletes, gazdak.nev`;
        
        [eredmeny] = await pool.query(sql,faj);

        res.send(eredmeny);
    }
})

router.get('/kezeles-nelkul', async (req,res) => {

    let sql;
    let eredmeny;

            sql = `SELECT allatok.id, allatok.nev, allatok.faj, DATE_FORMAT(allatok.szuletes, '%Y-%m-%d') AS szuletes, gazdak.nev AS gazda 
            FROM allatok LEFT JOIN gazdak ON allatok.gazda_id = gazdak.id LEFT JOIN kezelesek ON allatok.id = kezelesek.allat_id 
            GROUP BY allatok.id, allatok.nev, allatok.faj, allatok.szuletes, gazdak.nev HAVING  
            COUNT(kezelesek.allat_id) = 0`;
        
        [eredmeny] = await pool.query(sql);

        res.send(eredmeny);
    
})

router.get('/:id', async (req,res) => {

    const id = req.params.id;

    let sql = `SELECT allatok.id FROM allatok WHERE allatok.id = ?`;

    let [eredmeny] = await pool.query(sql,[id]);

    if(eredmeny.length == 0)
    {
            return res.status(404).json({error:'Nincs ilyen azonosító.'});
    }


    sql = `SELECT allatok.id, allatok.nev, allatok.faj, DATE_FORMAT(allatok.szuletes, '%Y-%m-%d') AS szuletes, 
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', gazdak.id, 'nev', gazdak.nev,'telefon', gazdak.telefon))FROM gazdak
    WHERE gazdak.id = allatok.gazda_id) AS gazda,(SELECT JSON_ARRAYAGG(JSON_OBJECT(
                    'id', kezelesek.id,
                    'datum', DATE_FORMAT(kezelesek.datum, '%Y-%m-%d'),
                    'leiras', kezelesek.leiras,
                    'dij', kezelesek.dij))
    FROM kezelesek WHERE kezelesek.allat_id = allatok.id) AS kezelesek,(
            SELECT COALESCE(SUM(kezelesek.dij), 0)
            FROM kezelesek
            WHERE kezelesek.allat_id = allatok.id) AS osszesDij FROM allatok WHERE allatok.id = ?`;


         [eredmeny] = await pool.query(sql,[id,id,id]);

        res.send(eredmeny); 
})

export default router;