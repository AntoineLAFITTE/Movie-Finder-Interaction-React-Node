const router = require("express").Router();
const { getPublicProfile } = require("../controllers/users.controller");

router.get("/:username", getPublicProfile);

module.exports = router;
