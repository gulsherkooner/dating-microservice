import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust path as needed

const Settings = sequelize.define('Settings', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  accessibility: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      appearance: "",
      colorContrast: "",
      fontSize: "",
      autoplay: ""
    },
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
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
    allowNull: false,
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
    allowNull: false,
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
  tableName: 'settings',
});

export default Settings;
