import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DatingPost = sequelize.define('DatingPost', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
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
  timestamps: true,
  tableName: 'dating_post',
});

export default DatingPost;
