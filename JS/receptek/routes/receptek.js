import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('', async (req,res) => {

    let sql;
    let eredmeny;
    const kategoriak = ['reggeli','leves','főétel','desszert'];
    let {kategoria,maxIdo} = req.query;
    const params = [];
    const sqls = [];

    if(Object.keys(req.query).length==0)
    {
        sql = `SELECT r.id, r.nev, r.kategoria, r.adag, r.ido, COUNT(h.id) hozzavaloDb, 
        COALESCE(SUM(ROUND(rh.mennyiseg*h.egysegar)),0) koltseg FROM receptek r LEFT JOIN recept_hozzavalok rh ON
        r.id = rh.recept_id JOIN hozzavalok h ON rh.hozzavalo_id = h.id GROUP BY r.id, r.nev, r.kategoria, r.adag, r.ido 
        ORDER BY r.nev`;

        let [eredmeny] = await pool.query(sql);

        eredmeny = eredmeny.map(sor=>({
            ...sor,
            koltseg: Number(sor.koltseg)
        }))

        return res.status(200).json(eredmeny);
    }

    sql = `SELECT r.id, r.nev, r.kategoria, r.adag, r.ido, COUNT(h.id) hozzavaloDb, 
        COALESCE(SUM(ROUND(rh.mennyiseg*h.egysegar)),0) koltseg FROM receptek r JOIN recept_hozzavalok rh ON
        r.id = rh.recept_id JOIN hozzavalok h ON rh.hozzavalo_id = h.id WHERE 1=1`;

    sqls.push(sql)

    if(kategoria != null && kategoriak.includes(kategoria))
    {
        sqls.push(`AND kategoria=?`);
        params.push(kategoria);
    }
    else if(kategoria != null && !kategoriak.includes(kategoria))
    {
        return res.status(400).json({error:'Nem megfelelő megadott kategória.'});
    }

    if(maxIdo != null && !isNaN(maxIdo))
    {
        sqls.push(`AND ido<=?`);
        params.push(maxIdo);
    }
    if (maxIdo != null) 
    {
        if (maxIdo.trim() === '' || isNaN(maxIdo)) 
        {
        return res.status(400).json({ error: 'Nem megfelelő megadott idő.' })
        };
    }

    sqls.push(`GROUP BY r.id, r.nev, r.kategoria, r.adag, r.ido 
    ORDER BY r.nev`);

    let sqlFinal = sqls.join(' ');
    console.log(sqlFinal);
    [eredmeny] = await pool.query(sqlFinal, params);

    return res.status(200).json(eredmeny);
})


router.get('/kereses', async (req, res) => {

    const van = req.query.van;
    let eredmeny;

    if (van == null) {
        return res.status(400).json({ error: 'Hiányzó paraméterek.' });
    }

    const hozzavalok = van.split(',').map(x => x.trim());

    const sql = ` SELECT r.id, r.nev, r.kategoria FROM receptek r JOIN recept_hozzavalok rh ON 
    rh.recept_id = r.id JOIN hozzavalok h ON h.id = rh.hozzavalo_id WHERE h.nev 
    IN (${hozzavalok.map(() => '?').join(',')}) GROUP BY r.id, r.nev, r.kategoria 
    HAVING COUNT(DISTINCT h.id) = ? ORDER BY r.nev`;

    [eredmeny] = await pool.query(sql, [...hozzavalok,hozzavalok.length]);

    return res.status(200).json(eredmeny);
});



