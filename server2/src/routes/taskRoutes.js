import express from "express";

import { createTask, deleteTask, getTasks, updateTask, assignTask } from "../controllers/taskController.js";
import { validateCreateRequest, validateGetRequest, validateUpdateRequest } from "../middlewares/taskMiddleware.js";

const router = express.Router();

router.post('/', validateCreateRequest, createTask);
router.get('/', validateGetRequest, getTasks);
router.patch('/:id', validateUpdateRequest, updateTask);
router.delete('/:id', deleteTask);
router.post('/assign/:id', assignTask);

export default router;