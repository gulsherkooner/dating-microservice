import { Op } from 'sequelize';
import DatingProfile from '../models/DatingProfile.js';

export const findMatches = async (req, res) => {
  let filters = req.body;

  try {
    // Normalize to arrays if needed
    if (filters.gender && !Array.isArray(filters.gender)) {
      filters.gender = [filters.gender];
    }
    if (filters.lookingFor && !Array.isArray(filters.lookingFor)) {
      filters.lookingFor = [filters.lookingFor];
    }

    const where = {
      ...(filters.gender?.length && { gender: { [Op.overlap]: filters.gender } }),
      ...(filters.ageRange?.length === 2 && { age: { [Op.between]: filters.ageRange } }),
      ...(filters.locations?.length && { locations: { [Op.overlap]: filters.locations } }),
      ...(filters.languages?.length && { languages: { [Op.overlap]: filters.languages } }),
      ...(filters.lookingFor?.length && { lookingFor: { [Op.overlap]: filters.lookingFor } }),
      ...(filters.likes?.length && { likes: { [Op.overlap]: filters.likes } }),
    };

    const profiles = await DatingProfile.findAll({ where });
    res.json({ profiles });
  } catch (error) {
    console.error("Error in findMatches:", error);
    res.status(500).json({ message: 'Error finding matches', error: error.message });
  }
};
