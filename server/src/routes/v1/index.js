import express from 'express';

import todoRoutes from './todo-routes.js';
import userRoutes from './user-routes.js';

const router = express.Router();

router.use('/todo', todoRoutes);
router.use('/user', userRoutes);

export default router;