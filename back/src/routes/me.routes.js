const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const { getMe, getMyMovies, getMyFavorites } = require("../controllers/me.controller");


router.get("/", requireAuth, getMe);
router.get("/movies", requireAuth, getMyMovies);
router.get("/favorites", requireAuth, getMyFavorites);

module.exports = router;
