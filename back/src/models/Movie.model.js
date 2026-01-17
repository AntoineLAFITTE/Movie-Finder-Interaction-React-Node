const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    imdbID: { type: String, index: true }, // pour l'import OMDb

    title: { type: String, required: true },
    year: String,
    poster: String,
    description: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "link", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
