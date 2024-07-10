import express from 'express';

import { createTask, updateTask, getAllTasks, deleteTask } from '../../controllers/task-controller.js';

const router = express.Router();

// /api/v1/task/:id POST
router.post('/:id',
    createTask);

// /api/v1/task GET
router.get('/:id',
    getAllTasks);

// /api/v1/task/:id PATCH
router.patch('/:id',
    updateTask);

// /api/v1/task/:id DELETE
router.delete('/:id',
    deleteTask);

export default router;