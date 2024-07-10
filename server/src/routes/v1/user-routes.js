import express from 'express';

import { signup } from '../../controllers/user-controller.js';

const router = express.Router();

// /api/v1/todo POST
router.post('/signup',
    signup);

export default router;