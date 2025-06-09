import express from 'express';
import { findMatches } from '../controllers/matchController.js';

const router = express.Router();
router.post('/matches', findMatches);
export default router;
