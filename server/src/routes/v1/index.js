import express from 'express';

import taskRoutes from './task-routes.js';
import userRoutes from './user-routes.js';

const router = express.Router();

router.use('/task', taskRoutes);
router.use('/user', userRoutes);

export default router;