import express from 'express';
import jaratok from './routes/jaratok.js';
import repuloterek from './routes/repuloterek.js';
import legitarsasagok from './routes/legitarsasagok.js';

const app = express();


app.use("/jaratok", jaratok);
app.use("/repuloterek", repuloterek);
app.use("/legitarsasagok", legitarsasagok);

app.listen(3000, () => {
    console.log("http://localhost:3000");
})