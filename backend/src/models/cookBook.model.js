import mongoose from "mongoose";

const cookBookSchmea = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      default:[]
    }],
  },
  {
    timestamps: true,
  },
);

const cookBookModel = mongoose.model("CookBook", cookBookSchmea)

export default cookBookModel
