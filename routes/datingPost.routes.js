import express from 'express';
import { createPost, getUserPosts } from '../controllers/datingPost.controller.js';
import { extractUserFromHeader } from '../middleware/extractUser.js';
const router = express.Router();

router.post('/', extractUserFromHeader,createPost);
router.get('/me',extractUserFromHeader, getUserPosts);

export default router;
