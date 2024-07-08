import express from 'express';

import { createTodo, updateTodo, getAllTodos, deleteTodo } from '../../controllers/todo-controller.js';

const router = express.Router();

// /api/v1/todo POST
router.post('/',
    createTodo);

// /api/v1/todo GET
router.get('/',
    getAllTodos);

// /api/v1/todo/:id PATCH
router.patch('/:id',
    updateTodo);

// /api/v1/todo/:id DELETE
router.delete('/:id',
    deleteTodo);

export default router;