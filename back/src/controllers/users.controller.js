const User = require("../models/User.model");
const Movie = require("../models/Movie.model");

// GET /users/:username  => profil public + movies publics du user
async function getPublicProfile(req, res) {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("_id username createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });

  const movies = await Movie.find({ owner: user._id, visibility: "public" })
    .sort({ createdAt: -1 })
    .select("title year poster createdAt");

  res.json({
    user,
    movies,
  });
}

module.exports = { getPublicProfile };
