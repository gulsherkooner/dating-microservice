import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust the path if needed

const DatingProfile = sequelize.define('DatingProfile', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Each user has one profile
  },
  firstName: DataTypes.STRING,
  gender: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  interestedIn: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  lookingFor: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  age: DataTypes.INTEGER,
  height: DataTypes.STRING,
  drinkFreq: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  smokeFreq: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  workoutOptions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  locations: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  professions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  describeSelf: DataTypes.STRING,
  idealDate: DataTypes.STRING,
  greatPartner: DataTypes.STRING,
  likes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  profile_img_url: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  banner_img_url: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  phone: DataTypes.STRING,
  website: DataTypes.STRING,
}, {
  timestamps: true,
  tableName: 'dating_profile',
});

export default DatingProfile;