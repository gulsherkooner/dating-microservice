import DatingProfile from '../models/DatingProfile.js';
import { Op } from 'sequelize';

export const findMatches = async (req, res) => {
  const filters = req.body;
  try {
    const where = {
      ...(filters.gender && { gender: filters.gender }),
      ...(filters.ageRange && { age: { [Op.between]: filters.ageRange } }),
      ...(filters.locations?.length && { locations: { [Op.contains]: filters.locations } }),
      ...(filters.languages?.length && { languages: { [Op.contains]: filters.languages } }),
      ...(filters.lookingFor && { lookingFor: filters.lookingFor }),
      ...(filters.likes?.length && { likes: { [Op.contains]: filters.likes } })
    };

    const profiles = await DatingProfile.findAll({ where });
    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ message: 'Error finding matches', error });
  }
};
