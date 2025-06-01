import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js'; // Sequelize instance
import DatingProfile from './models/DatingProfile.js'; // Sequelize model
import walletRoutes from './routes/walletRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';
import uploadToDropbox from './config/dropbox.js';
import getDbxToken from './utils/getDbxToken.js';
import datingPostRoutes from './routes/datingPost.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import logger from './config/logger.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads

// Postgres connection
sequelize
  .authenticate()
  .then(() => {
    logger.info("Connected to PostgreSQL");
  })
  .catch((error) => {
    logger.error("Error connecting to PostgreSQL:", error.message);
    process.exit(1);
  });

// Check if profile exists
app.post('/api/dating-profile', async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id in headers' });
    }

    const existingProfile = await DatingProfile.findOne({ where: { user_id } });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const newProfile = await DatingProfile.create({ ...req.body, user_id });
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/check-profile', async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id in headers' });
    }

    const profile = await DatingProfile.findOne({ where: { user_id } });
    res.json({ exists: !!profile });
  } catch (error) {
    console.error('Check profile error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's dating profile
app.get('/api/dating-profile/:user_id', async (req, res) => {
  try {
    const profile = await DatingProfile.findOne({ where: { user_id: req.params.user_id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/find-dating-profile/:id', async (req, res) => {
  try {
    const profile = await DatingProfile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update dating profile with Dropbox integration
app.put('/api/dating-profile/:user_id', async (req, res) => {
  try {
    function base64DataToBuffer(base64String) {
      const base64Data = base64String.split(',')[1] || base64String;
      return Buffer.from(base64Data, 'base64');
    }
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id param" });
    }

    const { profile_img_data, banner_img_data, ...otherFields } = req.body;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const dbxAccessToken = await getDbxToken();
    if (!dbxAccessToken) {
      return res.status(500).json({ error: "Failed to get Dropbox access token" });
    }

    const updateData = { ...otherFields };

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

    if (profile_img_data && profile_img_data.blob && profile_img_data.name) {
      if (profile_img_data.size > MAX_FILE_SIZE) {
        return res.status(400).json({ error: "Profile image too large (max 5MB)" });
      }
      if (!validImageTypes.includes(profile_img_data.type)) {
        return res.status(400).json({ error: "Invalid profile image type" });
      }

      const mediaUrl = await uploadToDropbox(
        base64DataToBuffer(profile_img_data.blob),
        `dating-profile-${user_id}-${Date.now()}.jpg`,
        dbxAccessToken,
        res
      );

      if (!mediaUrl) {
        return res.status(500).json({ error: "Failed to upload profile image" });
      }
      updateData.profile_img_url = [mediaUrl];
    }

    if (banner_img_data && banner_img_data.blob && banner_img_data.name) {
      if (banner_img_data.size > MAX_FILE_SIZE) {
        return res.status(400).json({ error: "Banner image too large (max 5MB)" });
      }
      if (!validImageTypes.includes(banner_img_data.type)) {
        return res.status(400).json({ error: "Invalid banner image type" });
      }

      const mediaUrl = await uploadToDropbox(
        base64DataToBuffer(banner_img_data.blob),
        `dating-banner-${user_id}-${Date.now()}.jpg`,
        dbxAccessToken,
        res
      );

      if (!mediaUrl) {
        return res.status(500).json({ error: "Failed to upload banner image" });
      }
      updateData.banner_img_url = [mediaUrl];
    }

    const [updatedRows, [updatedProfile]] = await DatingProfile.update(
      updateData,
      {
        where: { user_id },
        returning: true,
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating dating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get matches (example using Sequelize)
app.post('/api/matches', async (req, res) => {
  const filters = req.body;
  try {
    const where = {
      ...(filters.gender && { gender: filters.gender }),
      ...(filters.ageRange && {
        age: { [Op.between]: filters.ageRange }
      }),
      ...(filters.locations?.length && { locations: filters.locations }),
      ...(filters.languages?.length && { languages: filters.languages }),
      ...(filters.lookingFor && { lookingFor: filters.lookingFor }),
      ...(filters.likes?.length && { likes: filters.likes }),
    };

    const results = await DatingProfile.findAll({ where });
    res.json({ profiles: results });
  } catch (err) {
    console.error('❌ Matching failed:', err);
    res.status(500).json({ message: 'Error finding matches', error: err });
  }
});

// Routes
app.use('/api', walletRoutes);
app.use('/api', paymentMethodRoutes);
app.use('/api/dating-posts', datingPostRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});