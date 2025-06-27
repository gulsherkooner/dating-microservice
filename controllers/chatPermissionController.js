import ChatPermission from '../models/ChatPermission.js';
import DatingProfile from '../models/DatingProfile.js';

export const getUnlockedContacts = async (req, res) => {
  const { user_id } = req.params;
  try {
    const permissions = await ChatPermission.findAll({ where: { fromUserId: user_id } });
    const ids = permissions.map(p => p.toUserId);

    const profiles = await DatingProfile.findAll({ where: { user_id: ids } });
    res.json(profiles);
  } catch (err) {
    console.error("Error fetching unlocked contacts", err);
    res.status(500).json({ error: 'Failed to fetch unlocked contacts' });
  }
};