router.get('/:id', async (req,res) => {

    const adag = req.query.adag;
    const id = req.params.id;
    let eredmeny;
    let sql;

    if(Object.keys(req.query).length==0)
    {

        sql = `SELECT receptek.id FROM receptek WHERE id = ?`;
        [eredmeny] = await pool.query(sql,id);

        if(eredmeny.length==0)
        {
            return res.status(404).json({error:'Nem létező recept.'});
        }

        sql = `SELECT r.id, r.nev, r.kategoria, r.adag, r.ido, COALESCE((
        SELECT CONCAT('[',GROUP_CONCAT(JSON_OBJECT( 'id', h2.id, 'nev', h2.nev, 'mennyiseg', rh2.mennyiseg, 
        'mertekegyseg', h2.mertekegyseg, 'koltseg', ROUND(rh2.mennyiseg * h2.egysegar) )ORDER BY h2.nev ASC SEPARATOR ','),']') 
        FROM recept_hozzavalok rh2 JOIN hozzavalok h2 ON h2.id = rh2.hozzavalo_id WHERE rh2.recept_id = r.id),']') AS hozzavalok, 
        COALESCE(SUM(ROUND(rh.mennyiseg * h.egysegar)),0) AS koltseg, 
        COALESCE(ROUND(SUM(ROUND(rh.mennyiseg * h.egysegar)) / r.adag),0) AS adagonkent FROM receptek r LEFT JOIN 
        recept_hozzavalok rh ON r.id = rh.recept_id LEFT JOIN hozzavalok h ON rh.hozzavalo_id = h.id 
        WHERE r.id = ? GROUP BY r.id, r.nev, r.kategoria, r.adag, r.ido ORDER BY r.nev;`;


        [eredmeny] = await pool.query(sql,id);

        eredmeny = eredmeny.map(recept => 
        ({
            ...recept,
            hozzavalok: JSON.parse(recept.hozzavalok),
            koltseg: Number(recept.koltseg),
            adagonkent: Number(recept.adagonkent)
        }));

        return res.status(200).json(eredmeny);
    }

    if(adag != null && adag > 0 && !isNaN(adag))
    {
        sql = `SELECT receptek.id FROM receptek WHERE id = ?`;
        [eredmeny] = await pool.query(sql,id);

        if(eredmeny.length==0)
        {
            return res.status(404).json({error:'Nem létező recept.'});
        }

        sql = `SELECT r.id, r.nev, r.kategoria, r.adag/r.adag*? adag, r.ido, (
        SELECT CONCAT('[',GROUP_CONCAT(JSON_OBJECT( 'id', h2.id, 'nev', h2.nev, 'mennyiseg', rh2.mennyiseg/r.adag*?, 
        'mertekegyseg', h2.mertekegyseg, 'koltseg', ROUND(rh2.mennyiseg/r.adag*? * h2.egysegar) )ORDER BY h2.nev ASC SEPARATOR ','),']') 
        FROM recept_hozzavalok rh2 JOIN hozzavalok h2 ON h2.id = rh2.hozzavalo_id WHERE rh2.recept_id = r.id) AS hozzavalok, 
        SUM(ROUND(rh.mennyiseg/r.adag*? * h.egysegar)) AS koltseg, 
        ROUND(SUM(ROUND(rh.mennyiseg/r.adag*? * h.egysegar)) / ?) AS adagonkent FROM receptek r JOIN 
        recept_hozzavalok rh ON r.id = rh.recept_id JOIN hozzavalok h ON rh.hozzavalo_id = h.id 
        WHERE r.id = ? GROUP BY r.id, r.nev, r.kategoria, r.adag, r.ido ORDER BY r.nev;`;

        [eredmeny] = await pool.query(sql,[adag,adag,adag,adag,adag,adag,id]);

        eredmeny = eredmeny.map(recept => 
        ({
            ...recept,
            hozzavalok: JSON.parse(recept.hozzavalok),
            koltseg: Number(recept.koltseg),
            adagonkent: Number(recept.adagonkent)
        }));

        return res.status(200).json(eredmeny);
    }
    if((adag != null && adag < 1) || isNaN(adag) )
    {
        return res.status(400).json({error:'Nem megfelelő paraméter.'});
    }

})


