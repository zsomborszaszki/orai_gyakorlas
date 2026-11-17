import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    let sql;
    let eredmeny;

    if(Object.keys(req.query).length < 1)
    {
        sql = `SELECT munkalapok.id, munkalapok.rendszam, ugyfelek.nev ugyfel,
        munkalapok.felvetel, munkalapok.leiras, munkalapok.statusz, munkalapok.munkaora, 
        ROUND((12000*munkalapok.munkaora)) AS munkadij, ROUND((SELECT COALESCE(SUM(f.db * a.ar), 0) 
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
        WHERE f.munkalap_id = munkalapok.id)) alkatreszDij, ROUND(((12000*munkalapok.munkaora)+(SELECT COALESCE(SUM(f.db * a.ar), 0) 
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
        WHERE f.munkalap_id = munkalapok.id))) vegosszeg 
        FROM munkalapok JOIN ugyfelek ON munkalapok.ugyfel_id = ugyfelek.id ORDER BY felvetel`;
        
        [eredmeny] = await pool.query(sql);

        const munkalapok = eredmeny.map(sor => ({
            ...sor,
            munkaora: Number(sor.munkaora),
            munkadij: Number(sor.munkadij),
            alkatreszDij: Number(sor.alkatreszDij),
            vegosszeg: Number(sor.vegosszeg)
        }));

        return res.status(200).json(munkalapok);
    }

    const {statusz,rendszam} = req.query;
    const params = [];
    sql= [`SELECT munkalapok.id, munkalapok.rendszam, ugyfelek.nev ugyfel,
        munkalapok.felvetel, munkalapok.leiras, munkalapok.statusz, munkalapok.munkaora, 
        ROUND((12000*munkalapok.munkaora)) AS munkadij, ROUND((SELECT COALESCE(SUM(f.db * a.ar), 0) 
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
        WHERE f.munkalap_id = munkalapok.id)) alkatreszDij, ROUND(((12000*munkalapok.munkaora)+(SELECT COALESCE(SUM(f.db * a.ar), 0) 
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
        WHERE f.munkalap_id = munkalapok.id))) vegosszeg 
        FROM munkalapok JOIN ugyfelek ON munkalapok.ugyfel_id = ugyfelek.id WHERE 1=1`];

    const statuszok = ['felvéve', 'javítás alatt', 'kész', 'átadva'];

    if(statusz != null && !statuszok.some(status => status==statusz))
    {
        return res.status(400).json({error:'Hibás megadott paraméter.'});
    }
    
    if(statusz != null)
    {
        sql.push(' AND statusz=?');
        params.push(statusz);
    }

    if(rendszam != null)
        {
            sql.push(' AND rendszam=?');
            params.push(rendszam);
        }

    let sqlFinal = sql.join('');

    [eredmeny] = await pool.query(sqlFinal,params);

    const munkalapok = eredmeny.map(sor => ({
            ...sor,
            munkaora: Number(sor.munkaora),
            munkadij: Number(sor.munkadij),
            alkatreszDij: Number(sor.alkatreszDij),
            vegosszeg: Number(sor.vegosszeg)
    }));

    return res.status(200).json(munkalapok);

})


router.get('/:id', async (req,res) => {

    let id = Number(req.params.id);
    let eredmeny;

    let sql = `SELECT munkalapok.id, munkalapok.rendszam, munkalapok.felvetel,
    munkalapok.leiras, munkalapok.statusz, 
    JSON_OBJECT('id', ugyfelek.id, 'nev', ugyfelek.nev, 'telefon', ugyfelek.telefon) ugyfel,
    munkalapok.munkaora, JSON_ARRAYAGG(JSON_OBJECT('id',alkatreszek.id,'nev', alkatreszek.nev, 'db', felhasznalasok.db, 'ar', alkatreszek.ar, 'osszeg', felhasznalasok.db*alkatreszek.ar)) alkatreszek, 
    ROUND((12000*munkalapok.munkaora)) AS munkadij, ROUND((SELECT COALESCE(SUM(f.db * a.ar), 0) 
    FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
    WHERE f.munkalap_id = munkalapok.id)) alkatreszDij, ROUND(((12000*munkalapok.munkaora)+(SELECT COALESCE(SUM(f.db * a.ar), 0) 
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
        WHERE f.munkalap_id = munkalapok.id))) vegosszeg FROM munkalapok JOIN ugyfelek ON munkalapok.ugyfel_id = ugyfelek.id
        LEFT JOIN felhasznalasok ON felhasznalasok.munkalap_id = munkalapok.id LEFT JOIN alkatreszek ON alkatreszek.id = felhasznalasok.alkatresz_id WHERE munkalapok.id=?`;

    [eredmeny] = await pool.query(sql,id);

    const munkalapok = eredmeny.map(sor => ({
                ...sor,
                munkaora: Number(sor.munkaora),
                munkadij: Number(sor.munkadij),
                alkatreszDij: Number(sor.alkatreszDij),
                vegosszeg: Number(sor.vegosszeg)
    }));
    
    return res.status(200).json(munkalapok);

})


export default router;