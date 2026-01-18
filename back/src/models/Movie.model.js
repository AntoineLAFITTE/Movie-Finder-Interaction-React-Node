const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    // OMDb / affichage
    imdbID: { type: String }, // optionnel (utile pour les imports)
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

    // différencie movie créé vs import OMDb
    source: {
      type: String,
      enum: ["manual", "omdb"],
      default: "manual",
    },
  },
  { timestamps: true }
);

// éviterles doublons d’import du même film par le même user pour fix le soucis des favoris
movieSchema.index({ owner: 1, imdbID: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Movie", movieSchema);
