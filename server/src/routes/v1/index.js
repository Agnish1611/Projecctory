import express from 'express';

import taskRoutes from './task-routes.js';
import userRoutes from './user-routes.js';
import labelRoutes from './label-routes.js';

const router = express.Router();

router.use('/task', taskRoutes);
router.use('/user', userRoutes);
router.use('/label', labelRoutes);

export default router;