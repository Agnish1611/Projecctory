import express from "express";

import connect from "./config/db-config.js";
import { PORT } from "./config/env-config.js";

const app = express();

app.use(express.json());

app.listen(PORT, async () => {
    console.log(`server started at port ${PORT}`);
    await connect();
    console.log('connected to db');
});