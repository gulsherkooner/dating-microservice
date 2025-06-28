import { Op } from 'sequelize';
import DatingProfile from '../models/DatingProfile.js';

export const findMatches = async (req, res) => {
  try {
    const {
      gender, // e.g., 'Female' or ['Female', 'Trans']
      ageRange = [18, 60],
      locations = [],
      languages = [],
      lookingFor = [],
      likes = [],
    } = req.body;

    // Normalize all singular values to arrays
    const genderArray = Array.isArray(gender) ? gender : gender ? [gender] : [];
    const lookingForArray = Array.isArray(lookingFor) ? lookingFor : lookingFor ? [lookingFor] : [];
    const languagesArray = Array.isArray(languages) ? languages : [];
    const likesArray = Array.isArray(likes) ? likes : [];
    const locationArray = Array.isArray(locations) ? locations : [];

    // Construct WHERE clause
    const where = {
      ...(genderArray.length > 0 && { gender: { [Op.overlap]: genderArray } }),
      ...(lookingForArray.length > 0 && { lookingFor: { [Op.overlap]: lookingForArray } }),
      age: { [Op.between]: ageRange },
    };

    const allProfiles = await DatingProfile.findAll({ where });

    res.status(200).json({ profiles: allProfiles });
  } catch (error) {
    console.error("Error in findMatches:", error);
    res.status(500).json({ message: 'Error finding matches', error: error.message });
  }
};
