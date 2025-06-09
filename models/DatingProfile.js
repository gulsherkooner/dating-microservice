import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DatingProfile = sequelize.define('DatingProfile', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
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
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  height: {
    type: DataTypes.STRING,
    allowNull: true,
  },
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
  describeSelf: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idealDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  greatPartner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
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
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'dating_profile',
});

export default DatingProfile;
