const Movie = require("../models/Movie.model");
const mongoose = require("mongoose");

// Pour les GUESTS

// GET /movies?page=1&limit=12
async function listMovies(req, res) {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Movie.find({ visibility: "public" })
      .populate("owner", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Movie.countDocuments({ visibility: "public" }),
  ]);

  res.json({ page, limit, total, items });
}

// GET /movies/:id
async function getMovieById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const movie = await Movie.findOne({ _id: id, visibility: "public" })
    .populate("owner", "username");

  if (!movie) return res.status(404).json({ message: "Movie not found" });

  res.json(movie);
}

// GET /movies/search?q=batman
async function searchMovies(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ items: [] });

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const items = await Movie.find({
    visibility: "public",
    $or: [{ title: regex }, { description: regex }],
  })
    .populate("owner", "username")
    .sort({ createdAt: -1 })
    .limit(30);

  res.json({ items });
}


// Pour les USERS authentifiés


// POST /movies
async function createMovie(req, res) {
  const { title, year, poster, description, visibility } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "title is required" });
  }

  const movie = await Movie.create({
    title: title.trim(),
    year,
    poster,
    description,
    visibility: visibility || "public",
    owner: req.user.userId,
  });

  res.status(201).json(movie);
}

// PATCH /movies/:id
async function updateMovie(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const movie = await Movie.findById(id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  if (movie.owner.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden: not the owner" });
  }

  const allowed = ["title", "year", "poster", "description", "visibility"];
  for (const key of allowed) {
    if (key in req.body) movie[key] = req.body[key];
  }

  await movie.save();
  res.json(movie);
}

// DELETE /movies/:id
async function deleteMovie(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const movie = await Movie.findById(id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  if (movie.owner.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden: not the owner" });
  }

  await movie.deleteOne();
  res.json({ message: "Deleted" });
}

// POST /movies/import { imdbID }
async function importMovieFromOmdb(req, res) {
  const { imdbID } = req.body;

  if (!imdbID || typeof imdbID !== "string") {
    return res.status(400).json({ message: "imdbID is required" });
  }

  // Si déjà importé par le user, on le renvoie
  const existing = await Movie.findOne({ imdbID, owner: req.user.userId });
  if (existing) return res.status(200).json(existing);

  const url =
    `https://www.omdbapi.com/?apikey=${encodeURIComponent(process.env.OMDB_API_KEY)}` +
    `&i=${encodeURIComponent(imdbID)}&plot=full`;

  const r = await fetch(url);
  const data = await r.json();

  if (data?.Response === "False") {
    return res.status(404).json({ message: data?.Error || "OMDb movie not found" });
  }

  const movie = await Movie.create({
    imdbID: data.imdbID,
    title: data.Title,
    year: data.Year,
    poster: data.Poster,
    description: data.Plot,
    visibility: "public",
    owner: req.user.userId,
  });

  res.status(201).json(movie);
}


module.exports = {
  listMovies,
  getMovieById,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  importMovieFromOmdb,
};
