import express from 'express';

import { createProject, getProjectsByUser, updateProject, deleteProject, addTask } from '../controllers/projectController.js';
import { validateCreateRequest, validateUpdateRequest } from '../middlewares/projectMiddleware.js';
import { validateCreateRequest as validateAddTaskRequest } from '../middlewares/taskMiddleware.js';

const router = express.Router();

router.post('/',validateCreateRequest, createProject);
router.get('/:id', getProjectsByUser);
router.patch('/:id',validateUpdateRequest, updateProject);
router.delete('/:id', deleteProject);
router.post('/addtask/:id',validateAddTaskRequest, addTask);

export default router;