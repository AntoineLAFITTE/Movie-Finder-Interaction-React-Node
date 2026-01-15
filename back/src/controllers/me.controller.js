const User = require("../models/User.model");
const Movie = require("../models/Movie.model");
const Favorite = require("../models/Favorite.model");

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

// GET /me/favorites
async function getMyFavorites(req, res) {
  const favorites = await Favorite.find({ user: req.user.userId })
    .populate({
      path: "movie",
      populate: { path: "owner", select: "username" },
    })
    .sort({ createdAt: -1 });

  // Renvoie juste les movies
  const items = favorites
    .map((f) => f.movie)
    .filter(Boolean);

  res.json({ items });
}


module.exports = { getMe, getMyMovies, getMyFavorites };
