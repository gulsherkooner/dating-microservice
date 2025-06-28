import DatingProfile from '../models/DatingProfile.js';
import getDbxToken from '../utils/getDbxToken.js';
import uploadToDropbox from '../config/dropbox.js';
import ChatPermission from '../models/ChatPermission.js';
function base64DataToBuffer(base64String) {
  const base64Data = base64String.split(',')[1] || base64String;
  return Buffer.from(base64Data, 'base64');
}

export const createDatingProfile = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    if (!user_id) return res.status(400).json({ message: 'Missing user_id in headers' });

    const existing = await DatingProfile.findOne({ where: { user_id } });
    if (existing) return res.status(400).json({ message: 'Profile already exists' });

    const newProfile = await DatingProfile.create({ ...req.body, user_id });
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkProfile = async (req, res) => {
  try {
    const user_id = req.headers['x-user-id'];
    if (!user_id) return res.status(400).json({ message: 'Missing user_id in headers' });

    const profile = await DatingProfile.findOne({ where: { user_id } });
    res.json({ exists: !!profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDatingProfileByUserId = async (req, res) => {
  try {
    const profile = await DatingProfile.findOne({ where: { user_id: req.params.user_id } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDatingProfileById = async (req, res) => {
  try {
    const profile = await DatingProfile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDatingProfiles = async (req, res) => {
  try {
    const profiles = await DatingProfile.findAll();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDatingProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { profile_img_data, banner_img_data, ...fields } = req.body;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const dbxToken = await getDbxToken();
    const updateData = { ...fields };
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (profile_img_data?.blob && profile_img_data?.name) {
      if (profile_img_data.size > MAX_FILE_SIZE) return res.status(400).json({ error: 'Profile image too large' });
      if (!validTypes.includes(profile_img_data.type)) return res.status(400).json({ error: 'Invalid profile image type' });

      const mediaUrl = await uploadToDropbox(
        base64DataToBuffer(profile_img_data.blob),
        `dating-profile-${user_id}-${Date.now()}.jpg`,
        dbxToken,
        res
      );
      if (!mediaUrl) return res.status(500).json({ error: 'Upload failed' });
      updateData.profile_img_url = [mediaUrl];
    }

    if (banner_img_data?.blob && banner_img_data?.name) {
      if (banner_img_data.size > MAX_FILE_SIZE) return res.status(400).json({ error: 'Banner image too large' });
      if (!validTypes.includes(banner_img_data.type)) return res.status(400).json({ error: 'Invalid banner image type' });

      const mediaUrl = await uploadToDropbox(
        base64DataToBuffer(banner_img_data.blob),
        `dating-banner-${user_id}-${Date.now()}.jpg`,
        dbxToken,
        res
      );
      if (!mediaUrl) return res.status(500).json({ error: 'Upload failed' });
      updateData.banner_img_url = [mediaUrl];
    }

    const [updatedRows, [updatedProfile]] = await DatingProfile.update(updateData, {
      where: { user_id },
      returning: true
    });

    if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUnlockedContacts = async (req, res) => {
  const { user_id } = req.params;

  try {
    const permissions = await ChatPermission.findAll({
      where: {
        [Op.or]: [
          { fromUserId: user_id },
          { toUserId: user_id },
        ],
      },
    });

    const ids = new Set();

    permissions.forEach(p => {
      // If user initiated, add the target
      if (p.fromUserId === user_id) ids.add(p.toUserId);
      // If user was the target, add the one who paid
      if (p.toUserId === user_id) ids.add(p.fromUserId);
    });

    const profiles = await DatingProfile.findAll({
      where: { user_id: [...ids] }
    });

    res.json(profiles);
  } catch (err) {
    console.error("Error fetching unlocked contacts", err);
    res.status(500).json({ error: 'Failed to fetch unlocked contacts' });
  }
};
