import mongoose from 'mongoose';

const datingPostSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // References DatingProfile.user_id
  image: { type: String, required: true },   // base64 string or URL
  type: { type: String, default: 'image/jpeg' },
  name: { type: String },
  ispinned:{type: Boolean},
}, { timestamps: true }); // includes createdAt, updatedAt

export default mongoose.model('DatingPost', datingPostSchema);
