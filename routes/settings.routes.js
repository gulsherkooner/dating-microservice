import express from 'express';
import Settings from '../models/settings.js';

const router = express.Router();

// Get user settings
router.get('/settings/:user_id', async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const settings = await Settings.findOne({ where: { user_id } });
    res.json(settings || {});
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Save or update settings
router.post('/settings/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const newSettings = req.body;

  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
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
    console.error('Error saving settings:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
