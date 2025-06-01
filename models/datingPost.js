import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust the path if your sequelize instance is elsewhere

const DatingPost = sequelize.define('DatingPost', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false, // References DatingProfile.user_id
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false, // URL or base64 string
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'image/jpeg',
  },
  name: {
    type: DataTypes.STRING,
  },
  ispinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true, // includes createdAt, updatedAt
  tableName: 'DatingPost', // optional: specify table name
});

export default DatingPost;
