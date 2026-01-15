const User = require("../models/User.model");
const Movie = require("../models/Movie.model");

// GET /me
async function getMe(req, res) {
  const user = await User.findById(req.user.userId)
    .select("_id username email createdAt");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
}

// GET /me/movies
async function getMyMovies(req, res) {
  const movies = await Movie.find({ owner: req.user.userId })
    .sort({ createdAt: -1 });

  res.json({ items: movies });
}

module.exports = { getMe, getMyMovies };
