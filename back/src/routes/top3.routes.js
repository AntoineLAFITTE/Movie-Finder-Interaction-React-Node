const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");

const {
  listTop3,
  getTop3ById,
  searchTop3,
  createTop3,
  updateTop3,
  deleteTop3,
} = require("../controllers/top3.controller");

// public
router.get("/", listTop3);
router.get("/search", searchTop3);
router.get("/:id", getTop3ById);

// auth
router.post("/", requireAuth, createTop3);
router.patch("/:id", requireAuth, updateTop3);
router.delete("/:id", requireAuth, deleteTop3);

module.exports = router;
