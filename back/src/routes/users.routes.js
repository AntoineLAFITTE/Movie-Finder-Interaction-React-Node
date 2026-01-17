const router = require("express").Router();
const { listUsers, getPublicProfile } = require("../controllers/users.controller");

router.get("/", listUsers);
router.get("/:username", getPublicProfile);

module.exports = router;
