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

    // Further filter in JS: locations (loose match), languages, likes
    const matchedProfiles = allProfiles.filter(profile => {
      // 1. Loose location match (partial includes)
      if (locationArray.length > 0 && profile.locations?.length > 0) {
        const match = locationArray.some(filterLoc =>
          profile.locations.some(userLoc =>
            userLoc.toLowerCase().includes(filterLoc.toLowerCase())
          )
        );
        if (!match) return false;
      }

      // 2. Languages (at least one overlap)
      if (languagesArray.length > 0 && profile.languages?.length > 0) {
        const overlap = profile.languages.some(lang => languagesArray.includes(lang));
        if (!overlap) return false;
      }

      // 3. Likes (at least one overlap)
      if (likesArray.length > 0 && profile.likes?.length > 0) {
        const overlap = profile.likes.some(like => likesArray.includes(like));
        if (!overlap) return false;
      }

      return true;
    });

    res.status(200).json({ profiles: matchedProfiles });
  } catch (error) {
    console.error("Error in findMatches:", error);
    res.status(500).json({ message: 'Error finding matches', error: error.message });
  }
};
