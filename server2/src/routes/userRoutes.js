import express from "express";

import { createUser, updateUser, addFriend, removeFriend } from '../controllers/userController.js';
import { validateCreateRequest, validateUpdateRequest, validateFriendRequest } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post('/', validateCreateRequest, createUser);
router.patch('/:id', validateUpdateRequest, updateUser);
router.post('/friend/add/:id', validateFriendRequest, addFriend);
router.post('/friend/remove/:id', validateFriendRequest, removeFriend);

export default router;