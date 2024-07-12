import express from 'express';

import * as userController from '../../controllers/user-controller.js';

const router = express.Router();

// /api/v1/user/signup POST
router.post('/signup',
    userController.signup);

// /api/v1/user/login POST
router.post('/login',
    userController.login);

// /api/v1/user/authenticate POST
router.post('/authenticate',
    userController.authenticate);

export default router;