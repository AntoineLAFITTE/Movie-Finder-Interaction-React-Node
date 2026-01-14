const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: String,
    poster: String,
    description: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    visibility: {
      type: String,
      enum: ["public", "link", "private"],
      default: "public"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
