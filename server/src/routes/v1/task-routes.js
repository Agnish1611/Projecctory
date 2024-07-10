import express from 'express';

import { createTask, updateTask, getAllTasks, deleteTask } from '../../controllers/task-controller.js';
import { authenticate } from '../../middlewares/auth-middleware.js';

const router = express.Router();

// /api/v1/task POST
router.post('/',
    authenticate,
    createTask);

// /api/v1/task GET
router.get('/',
    authenticate,
    getAllTasks);

// /api/v1/task/:id PATCH
router.patch('/:id',
    updateTask);

// /api/v1/task/:id DELETE
router.delete('/:id',
    deleteTask);

export default router;