// models/Settings.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust the path if needed

const Settings = sequelize.define('Settings', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  accessibility: {
    type: DataTypes.JSONB,
    defaultValue: {
      appearance: "",
      colorContrast: "",
      fontSize: "",
      autoplay: ""
    },
  },
  content: {
    type: DataTypes.JSONB,
    defaultValue: {
      localContent: "",
      sensitiveContentLevel: "",
      suggestionPreference: "",
      likes: [],
      dislikes: []
    },
  },
  notifications: {
    type: DataTypes.JSONB,
    defaultValue: {
      email: {
        reminders: "",
        updates: "",
        tips: "",
        connections: "",
        suggestions: ""
      },
      push: {
        messages: "",
        trending: "",
        offers: "",
        news: "",
        comments: "",
        likes: "",
        datingMessages: ""
      }
    }
  },
  privacy: {
    type: DataTypes.JSONB,
    defaultValue: {
      messages: {
        whoCanMessage: "",
        readReceipts: "",
        onlineStatus: ""
      },
      location: {
        showInProfile: "",
        allowAccess: "",
        suggestions: ""
      },
      blockedUsers: [],
      mutedUsers: []
    }
  }
}, {
  timestamps: true,
  tableName: 'Settings',
});

export default Settings;
