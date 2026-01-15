const mongoose = require("mongoose");
const Favorite = require("../models/Favorite.model");
const Movie = require("../models/Movie.model");

// POST /favorites/:movieId
async function addFavorite(req, res) {
  const { movieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: "Invalid movie id" });
  }

  // movie must exist (et public ou pas a voir)
  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  try {
    const fav = await Favorite.create({
      user: req.user.userId,
      movie: movieId,
    });

    return res.status(201).json({ message: "Added to favorites", favorite: fav });
  } catch (err) {
    // index unique => déjà en favoris
    if (err.code === 11000) {
      return res.status(200).json({ message: "Already in favorites" });
    }
    throw err;
  }
}

// DELETE /favorites/:movieId
async function removeFavorite(req, res) {
  const { movieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ message: "Invalid movie id" });
  }

  await Favorite.deleteOne({ user: req.user.userId, movie: movieId });
  return res.json({ message: "Removed from favorites" });
}

module.exports = { addFavorite, removeFavorite };
