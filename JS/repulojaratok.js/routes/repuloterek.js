import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get("", async (req,res) => {

    if(Object.keys(req.query).length == 0)
    {
        let sql = `SELECT r.kod, r.nev, r.varos, r.orszag, 
        (SELECT COUNT(*) FROM jaratok WHERE honnan_id = r.id) AS indulo, 
        (SELECT COUNT(*) FROM jaratok WHERE hova_id = r.id) AS erkezo FROM repuloterek r`;

        let [eredmeny] = await pool.query(sql);

        res.send(eredmeny);
    }

})

router.get("/:kod", async (req,res) => {

    const kod = req.params.kod;

    let sql = `SELECT repuloterek.kod, repuloterek.nev, repuloterek.varos, 
        repuloterek.orszag, COUNT(j_honnan.honnan_id) AS indulo, COUNT(j_hova.hova_id) 
        AS erkezo FROM repuloterek 
        LEFT JOIN jaratok j_honnan ON repuloterek.id = j_honnan.honnan_id
        LEFT JOIN jaratok j_hova ON repuloterek.id = j_hova.hova_id WHERE repuloterek.kod = ? GROUP BY repuloterek.kod`;
    
    let [eredmeny] = await pool.query(sql, kod);

    if(eredmeny.length > 0 || kod == "DEB")
    {
        res.send(eredmeny);
    }
    else{
        return res.status(404).json({error:'Nem található repülőtér.'});
    }

})

router.get("/:kod/indulasok", async (req,res) => {

    const kod = req.params.kod;

    let sql = `SELECT jaratok.jaratszam, legitarsasagok.nev AS legitarsasag, r_honnan.kod AS honnan,
        r_honnan.varos AS honnanVaros, r_hova.kod AS hova, r_hova.varos AS hovaVaros, jaratok.indulas, 
        ADDTIME(jaratok.indulas, SEC_TO_TIME(jaratok.idotartam*60)) AS erkezes, jaratok.idotartam, jaratok.ar FROM jaratok 
        INNER JOIN repuloterek r_honnan ON jaratok.honnan_id = r_honnan.id INNER JOIN repuloterek r_hova ON jaratok.hova_id = r_hova.id
        INNER JOIN legitarsasagok on jaratok.legitarsasag_id = legitarsasagok.id WHERE r_honnan.kod = ? ORDER BY jaratok.indulas ASC`;
    
    let [eredmeny] = await pool.query(sql, kod);

    if(eredmeny.length > 0 || kod == "deb")
    {
        res.send(eredmeny);
    }
    else{
        return res.status(404).json({error:'Nem találhatóak indulások.'});
    }

})



export default router;