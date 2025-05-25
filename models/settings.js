// models/Settings.js
import mongoose from 'mongoose';
const settingsSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },

  accessibility: {
    appearance: String,
    colorContrast: String,
    fontSize: String,
    autoplay: String
  },

  content: {
    localContent: String,
    sensitiveContentLevel: String,
    suggestionPreference: String,
    likes: [String],
    dislikes: [String]
  },

  notifications: {
    email: {
      reminders: String,
      updates: String,
      tips: String,
      connections: String,
      suggestions: String
    },
    push: {
      messages: String,
      trending: String,
      offers: String,
      news: String,
      comments: String,
      likes: String,
      datingMessages: String
    }
  },

  privacy: {
    messages: {
      whoCanMessage: String,
      readReceipts: String,
      onlineStatus: String
    },
    location: {
      showInProfile: String,
      allowAccess: String,
      suggestions: String
    },
    blockedUsers: [{ name: String, handle: String }],
    mutedUsers: [{ name: String, handle: String }]
  }
});

export default mongoose.model('Settings', settingsSchema);