router.post('/:id/hozzavalok', async (req, res) => {
    const id = Number(req.params.id);
    const hozzavaloId = Number(req.body.hozzavaloId);
    const mennyiseg = Number(req.body.mennyiseg);

    const hibak = [];

    if (!Number.isInteger(id) || id <= 0) {
        hibak.push('Hibás receptazonosító.');
    }

    if (!Number.isInteger(hozzavaloId) || hozzavaloId <= 0) {
        hibak.push('Hibás hozzávalóazonosító.');
    }

    if (!Number.isFinite(mennyiseg) || mennyiseg <= 0) {
        hibak.push('A mennyiségnek pozitív számnak kell lennie.');
    }

    if (hibak.length > 0) {
        return res.status(400).json({ hibak });
    }

    try {
        const [recept] = await pool.query(
            'SELECT id FROM receptek WHERE id = ?',
            [id]
        );

        const [hozzavalo] = await pool.query(
            'SELECT id FROM hozzavalok WHERE id = ?',
            [hozzavaloId]
        );

        if (recept.length === 0 || hozzavalo.length === 0) {
            return res.status(404).json({ error: 'Nem található a recept vagy a hozzávaló.' });
        }

        try {
            await pool.query(`INSERT INTO recept_hozzavalok (recept_id, hozzavalo_id, mennyiseg) 
                VALUES (?, ?, ?)`, [id, hozzavaloId, mennyiseg]);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Ez a hozzávaló már szerepel a receptben.' });
            }
            throw err;
        }

        const [eredmeny] = await pool.query(`SELECT r.id, r.nev, r.kategoria, r.adag, r.ido, 
            COALESCE((SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', h2.id,'nev', h2.nev,'mennyiseg', rh2.mennyiseg,'mertekegyseg', 
            h2.mertekegyseg,'koltseg', ROUND(rh2.mennyiseg * h2.egysegar)) ORDER BY h2.nev ASC SEPARATOR ','), ']')
            FROM recept_hozzavalok rh2 JOIN hozzavalok h2 ON h2.id = rh2.hozzavalo_id WHERE rh2.recept_id = r.id ), '[]') 
            AS hozzavalok, COALESCE(ROUND(SUM(rh.mennyiseg * h.egysegar)), 0) AS koltseg, COALESCE(ROUND(SUM(rh.mennyiseg * h.egysegar) / r.adag),
             0) AS adagonkent FROM receptek r LEFT JOIN recept_hozzavalok rh ON rh.recept_id = r.id LEFT JOIN hozzavalok h 
             ON h.id = rh.hozzavalo_id WHERE r.id = ? GROUP BY r.id, r.nev, r.kategoria, r.adag, r.ido`, [id]);

          const sor = eredmeny[0];

        sor.hozzavalok = JSON.parse(sor.hozzavalok);
        sor.koltseg = Number(sor.koltseg);
        sor.adagonkent = Number(sor.adagonkent);
        sor.adag = Number(sor.adag);
        sor.ido = Number(sor.ido);

        return res.status(201).json(sor);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Szerverhiba.' });
    }
});

router.delete('/:id/hozzavalok/:hozzavaloId', async (req, res) => {
    const id = Number(req.params.id);
    const hozzavaloId = Number(req.params.hozzavaloId);

    const hibak = [];

    if (!Number.isInteger(id) || id <= 0) {
        hibak.push('Hibás receptazonosító.');
    }

    if (!Number.isInteger(hozzavaloId) || hozzavaloId <= 0) {
        hibak.push('Hibás hozzávalóazonosító.');
    }

    if (hibak.length > 0) {
        return res.status(400).json({ hibak });
    }

    try {
        const [eredmeny] = await pool.query(`
            DELETE FROM recept_hozzavalok
            WHERE recept_id = ? AND hozzavalo_id = ?`, [id, hozzavaloId]);

        if (eredmeny.affectedRows === 0) {
            return res.status(404).json({ error: 'A recept vagy a hozzávaló nem található.' });
        }

        return res.status(204).send();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Szerverhiba.' });
    }
});




export default router;