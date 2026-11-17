import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    let sql;
    let eredmeny;

    if(Object.keys(req.query).length == 0)
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

    let sql = `SELECT munkalapok.id FROM munkalapok WHERE munkalapok.id = ?`;
    [eredmeny] = await pool.query(sql,id);

    if(eredmeny.length==0)
    {
        return res.status(404).json({error:'Nem létező munkalap.'});
    }


    sql = `SELECT munkalapok.id, munkalapok.rendszam, munkalapok.felvetel,
    munkalapok.leiras, munkalapok.statusz, 
    JSON_OBJECT('id', ugyfelek.id, 'nev', ugyfelek.nev, 'telefon', ugyfelek.telefon) ugyfel,
    munkalapok.munkaora, CASE
    WHEN COUNT(alkatreszek.id) = 0 THEN JSON_ARRAY()
    ELSE JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', alkatreszek.id,
            'nev', alkatreszek.nev,
            'db', felhasznalasok.db,
            'ar', alkatreszek.ar,
            'osszeg', felhasznalasok.db * alkatreszek.ar
        )
    )
END AS alkatreszek, 
    ROUND((12000*munkalapok.munkaora)) AS munkadij, ROUND((SELECT COALESCE(SUM(f.db * a.ar), 0) 
    FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
    WHERE f.munkalap_id = munkalapok.id)) alkatreszDij, ROUND(((12000*munkalapok.munkaora)+(SELECT COALESCE(SUM(f.db * a.ar), 0) 
        FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
        WHERE f.munkalap_id = munkalapok.id))) vegosszeg FROM munkalapok JOIN ugyfelek ON munkalapok.ugyfel_id = ugyfelek.id
        LEFT JOIN felhasznalasok ON felhasznalasok.munkalap_id = munkalapok.id LEFT JOIN alkatreszek ON alkatreszek.id = felhasznalasok.alkatresz_id WHERE munkalapok.id=? 
        GROUP BY munkalapok.id, munkalapok.rendszam, munkalapok.felvetel,
    munkalapok.leiras, munkalapok.statusz`;

    [eredmeny] = await pool.query(sql,id);

    const munkalapok = eredmeny.map(sor => ({
                ...sor,
                munkaora: Number(sor.munkaora),
                munkadij: Number(sor.munkadij),
                alkatreszDij: Number(sor.alkatreszDij),
                vegosszeg: Number(sor.vegosszeg)
    }));
    
    return res.status(200).json(munkalapok);

});

router.patch('/:id/statusz', async (req,res) => {
    
    const id = Number(req.params.id);
    const ujStatusz = req.body.statusz;
    const statuszok = ['felvéve', 'javítás alatt', 'kész', 'átadva'];

    if(isNaN(id) || id <= 0)
    {
        return res.status(400).json({error:'Érvénytelen megadott paraméter.'});
    }

    if(!statuszok.includes(ujStatusz))
    {
        return res.status(400).json({error:'Érvénytelen megadott státusz.'});
    }

    let sql = 'SELECT statusz FROM munkalapok WHERE id = ?'
    const [regiAdat] = await pool.query(sql,id);

    if(regiAdat.length==0)
    {
        return res.status(404).json({error:'Nem található munkalap.'});
    }

     const regi = regiAdat[0].statusz;

     if (statuszok.indexOf(ujStatusz) !== statuszok.indexOf(regi) + 1) 
    {
        return res.status(409).json({error: 'Csak a következő státuszra lehet továbblépni.'});
    }


    sql = `UPDATE munkalapok SET statusz = ? WHERE id = ?`;

    await pool.query(sql,[ujStatusz,id]);

    sql = `SELECT munkalapok.id, munkalapok.rendszam, munkalapok.felvetel,
    munkalapok.leiras, munkalapok.statusz, 
    JSON_OBJECT('id', ugyfelek.id, 'nev', ugyfelek.nev, 'telefon', ugyfelek.telefon) ugyfel,
    munkalapok.munkaora, CASE
    WHEN COUNT(alkatreszek.id) = 0 THEN JSON_ARRAY()
    ELSE JSON_ARRAYAGG(
    JSON_OBJECT(
    'id', alkatreszek.id,
    'nev', alkatreszek.nev,
    'db', felhasznalasok.db,
    'ar', alkatreszek.ar,
    'osszeg', felhasznalasok.db * alkatreszek.ar)) END AS alkatreszek, 
    ROUND((12000*munkalapok.munkaora)) AS munkadij, ROUND((SELECT COALESCE(SUM(f.db * a.ar), 0) 
    FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
    WHERE f.munkalap_id = munkalapok.id)) alkatreszDij, ROUND(((12000*munkalapok.munkaora)+(SELECT COALESCE(SUM(f.db * a.ar), 0) 
    FROM felhasznalasok f JOIN alkatreszek a ON a.id = f.alkatresz_id 
    WHERE f.munkalap_id = munkalapok.id))) vegosszeg FROM munkalapok JOIN ugyfelek ON munkalapok.ugyfel_id = ugyfelek.id
    LEFT JOIN felhasznalasok ON felhasznalasok.munkalap_id = munkalapok.id LEFT JOIN alkatreszek ON 
    alkatreszek.id = felhasznalasok.alkatresz_id WHERE munkalapok.id=? GROUP BY munkalapok.id, ugyfelek.id, ugyfelek.nev, ugyfelek.telefon`;

    let [eredmeny] = await pool.query(sql,id);

    const sor = eredmeny[0];

    sor.id = Number(sor.id);
    sor.munkaora = Number(sor.munkaora);
    sor.munkadij = Number(sor.munkadij);
    sor.alkatreszDij = Number(sor.alkatreszDij);
    sor.vegosszeg = Number(sor.vegosszeg);

    sor.alkatreszek = sor.alkatreszek.map(a => ({
        ...a,
        id: Number(a.id),
        db: Number(a.db),
        ar: Number(a.ar),
        osszeg: Number(a.osszeg)
    }));

    return res.status(200).json(sor);

})


