import express from 'express';
const router = express.Router();
import Settings from '../models/settings.js'
// Get user settings
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const settings = await Settings.findOne({ user_id });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Save or update settings
router.post('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const newSettings = req.body;
  console.log("recieved");
  try {
    const updated = await Settings.findOneAndUpdate(
      { user_id },
      { $set: newSettings },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
