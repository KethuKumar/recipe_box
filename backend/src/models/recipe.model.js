import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: [ingredientSchema],
    instructions: [String],
    tags: [String],
    cookingTime: Number,
    image: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: Number,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
      },
    ],
  },
  { timestamps: true },
);

const recipeModel = mongoose.model("Recipe", recipeSchema);

export default recipeModel;
