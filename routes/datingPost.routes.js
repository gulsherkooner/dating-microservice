import express from 'express';
import { createPost, getUserPosts, updatePinStatus } from '../controllers/datingPost.controller.js';
import { extractUserFromHeader } from '../middleware/extractUser.js';

const router = express.Router();

router.post('/dating-posts/me', extractUserFromHeader, createPost);
router.get('/dating/me', extractUserFromHeader, getUserPosts);
router.patch('/dating-posts/pin-post/:id', extractUserFromHeader, updatePinStatus);

export default router;
