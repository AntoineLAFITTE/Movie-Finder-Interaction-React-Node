const redis = require("../config/redis");

const OMDB_BASE = "https://www.omdbapi.com/";

function safeEncode(v) {
  return encodeURIComponent(v ?? "");
}

// GET /omdb/search?q=batman&page=1
async function searchOmdb(req, res) {
  const q = (req.query.q || "").trim();
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);

  if (!q) return res.json({ Search: [], totalResults: "0", Response: "True" });

  const cacheKey = `omdb:search:${q.toLowerCase()}:page:${page}`;

  // Cache Redis 10 minutes
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const url =
    `${OMDB_BASE}?apikey=${safeEncode(process.env.OMDB_API_KEY)}` +
    `&s=${safeEncode(q)}&page=${page}`;

  const r = await fetch(url);
  const data = await r.json();

  await redis.set(cacheKey, JSON.stringify(data), "EX", 600);
  return res.json(data);
}

// GET /omdb/:imdbID
async function getOmdbById(req, res) {
  const { imdbID } = req.params;
  if (!imdbID) return res.status(400).json({ message: "Missing imdbID" });

  const cacheKey = `omdb:id:${imdbID}`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const url =
    `${OMDB_BASE}?apikey=${safeEncode(process.env.OMDB_API_KEY)}` +
    `&i=${safeEncode(imdbID)}&plot=full`;

  const r = await fetch(url);
  const data = await r.json();

  await redis.set(cacheKey, JSON.stringify(data), "EX", 3600);
  return res.json(data);
}

module.exports = { searchOmdb, getOmdbById };
