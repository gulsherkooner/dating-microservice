import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
import DatingProfile from './models/DatingProfile.js';
import walletRoutes from './routes/walletRoutes.js'; // Adjust path if needed
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/datingApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// Check if profile exists
// Check if profile exists
app.get('/api/check-profile', async (req, res) => {
  try {
    // console.log("Recived!!");
    const user_id = req.headers['x-user-id']; // ✅ Proper way to get user_id
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id in headers' });
    }

    const profile = await DatingProfile.findOne({ user_id });
    res.json({ exists: !!profile });
  } catch (error) {
    console.error('Check profile error:', error);
    res.status(500).json({ message: "Server error" });
  }
});



// Create dating profile
app.post('/dating-profile', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id in body' });
    }

    // Check if profile already exists
    const existingProfile = await DatingProfile.findOne({ user_id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    // Create new profile
    const newProfile = new DatingProfile({ ...req.body });
    await newProfile.save();

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's dating profile
app.get('/api/dating-profile/:user_id', async (req, res) => {
  // console.log(req.params.user_id);
  try {
    const profile = await (DatingProfile.findOne({ user_id: req.params.user_id }));
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
    // console.log(profile);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/find-dating-profile/:_id', async (req, res) => {
  // console.log(req.params.user_id);
  try {
    console.log(req.params._id);
    const profile = await (DatingProfile.findOne({_id: req.params._id }));
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
    // console.log(profile);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update dating profile
app.put('/api/dating-profile/:user_id', async (req, res) => {
  try {
    console.log(req.params.user_id);
    const updatedProfile = await DatingProfile.findOneAndUpdate(
      { user_id: req.params.user_id },
      req.body,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get matches
app.post('/api/matches', async (req, res) => {
  const filters = req.body;
  // console.log("🎯 Received filters:", filters);

  try {
    const query = {
      ...(filters.gender && { gender: { $in: [filters.gender] } }),
      ...(filters.ageRange && {
        age: { $gte: filters.ageRange[0], $lte: filters.ageRange[1] }
      }),
      ...(filters.locations?.length && { locations: { $in: filters.locations } }),
      ...(filters.languages?.length && { languages: { $in: filters.languages } }),
      ...(filters.lookingFor && { lookingFor: { $in: [filters.lookingFor] } }),
      ...(filters.likes?.length && { likes: { $in: filters.likes } }),
    };

    const results = await DatingProfile.find(query);
    // console.log(`✅ Matches found: ${results.length}`);
    res.json({ profiles: results });
  } catch (err) {
    console.error('❌ Matching failed:', err);
    res.status(500).json({ message: 'Error finding matches', error: err });
  }
});
app.use('/api',walletRoutes);
// app.use('/api', paymentMethodRoutes); // for future 


// Serve uploaded files statically
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(path.resolve(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Upload profilePic or bannerImage
app.post('/api/dating-profile/upload-image', upload.single('image'), async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    const type = req.body.type; // 'profilePic' or 'banner'

    if (!user_id || !type || !req.file) {
      return res.status(400).json({ message: 'Missing data' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const updateField = type === 'banner' ? { bannerImageUrl: fileUrl } : { profilePicUrl: fileUrl };

    const updatedProfile = await DatingProfile.findOneAndUpdate(
      { user_id },
      { $set: updateField },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ url: fileUrl });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});