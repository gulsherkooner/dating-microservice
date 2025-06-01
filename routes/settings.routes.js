import express from 'express';
import  Settings  from '../models/settings.js'; // Sequelize model
const router = express.Router();

// Get user settings
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const settings = await Settings.findOne({ where: { user_id } });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Save or update settings
router.post('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const newSettings = req.body;
  try {
    // Try to find existing settings
    let settings = await Settings.findOne({ where: { user_id } });
    if (settings) {
      // Update existing
      await settings.update(newSettings);
    } else {
      // Create new
      settings = await Settings.create({ user_id, ...newSettings });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
