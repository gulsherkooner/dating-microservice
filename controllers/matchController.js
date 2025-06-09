import DatingProfile from '../models/DatingProfile.js';
import { Op } from 'sequelize';

export const findMatches = async (req, res) => {
  const filters = req.body;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const where = {
      ...(filters.gender && { gender: { [Op.overlap]: filters.gender } }),
      ...(filters.ageRange?.length === 2 && { age: { [Op.between]: filters.ageRange } }),
      ...(filters.locations?.length && { locations: { [Op.overlap]: filters.locations } }),
      ...(filters.languages?.length && { languages: { [Op.overlap]: filters.languages } }),
      ...(filters.lookingFor && { lookingFor: { [Op.overlap]: filters.lookingFor } }),
      ...(filters.likes?.length && { likes: { [Op.overlap]: filters.likes } })
    };

    const profiles = await DatingProfile.findAll({ where, limit, offset });
    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ message: 'Error finding matches', error });
  }
};
