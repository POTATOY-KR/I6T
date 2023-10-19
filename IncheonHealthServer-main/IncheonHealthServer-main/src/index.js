import './loadenv.js';
import express from 'express';
import routes from './routes/index.js';
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/gyms',routes.gym);
app.use('/restaurants',routes.restaurant);


app.listen(3000, () => console.log("Starting Server Application..."));