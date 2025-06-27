import express from 'express';
import {
  createDatingProfile,
  checkProfile,
  getDatingProfileByUserId,
  getDatingProfileById,
  updateDatingProfile,
  getDatingProfiles,
  getUnlockedContacts
} from '../controllers/profileController.js';

const router = express.Router();

router.post('/dating-profile', createDatingProfile);
router.get('/dating-profiles', getDatingProfiles);
router.get('/check-profile', checkProfile);
router.get('/dating-profile/:user_id', getDatingProfileByUserId);
router.get('/find-dating-profile/:id', getDatingProfileById);
router.put('/dating-profile/:user_id', updateDatingProfile);
router.get('/unlocked-contacts/:user_id', getUnlockedContacts);

export default router;
