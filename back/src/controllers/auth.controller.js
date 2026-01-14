const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const redis = require("../config/redis");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshCookieOptions,
} = require("../utils/tokens");
const { registerSchema, loginSchema } = require("../validators/auth.validators");

function redisKeyForUser(userId) {
  return `refresh:${userId}`;
}

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
  }

  const { username, email, password } = parsed.data;

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });

  // auto-login after register
  const accessToken = signAccessToken({ userId: user._id.toString(), username: user.username });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  // Redis session: whitelist refresh token (1 seul refresh actif par user à la fois)
  const key = redisKeyForUser(user._id.toString());
  await redis.set(key, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 jours en secondes (aligner avec REFRESH_TOKEN_TTL)

  res.cookie("refreshToken", refreshToken, refreshCookieOptions());

  return res.status(201).json({
    user: { id: user._id, username: user.username, email: user.email },
    accessToken,
  });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = signAccessToken({ userId: user._id.toString(), username: user.username });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  const key = redisKeyForUser(user._id.toString());
  await redis.set(key, refreshToken, "EX", 7 * 24 * 60 * 60);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions());

  return res.json({
    user: { id: user._id, username: user.username, email: user.email },
    accessToken,
  });
}

async function refresh(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = verifyRefreshToken(token);
    const userId = payload.userId;

    // Check Redis whitelist
    const key = redisKeyForUser(userId);
    const stored = await redis.get(key);

    if (!stored || stored !== token) {
      // Refresh invalide => clean cookie
      res.clearCookie("refreshToken", refreshCookieOptions());
      return res.status(401).json({ message: "Refresh token invalid" });
    }

    const user = await User.findById(userId).select("username email");
    if (!user) {
      res.clearCookie("refreshToken", refreshCookieOptions());
      return res.status(401).json({ message: "User not found" });
    }

    // Rotate refresh
    const newAccessToken = signAccessToken({ userId, username: user.username });
    const newRefreshToken = signRefreshToken({ userId });

    await redis.set(key, newRefreshToken, "EX", 7 * 24 * 60 * 60);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions());

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.clearCookie("refreshToken", refreshCookieOptions());
    return res.status(401).json({ message: "Refresh token expired/invalid" });
  }
}

async function logout(req, res) {
  const token = req.cookies?.refreshToken;

  // supprimer la session redis if possible
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      const key = redisKeyForUser(payload.userId);
      await redis.del(key);
    } catch (err) {
      // token déjà invalide/expiré => on fait quand même le clear du cookie
    }
  }

  res.clearCookie("refreshToken", refreshCookieOptions());
  return res.json({ message: "Logged out" });
}

module.exports = { register, login, refresh, logout };
