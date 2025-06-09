export const findMatches = async (req, res) => {
  let filters = req.body;
  const { limit = 20, offset = 0 } = req.query;

  try {
    // Normalize scalar filters into arrays
    if (filters.gender && !Array.isArray(filters.gender)) {
      filters.gender = [filters.gender];
    }
    if (filters.lookingFor && !Array.isArray(filters.lookingFor)) {
      filters.lookingFor = [filters.lookingFor];
    }

    const where = {
      ...(filters.gender?.length && { gender: { [Op.overlap]: filters.gender } }),
      ...(Array.isArray(filters.ageRange) && filters.ageRange.length === 2 && {
        age: { [Op.between]: filters.ageRange }
      }),
      ...(filters.locations?.length && { locations: { [Op.overlap]: filters.locations } }),
      ...(filters.languages?.length && { languages: { [Op.overlap]: filters.languages } }),
      ...(filters.lookingFor?.length && { lookingFor: { [Op.overlap]: filters.lookingFor } }),
      ...(filters.likes?.length && { likes: { [Op.overlap]: filters.likes } })
    };

    const profiles = await DatingProfile.findAll({ where, limit, offset });
    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ message: "Error finding matches", error: error.message });
  }
};
