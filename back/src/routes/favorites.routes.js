const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const { addFavorite, removeFavorite } = require("../controllers/favorites.controller");

router.post("/:movieId", requireAuth, addFavorite);
router.delete("/:movieId", requireAuth, removeFavorite);

module.exports = router;
