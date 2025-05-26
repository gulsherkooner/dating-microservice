import DatingPost from '../models/datingPost.js';
import uploadToDropbox  from '../utils/uploadToDropbox.js';
export const createPost = async (req, res) => {
  try {
    const { image, type, name } = req.body;
    const user_id = req.user.sub || req.user.user_id;

    if (!image) return res.status(400).json({ error: 'Image is required' });

    // Correct argument order: filename first, then base64 image string
    const dropboxResponse = await uploadToDropbox(name, image);

    // Extract a string path from dropboxResponse
    const dropboxFilePath = dropboxResponse.publicUrl;

    const post = await DatingPost.create({
      user_id,
      image: dropboxFilePath, // store string path or ID in image field
      type,
      name,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Post upload failed:', err);
    res.status(500).json({ error: 'Server error while uploading post' });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const user_id = req.user.sub || req.user.user_id;

    const posts = await DatingPost.find({ user_id }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

export const updatePinStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { ispinned } = req.body;
    const user_id = req.user.sub;

    const post = await DatingPost.findOneAndUpdate(
      { _id: id, user_id },           // match correct post
      { $set: { ispinned } },         // update field properly
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json(post);
  } catch (err) {
    console.error('Failed to update pin:', err);
    res.status(500).json({ error: 'Server error while updating pin' });
  }
};

