import express from 'express';
import munkalapok from './routes/munkalapok.js';

const app = express();

app.use('/munkalapok', munkalapok);

app.listen(3000, () => {
    console.log("http://localhost:3000");
})