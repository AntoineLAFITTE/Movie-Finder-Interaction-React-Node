const router = require("express").Router();
const { listMovies, getMovieById, searchMovies } = require("../controllers/movies.controller");

router.get("/", listMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);

module.exports = router;
