import express from 'express';
import receptek from './routes/receptek.js';
import hozzavalok from './routes/hozzavalok.js';
import statisztika from './routes/statisztika.js';



const app = express();

app.use(express.json());

app.use('/receptek', receptek);
app.use('/hozzavalok', hozzavalok);
app.use('/statisztika', statisztika);

app.use((req, res) => {
    res.status(404).json({ error: 'Nem létező végpont.' });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Hibás JSON törzs.' });
    }

    console.error(err);
    res.status(500).json({ error: 'Szerverhiba.' });
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
})