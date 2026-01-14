const Movie = require("../models/Movie.model");

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

  res.json({
    page,
    limit,
    total,
    items,
  });
}

// GET /movies/:id
async function getMovieById(req, res) {
  const { id } = req.params;

  const movie = await Movie.findOne({ _id: id, visibility: "public" }).populate("owner", "username");
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  res.json(movie);
}

// GET /movies/search?q=batman pour mon test dans la DB
async function searchMovies(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ items: [] });

  // Recherche simple (contains, case-insensitive)
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

module.exports = { listMovies, getMovieById, searchMovies };
