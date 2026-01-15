const router = require("express").Router();

const requireAuth = require("../middlewares/requireAuth");

const {
  listMovies,
  getMovieById,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movies.controller");

// routes Guest
router.get("/", listMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);

// routes avec JWT requis
router.post("/", requireAuth, createMovie);
router.patch("/:id", requireAuth, updateMovie);
router.delete("/:id", requireAuth, deleteMovie);

module.exports = router;
