const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const authRoutes = require("./routes/auth.routes");


const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
  })
);


// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


// auth routes
app.use("/auth", authRoutes);


module.exports = app;
