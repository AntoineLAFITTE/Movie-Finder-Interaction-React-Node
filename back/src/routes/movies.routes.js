const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");

const {
  listMovies,
  getMovieById,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  importMovieFromOmdb,
} = require("../controllers/movies.controller");

// Guest routes
router.get("/", listMovies);
router.get("/search", searchMovies);

// Connected route import des movies OMDB
router.post("/import", requireAuth, importMovieFromOmdb);

// Guest details
router.get("/:id", getMovieById);

// Connected CRUD
router.post("/", requireAuth, createMovie);
router.patch("/:id", requireAuth, updateMovie);
router.delete("/:id", requireAuth, deleteMovie);

module.exports = router;
