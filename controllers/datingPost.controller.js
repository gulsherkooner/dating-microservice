import DatingPost from '../models/datingPost.js';
import uploadToDropbox from '../utils/uploadToDropbox.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { image, type, name } = req.body;
    const user_id = req.user.sub || req.user.user_id;

    if (!image) return res.status(400).json({ error: 'Image is required' });

    const dropboxResponse = await uploadToDropbox(name, image);
    const dropboxFilePath = dropboxResponse.publicUrl;

    const post = await DatingPost.create({
      user_id,
      image: dropboxFilePath,
      type,
      name,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Post upload failed:', err);
    res.status(500).json({ error: 'Server error while uploading post' });
  }
};

// Get all posts for a user
export const getUserPosts = async (req, res) => {
  try {
    const user_id = req.user.sub || req.user.user_id;

    const posts = await DatingPost.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });

    res.json(posts);
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

// Update pin status of a post
export const updatePinStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { ispinned } = req.body;
    const user_id = req.user.sub || req.user.user_id;

    const post = await DatingPost.findOne({ where: { id, user_id } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    post.ispinned = ispinned;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error('Failed to update pin:', err);
    res.status(500).json({ error: 'Server error while updating pin' });
  }
};
