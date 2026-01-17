const mongoose = require("mongoose");
const Top3 = require("../models/Top3.model");

// ---------- GUEST (public) ----------

// GET /top3?page=1&limit=12
async function listTop3(req, res) {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Top3.find({ visibility: "public" })
      .populate("owner", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Top3.countDocuments({ visibility: "public" }),
  ]);

  res.json({ page, limit, total, items });
}

// GET /top3/:id
async function getTop3ById(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

  const item = await Top3.findOne({ _id: id, visibility: "public" }).populate("owner", "username");
  if (!item) return res.status(404).json({ message: "Top3 not found" });

  res.json(item);
}

// GET /top3/search?q=action
async function searchTop3(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ items: [] });

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const items = await Top3.find({
    visibility: "public",
    title: regex,
  })
    .populate("owner", "username")
    .sort({ createdAt: -1 })
    .limit(30);

  res.json({ items });
}

// ---------- AUTH (owner only) ----------

// GET /me/top3  (mounted in me.routes)
async function listMyTop3(req, res) {
  const items = await Top3.find({ owner: req.user.userId }).sort({ createdAt: -1 });
  res.json({ items });
}

// POST /top3
async function createTop3(req, res) {
  const { title, movies, visibility } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "title is required" });
  }

  if (!Array.isArray(movies) || movies.length !== 3) {
    return res.status(400).json({ message: "movies must be an array of exactly 3 items" });
  }

  // validation basique des 3 films
  for (const m of movies) {
    if (!m?.imdbID || !m?.Title) {
      return res.status(400).json({ message: "Each movie must have imdbID and Title" });
    }
  }

  const item = await Top3.create({
    title: title.trim(),
    movies,
    visibility: visibility || "public",
    owner: req.user.userId,
  });

  res.status(201).json(item);
}

// PATCH /top3/:id
async function updateTop3(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

  const item = await Top3.findById(id);
  if (!item) return res.status(404).json({ message: "Top3 not found" });

  if (item.owner.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden: not the owner" });
  }

  const allowed = ["title", "movies", "visibility"];
  for (const key of allowed) {
    if (key in req.body) item[key] = req.body[key];
  }

  // si movies modifié, vérifier length === 3
  if ("movies" in req.body) {
    if (!Array.isArray(item.movies) || item.movies.length !== 3) {
      return res.status(400).json({ message: "movies must contain exactly 3 items" });
    }
  }

  await item.save();
  res.json(item);
}

// DELETE /top3/:id
async function deleteTop3(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

  const item = await Top3.findById(id);
  if (!item) return res.status(404).json({ message: "Top3 not found" });

  if (item.owner.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden: not the owner" });
  }

  await item.deleteOne();
  res.json({ message: "Deleted" });
}

module.exports = {
  listTop3,
  getTop3ById,
  searchTop3,
  listMyTop3,
  createTop3,
  updateTop3,
  deleteTop3,
};
