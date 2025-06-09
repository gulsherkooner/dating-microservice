import express from 'express';
import {
  createDatingProfile,
  checkProfile,
  getDatingProfileByUserId,
  getDatingProfileById,
  updateDatingProfile
} from '../controllers/profileController.js';

const router = express.Router();

router.post('/dating-profile', createDatingProfile);
router.get('/check-profile', checkProfile);
router.get('/dating-profile/:user_id', getDatingProfileByUserId);
router.get('/find-dating-profile/:id', getDatingProfileById);
router.put('/dating-profile/:user_id', updateDatingProfile);

export default router;
