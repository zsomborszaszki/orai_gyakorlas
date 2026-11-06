import express from 'express';
import pool from '../db.js';


const router = express.Router();

router.get('', async (req,res) => {
    if(Object.keys(req.query).length == 0)
    {
        let sql = `SELECT jaratok.jaratszam, legitarsasagok.nev AS legitarsasag, r_honnan.kod AS honnan,
        r_honnan.varos AS honnanVaros, r_hova.kod AS hova, r_hova.varos AS hovaVaros, jaratok.indulas, 
        ADDTIME(jaratok.indulas, SEC_TO_TIME(jaratok.idotartam*60)) AS erkezes, jaratok.idotartam, jaratok.ar FROM jaratok 
        INNER JOIN repuloterek r_honnan ON jaratok.honnan_id = r_honnan.id INNER JOIN repuloterek r_hova ON jaratok.hova_id = r_hova.id
        INNER JOIN legitarsasagok on jaratok.legitarsasag_id = legitarsasagok.id ORDER BY jaratok.indulas ASC`;
    
        let [eredmeny] = await pool.query(sql);

        res.send(eredmeny);
    }

    if(req.query.honnan != null && req.query.hova != null)
    {
        let sql = `SELECT jaratok.jaratszam, legitarsasagok.nev AS legitarsasag, r_honnan.kod AS honnan,
        r_honnan.varos AS honnanVaros, r_hova.kod AS hova, r_hova.varos AS hovaVaros, jaratok.indulas, 
        ADDTIME(jaratok.indulas, SEC_TO_TIME(jaratok.idotartam*60)) AS erkezes, jaratok.idotartam, jaratok.ar FROM jaratok 
        INNER JOIN repuloterek r_honnan ON jaratok.honnan_id = r_honnan.id INNER JOIN repuloterek r_hova ON jaratok.hova_id = r_hova.id
        INNER JOIN legitarsasagok on jaratok.legitarsasag_id = legitarsasagok.id WHERE r_honnan.kod = ? AND r_hova.kod = ? ORDER BY jaratok.indulas ASC`;
    
        let [eredmeny] = await pool.query(sql,[req.query.honnan,req.query.hova]);

        res.send(eredmeny);
    }

    if(req.query.honnan == null || req.query.hova == null)
    {
        return res.status(400).json({error:'Hiányzó adatok.'});
    }
})


router.get('/:jaratszam', async (req,res) => {

    const jaratszam = req.params.jaratszam;

    let sql = `SELECT jaratok.jaratszam, legitarsasagok.nev AS legitarsasag, r_honnan.kod AS honnan,
        r_honnan.varos AS honnanVaros, r_hova.kod AS hova, r_hova.varos AS hovaVaros, jaratok.indulas, 
        ADDTIME(jaratok.indulas, SEC_TO_TIME(jaratok.idotartam*60)) AS erkezes, jaratok.idotartam, jaratok.ar FROM jaratok 
        INNER JOIN repuloterek r_honnan ON jaratok.honnan_id = r_honnan.id INNER JOIN repuloterek r_hova ON jaratok.hova_id = r_hova.id
        INNER JOIN legitarsasagok on jaratok.legitarsasag_id = legitarsasagok.id WHERE jaratok.jaratszam = ? ORDER BY jaratok.indulas ASC`;
    
    let [eredmeny] = await pool.query(sql, jaratszam);

    if(eredmeny.length > 0)
    {
        res.send(eredmeny);
    }
    else{
        return res.status(404).json({error:'Nem található járat.'});
    }
})

export default router;