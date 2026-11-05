import pool from './db.js';
import express from 'express';

const app = express();

app.get('/szallasok', async (req,res) =>{

    const {minCsillag,varos,medence,maxAr} = req.query;
    const params = [];
    const sqls = [];
    let sql1 = 'SELECT szallasok.id, varosok.nev AS varos, szallasok.nev, varosok.orszag, csillag, ar, medence, ertekeles FROM szallasok LEFT JOIN varosok ON szallasok.varos_id = varosok.id WHERE 1=1';
    let sql2 =  'ORDER BY szallasok.ar DESC';
    sqls.push(sql1);

    if(req.query.minCsillag == null && req.query.varos == null && req.query.medence == null && req.query.maxAr == null)
    {
        sqls.push(sql2);

        let sql = sqls.join(" ");

        let [eredmeny] = await pool.query(sql);

        res.send(eredmeny);
    }
    if(req.query.minCsillag != null)
    {
        params.push(req.query.minCsillag);
        let sql3 = 'AND csillag >= ?';
        sqls.push(sql3);
    }
    if(req.query.varos != null)
    {
        params.push(req.query.varos);
        let sql3 = 'AND varosok.nev = ?';
        sqls.push(sql3);

    }
    if(req.query.medence != null)
    {
        params.push(req.query.medence);
        let sql3 = 'AND medence = ?';
        sqls.push(sql3);

    }
    if(req.query.maxAr != null)
    {
        params.push(req.query.maxAr);
        let sql3 = 'AND ar <= ?';
        sqls.push(sql3);
    }

    sqls.push(sql2);

    let sql = sqls.join(" ");

    let [eredmeny] = await pool.query(sql,params);

    res.send(eredmeny);

})


app.listen(3000, ()=> {
    console.log('Server listens on http://localhost:3000 ');
})