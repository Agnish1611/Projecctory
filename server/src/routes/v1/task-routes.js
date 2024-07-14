import express from 'express';

import * as taskController from '../../controllers/task-controller.js';

const router = express.Router();

// /api/v1/task/:id POST
router.post('/:id',
    taskController.createTask);

// /api/v1/task GET
router.get('/:id',
    taskController.getAllTasks);

// /api/v1/task/:id DELETE
router.delete('/:id',
    taskController.deleteTask);

// /api/v1/task/:id PATCH
router.patch('/:id',
    taskController.updateTask);

export default router;