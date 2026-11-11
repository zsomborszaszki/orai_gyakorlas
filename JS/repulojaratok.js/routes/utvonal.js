import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {
    
    const {honnan,hova} = req.query;

    if(honnan == hova)
    {
        return res.status(400).json({error:'Nem megfelelő paraméterek.'});
    }

    let sql = 'SELECT repuloterek.kod FROM repuloterek WHERE kod = ?';

    let [eredmeny] = await pool.query(sql,honnan);

    if(eredmeny.length < 1)
    {
        return res.status(404).json({error:'Nem található reptérkód.'});
    }

    [eredmeny] = await pool.query(sql,hova);

    if(eredmeny.length < 1)
    {
        return res.status(404).json({error:'Nem található reptérkód.'});
    }
    
    sql= `SELECT jaratszam, legitarsasagok.nev, r_honnan.kod AS honnan,r_honnan.varos AS honnanvaros, r_hova.kod AS hova,
     r_hova.varos AS hovavaros, indulas, ADDTIME(indulas, SEC_TO_TIME(idotartam*60)) AS erkezes, idotartam, ar FROM 
    jaratok INNER JOIN legitarsasagok ON jaratok.legitarsasag_id = legitarsasagok.id INNER JOIN repuloterek r_honnan 
    ON jaratok.honnan_id = r_honnan.id INNER JOIN repuloterek r_hova ON jaratok.hova_id = r_hova.id WHERE r_honnan.kod=? AND r_hova.kod= ?`;
    
    const [kozvetlen] = await pool.query(sql, [honnan, hova]);


    sql = `SELECT 
                j1.jaratszam AS elso,
                j2.jaratszam AS masodik,
                r_atszallas.kod AS atszallas,
                TIME_FORMAT(j1.indulas, '%H:%i') AS indulas,
                TIME_FORMAT(ADDTIME(j2.indulas, SEC_TO_TIME(j2.idotartam * 60)), '%H:%i') AS erkezes,
                TIMESTAMPDIFF(MINUTE, ADDTIME(j1.indulas, SEC_TO_TIME(j1.idotartam * 60)), j2.indulas) AS varakozas,
                (j1.ar + j2.ar) AS osszAr
            FROM jaratok j1
            INNER JOIN jaratok j2 ON j1.hova_id = j2.honnan_id
            INNER JOIN repuloterek r_honnan ON j1.honnan_id = r_honnan.id
            INNER JOIN repuloterek r_atszallas ON j1.hova_id = r_atszallas.id
            INNER JOIN repuloterek r_hova ON j2.hova_id = r_hova.id
            WHERE r_honnan.kod = ? 
              AND r_hova.kod = ?
              AND TIMESTAMPDIFF(MINUTE, ADDTIME(j1.indulas, SEC_TO_TIME(j1.idotartam * 60)), j2.indulas) BETWEEN 60 AND 300
            ORDER BY osszAr ASC`;
    
    const [kozvetett]= await pool.query(sql, [honnan, hova]);

    res.json([{honnan: honnan,hova:hova},{kozvetlen: kozvetlen},{atszallassal: kozvetett}]);


})

export default router;