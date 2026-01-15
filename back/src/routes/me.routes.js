const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const { getMe, getMyMovies } = require("../controllers/me.controller");

router.get("/", requireAuth, getMe);
router.get("/movies", requireAuth, getMyMovies);

module.exports = router;
