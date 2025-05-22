// middleware/extractUser.js
export function extractUserFromHeader(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'User ID header missing' });
  }
  req.user = { sub: userId };  // set user object for downstream usage
  next();
}
