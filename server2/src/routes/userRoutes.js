import express from "express";

import { createUser, loginUser, refresh, logout, updateUser, addFriend, removeFriend } from '../controllers/userController.js';
import { validateCreateRequest, validateUpdateRequest, validateFriendRequest } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post('/', validateCreateRequest, createUser);
router.post('/login', loginUser);
router.get('/refresh', refresh);
router.post('/logout', logout);
router.patch('/:id', validateUpdateRequest, updateUser);
router.post('/friend/add/:id', validateFriendRequest, addFriend);
router.post('/friend/remove/:id', validateFriendRequest, removeFriend);

export default router;