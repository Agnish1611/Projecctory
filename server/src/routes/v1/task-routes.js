import express from 'express';

import * as taskController from '../../controllers/task-controller.js';

const router = express.Router();

// /api/v1/task/:id POST
router.post('/:id',
    taskController.createTask);

// /api/v1/task/:id GET
router.get('/:id',
    taskController.getTasks);

// /api/v1/task/:id DELETE
router.delete('/:id',
    taskController.deleteTask);

// /api/v1/task/:id PATCH
router.patch('/:id',
    taskController.updateTask);

// /api/v1/task/complete/:id PATCH
router.patch('/complete/:id',
    taskController.completeTask);

export default router;