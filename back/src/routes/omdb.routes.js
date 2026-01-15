const router = require("express").Router();
const { searchOmdb, getOmdbById } = require("../controllers/omdb.controller");

router.get("/search", searchOmdb);
router.get("/:imdbID", getOmdbById);

module.exports = router;
