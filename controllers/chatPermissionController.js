import ChatPermission from '../models/ChatPermission.js';
import DatingProfile from '../models/DatingProfile.js';

export const getUnlockedContacts = async (req, res) => {
  const { user_id } = req.params;

  try {
    const permissions = await ChatPermission.findAll({ where: { fromUserId: user_id } });

    const allowedIds = permissions.map(p => p.toUserId);

    const profiles = await DatingProfile.findAll({
      where: { user_id: allowedIds }
    });

    res.status(200).json(profiles);
  } catch (err) {
    console.error("❌ Error fetching unlocked contacts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
