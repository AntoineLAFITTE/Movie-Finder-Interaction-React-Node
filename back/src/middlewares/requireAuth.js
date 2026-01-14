const { verifyAccessToken } = require("../utils/tokens");

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = auth.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // { userId, username }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
