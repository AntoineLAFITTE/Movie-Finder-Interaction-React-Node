const mongoose = require("mongoose");

const top3MovieSchema = new mongoose.Schema(
  {
    imdbID: { type: String, required: true },
    Title: { type: String, required: true },
    Year: { type: String },
    Poster: { type: String },
  },
  { _id: false }
);

const top3Schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },

    movies: {
      type: [top3MovieSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 3,
        message: "movies must contain exactly 3 items",
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Top3", top3Schema);