router.post('/:id/alkatreszek', async (req,res) => {

    const id = Number(req.params.id);
    const alkatreszId = Number(req.body.alkatreszId);
    const db = Number(req.body.db);

    if(isNaN(id) || id <=0 || isNaN(alkatreszId) || alkatreszId <= 0 || isNaN(db) || db <= 0 )
    {
        return res.status(400).json({ error: 'Érvénytelen adatok.' });
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        let sql = ` SELECT statusz FROM munkalapok WHERE id = ? FOR UPDATE`;

        const [munkalap] = await conn.query(sql, id);

        if (munkalap.length == 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'Nem található munkalap.' });
        }

        if (['kész', 'átadva'].includes(munkalap[0].statusz)) 
        {
            await conn.rollback();
            return res.status(409).json({ error: 'A munkalap már le van zárva.' });
        }

        sql = ` SELECT keszlet FROM alkatreszek WHERE id = ? FOR UPDATE`;

        const [alkatresz] = await conn.query(sql, alkatreszId);

        if (alkatresz.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'Nem található alkatrész.' });
        }

        if (alkatresz[0].keszlet < db) {
            await conn.rollback();
            return res.status(409).json({ error: 'Nincs elegendő alkatrész raktáron.' });
        }

        sql = ` UPDATE alkatreszek SET keszlet = keszlet - ? WHERE id = ?`;

        await conn.query(sql, [db, alkatreszId]);

        sql = ` INSERT INTO felhasznalasok (munkalap_id, alkatresz_id, db) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE db = db + VALUES(db)`;

        await conn.query(sql, [id, alkatreszId, db]);

        sql = ` SELECT munkalapok.id, munkalapok.rendszam, munkalapok.felvetel, munkalapok.leiras, munkalapok.statusz,
        JSON_OBJECT( 'id', ugyfelek.id, 'nev', ugyfelek.nev, 'telefon', ugyfelek.telefon) AS ugyfel, munkalapok.munkaora,
        CASE WHEN COUNT(alkatreszek.id) = 0 THEN JSON_ARRAY() ELSE JSON_ARRAYAGG( 
        JSON_OBJECT('id', alkatreszek.id,'nev', alkatreszek.nev,'db', felhasznalasok.db,'ar', alkatreszek.ar,'osszeg', 
        felhasznalasok.db * alkatreszek.ar ) ) END AS alkatreszek,
        ROUND(12000 * munkalapok.munkaora) AS munkadij,
        ROUND(COALESCE(SUM( felhasznalasok.db * alkatreszek.ar), 0)) AS alkatreszDij,
        ROUND( 12000 * munkalapok.munkaora + COALESCE(SUM( felhasznalasok.db * alkatreszek.ar ), 0)) AS vegosszeg
        FROM munkalapok JOIN ugyfelek ON munkalapok.ugyfel_id = ugyfelek.id LEFT JOIN
        felhasznalasok ON felhasznalasok.munkalap_id = munkalapok.id LEFT JOIN alkatreszek ON 
        alkatreszek.id = felhasznalasok.alkatresz_id WHERE munkalapok.id = ?
        GROUP BY munkalapok.id, ugyfelek.id, ugyfelek.nev, ugyfelek.telefon`;

        const [eredmeny] = await conn.query(sql, [id]);

        await conn.commit();

        const sor = eredmeny[0];

        sor.id = Number(sor.id);
        sor.munkaora = Number(sor.munkaora);
        sor.munkadij = Number(sor.munkadij);
        sor.alkatreszDij = Number(sor.alkatreszDij);
        sor.vegosszeg = Number(sor.vegosszeg);

        sor.alkatreszek = sor.alkatreszek.map(a => ({
            ...a,
            id: Number(a.id),
            db: Number(a.db),
            ar: Number(a.ar),
            osszeg: Number(a.osszeg)
        }));

        return res.status(201).json(sor);

    } catch (error) {
        await conn.rollback();
        console.error(error);
        return res.status(500).json({ error: 'Szerverhiba.' });

    } finally {
        conn.release();
    }
})


export default router;