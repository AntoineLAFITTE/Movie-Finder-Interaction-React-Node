const User = require("../models/User.model");
const Movie = require("../models/Movie.model");
const Top3 = require("../models/Top3.model");

// GET /users  => liste publique des users (username + _id)
async function listUsers(req, res) {
  const items = await User.find({})
    .sort({ createdAt: -1 })
    .select("_id username createdAt")
    .limit(200);

  res.json({ items });
}

// GET /users/:username  => profil public + movies publics + top3 publics
async function getPublicProfile(req, res) {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("_id username createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });

  // On n’affiche que les movies "manual" publics et pas les imports OMDb
  const movies = await Movie.find({
    owner: user._id,
    visibility: "public",
    source: "manual",
  })
    .sort({ createdAt: -1 })
    .select("title year poster createdAt");

  const top3 = await Top3.find({ owner: user._id, visibility: "public" })
    .sort({ createdAt: -1 })
    .select("title movies visibility createdAt");

  res.json({
    user,
    movies,
    top3,
  });
}

module.exports = { listUsers, getPublicProfile };
