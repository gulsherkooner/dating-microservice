import express from 'express';
import { createPost, getUserPosts, updatePinStatus } from '../controllers/datingPost.controller.js';
import { extractUserFromHeader } from '../middleware/extractUser.js';

const router = express.Router();

router.post('/', extractUserFromHeader, createPost);
router.get('/me', extractUserFromHeader, getUserPosts);
router.patch('/pin-post/:id', extractUserFromHeader, updatePinStatus);

export default router;
