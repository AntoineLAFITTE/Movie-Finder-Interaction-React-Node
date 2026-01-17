const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const { getMe, getMyMovies, getMyFavorites } = require("../controllers/me.controller");
const { listMyTop3 } = require("../controllers/top3.controller");

router.get("/", requireAuth, getMe);
router.get("/movies", requireAuth, getMyMovies);
router.get("/favorites", requireAuth, getMyFavorites);

// Mes Top3 => objets créés par l’utilisateur connecté
router.get("/top3", requireAuth, listMyTop3);

module.exports = router;
