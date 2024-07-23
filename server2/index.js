import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';

import { logger, logEvents } from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';

import cors from 'cors';
import corsOptions from './src/config/corsOptions.js';

import mongoose from 'mongoose';
import connectDB from './src/config/dbConnect.js';

import router from './src/routes/index.js';
import userRoutes from './src/routes/userRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';

const PORT = process.env.PORT || 3500;
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', router);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'src/views', '404page.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});