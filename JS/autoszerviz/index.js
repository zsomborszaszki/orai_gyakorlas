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


app.listen(3000, () => {
    console.log("http://localhost:3000");
})