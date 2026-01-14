const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
