import express from 'express';
import pool from './db.js';

const app = express();


app.get('/eloadok', async(req,res) => {
    if(req.query.orszag != null)
    {
        const orszag = req.query.orszag;
        let sql = "SELECT nev,orszag,cim,ev,mufaj,hossz FROM eloadok JOIN albumok on eloadok.id = albumok.eloado_id WHERE eloadok.orszag =?;"
        let [eredmeny] = await pool.query(sql,[orszag]);
        res.send(eredmeny);
    }
    let sql = 'SELECT * FROM eloadok'
    let [eredmeny] = await pool.query(sql);
    eredmeny.sort((a,b)=>{
        if(a.nev>b.nev) return 1;
        if(a.nev<b.nev) return -1;
        return 0;
    }
);
    res.send(eredmeny);
})


app.get("/eloadok/:id", async (req,res) =>{
    const id = Number(req.params.id);
    if(!Number.isInteger(id))
    {
        return res.status(400).json({error:'Hibás a megadott azonoító.'})
    }
    let sql = "SELECT nev FROM eloadok WHERE eloadok.id =?"
    let [eloadok] = await pool.query(sql,[id]);

    if(eloadok.length===0)
    {
        return res.status(404).json({error:'Az előadó nem található.'})
    }

    sql = "SELECT nev,orszag,cim,ev,mufaj,hossz FROM eloadok JOIN albumok on eloadok.id = albumok.eloado_id WHERE eloadok.id=?;"
    let [eredmeny] = await pool.query(sql,[id],[]);
        res.send(eredmeny);
})

app.get("/albumok", async(req,res) =>{

    const{mufaj,tol,ig} = req.query;

    if(!mufaj & !ig & !tol )
    {
        let sql1 = 'SELECT albumok.id,nev AS "eloado" ,cim,ev,mufaj,hossz FROM albumok JOIN eloadok ON albumok.eloado_id = eloadok.id ORDER BY ev,cim';
        let [eredmeny] = await pool.query(sql1);

        res.send(eredmeny);
    }


    let sql1 = 'SELECT albumok.id,nev AS "eloado" ,cim,ev,mufaj,hossz FROM albumok JOIN eloadok ON albumok.eloado_id = eloadok.id WHERE 1=1';
    let sqlek = [];
    const parameters = [];
    sqlek.push(sql1);

    if(mufaj)
    {
        const mufajSzures = " AND mufaj=?"
        sqlek.push(mufajSzures);
        parameters.push(mufaj);
    }

    if(tol)
    {
        const tolSzures = " AND ev>=?"
        sqlek.push(tolSzures);
        parameters.push(tol); 
    }

    if(ig)
    {
        const igSzures = " AND ev <=?"
        sqlek.push(igSzures);
        parameters.push(ig);
    }

    const orderbyRendezes = " ORDER BY ev,cim"
    sqlek.push(orderbyRendezes);

    let sql = sqlek.join('');
    
    let [eredmeny] = await pool.query(sql,parameters);

    res.send(eredmeny);
})

app.get("/kereses", async(req,res) => {
    const q = req.query.q;

    if(q.length<2)
    {
        return res.status(400).json({error:"Túl kevés megadott karakter."})
    }

    let sql = "SELECT nev,cim FROM eloadok JOIN albumok on eloadok.id = albumok.eloado_id WHERE nev LIKE ? OR cim LIKE ?"

    let [eredmeny] = await pool.query(sql,["%"+q+"%","%"+q+"%"]);

    res.send(eredmeny);
})

app.get("/mufajok", async (req,res) =>{

    let sql = "SELECT mufaj, COUNT(cim) as 'albumDb', SUM(hossz) AS 'osszhossz' FROM albumok GROUP BY mufaj";

    let [eredmeny] = await pool.query(sql);
    res.send(eredmeny);
})

app.get("/statisztika/eloadok", async(req,res) =>{

    let sql = "SELECT eloadok.nev AS eloado, COUNT(albumok.id) AS albumDb, MIN(albumok.ev) AS elso, MAX(albumok.ev) AS utolso FROM eloadok LEFT JOIN albumok ON eloadok.id = albumok.eloado_id GROUP BY eloadok.id, eloadok.nev ORDER BY albumDb DESC, eloado ASC;";

    let [eredmeny] = await pool.query(sql);

    res.send(eredmeny);
})


app.get("/orszagok", async(req,res) => {

    let sql = "SELECT orszag, COUNT(nev) AS 'eloadoDB', COUNT(cim) AS 'albumDb' FROM eloadok LEFT JOIN albumok on eloadok.id = albumok.eloado_id GROUP BY orszag";

    let [eredmeny] = await pool.query(sql);

    res.send(eredmeny);
})



app.listen(3000, () =>{
    console.log("http://localhost:3000");
})