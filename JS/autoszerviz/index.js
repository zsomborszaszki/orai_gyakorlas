import express from 'express';
import munkalapok from './routes/munkalapok.js';
import alkatreszek from './routes/alkatreszek.js';
import ugyfelek from './routes/ugyfelek.js';
import statisztika from './routes/statisztika.js';

const app = express();

app.use(express.json());

app.use('/munkalapok', munkalapok);
app.use('/alkatreszek', alkatreszek);
app.use('/ugyfelek', ugyfelek);
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