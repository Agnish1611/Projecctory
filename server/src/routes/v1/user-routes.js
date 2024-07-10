import express from 'express';

import { signup, login } from '../../controllers/user-controller.js';

const router = express.Router();

// /api/v1/user/signup POST
router.post('/signup',
    signup);

// /api/v1/user/login POST
router.post('/login',
    login);

export default router;