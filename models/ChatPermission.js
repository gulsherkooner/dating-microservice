// models/ChatPermission.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ChatPermission = sequelize.define('ChatPermission', {
  fromUserId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toUserId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grantedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chat_permission',
  timestamps: false,
  indexes: [{ unique: true, fields: ['fromUserId', 'toUserId'] }],
});

export default ChatPermission;
