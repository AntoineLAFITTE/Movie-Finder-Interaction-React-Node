const redis = require("../config/redis");

const OMDB_BASE = "https://www.omdbapi.com/";

function safeEncode(v) {
  return encodeURIComponent(v ?? "");
}

async function safeFetchJson(url) {
  const r = await fetch(url);
  const text = await r.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("OMDb non-JSON response:", text.slice(0, 100));
    const err = new Error("OMDb returned non-JSON response");
    err.statusCode = 502;
    throw err;
  }
}

// GET /omdb/search?q=batman&page=1 < pour la test
async function searchOmdb(req, res) {
  const q = (req.query.q || "").trim();
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);

  if (!q) return res.json({ Search: [], totalResults: "0", Response: "True" });

  const cacheKey = `omdb:search:${q.toLowerCase()}:page:${page}`;

  // 1) Cache d’abord
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // 2) Pas de cache => OMDb
  try {
    const url =
      `${OMDB_BASE}?apikey=${safeEncode(process.env.OMDB_API_KEY)}` +
      `&s=${safeEncode(q)}&page=${page}&type=movie`;

    const data = await safeFetchJson(url);

    if (data?.Response === "False") {
      return res.json({
        Search: [],
        totalResults: "0",
        Response: "False",
        Error: data.Error,
      });
    }

    await redis.set(cacheKey, JSON.stringify(data), "EX", 600);
    return res.json(data);
  } catch (err) {
    console.error(err);

    // IMPORTANT: on renvoie 200 + format OMDb pour ne pas casser le front
    return res.json({
      Search: [],
      totalResults: "0",
      Response: "False",
      Error: "OMDb temporairement indisponible. Réessaie dans quelques secondes.",
    });
  }
}

// GET /omdb/:imdbID
async function getOmdbById(req, res) {
  const { imdbID } = req.params;
  if (!imdbID) return res.status(400).json({ message: "Missing imdbID" });

  const cacheKey = `omdb:id:${imdbID}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  try {
    const url =
      `${OMDB_BASE}?apikey=${safeEncode(process.env.OMDB_API_KEY)}` +
      `&i=${safeEncode(imdbID)}&plot=full`;

    const data = await safeFetchJson(url);

    if (data?.Response === "False") {
      return res.status(404).json({ message: data.Error || "Not found" });
    }

    await redis.set(cacheKey, JSON.stringify(data), "EX", 3600);
    return res.json(data);
  } catch (err) {
    console.error(err);

    // pareil: 200 + format OMDb pour éviter un “502” côté front
    return res.json({
      Response: "False",
      Error: "OMDb temporairement indisponible. Réessaie dans quelques secondes.",
    });
  }
}

module.exports = { searchOmdb, getOmdbById };
