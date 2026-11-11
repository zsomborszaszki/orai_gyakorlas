import express from 'express';
import gazdak from './routes/gazdak.js';
import allatok from './routes/allatok.js';
import kezelesek from './routes/kezelesek.js';
import statisztika from './routes/statisztika.js';


const app = express();

app.use('/gazdak',gazdak);
app.use('/allatok',allatok);
app.use('/kezelesek',kezelesek);
app.use('/statisztika',statisztika);


app.listen(3000, () => {
    console.log('http://localhost:3000');
})