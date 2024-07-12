import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

import connect from "./config/db-config.js";
import { PORT } from "./config/env-config.js";

import apiRoutes from './routes/index.js';

const app = express();

app.use(cors({origin: 'http://localhost:5173'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(PORT, async () => {
    console.log(`server started at port ${PORT}`);
    await connect();
    console.log('connected to db');
});