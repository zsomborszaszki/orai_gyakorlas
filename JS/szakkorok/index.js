import express from 'express';
import szakkorok from './routes/szakkorok.js';

const app = express();

app.use('/szakkorok', szakkorok)

app.listen(3000, () => {
    console.log('http://localhost:3000');
})