import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
  {
    uesr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    weekStart: {
      type: Date,
    },
    days: {
      monday: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      tuesday: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      wednesday: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      thrusday: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      friday: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      saturday: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
      sunday: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    },
  },
  {
    timestamps: true,
  },
);

const mealPlanModel = mongoose.model("MealPlan", mealPlanSchema)

export default mealPlanModel
