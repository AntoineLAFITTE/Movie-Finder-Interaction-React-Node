const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const moviesRoutes = require("./routes/movies.routes");
const usersRoutes = require("./routes/users.routes");
const meRoutes = require("./routes/me.routes");
const favoritesRoutes = require("./routes/favorites.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/auth", authRoutes);
app.use("/movies", moviesRoutes);
app.use("/users", usersRoutes);
app.use("/me", meRoutes);
app.use("/favorites", favoritesRoutes);

module.exports = app;
