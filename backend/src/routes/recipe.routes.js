import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import * as recipeController from "../controllers/recipe.controller.js";
import upload from "../utils/multer.js";

const recipeRouter = Router();

recipeRouter.post(
  "/",
  protect,
  upload.single("image"),
  recipeController.createRecipe,
);
// recipeRouter.get(
//   "/get-recipe-by-id/:id",
//   protect,
//   recipeController.getRecipeById,
// );
recipeRouter.get("/get-all-recipes", recipeController.getAllRecipes);
recipeRouter.get("/", recipeController.getRecipes);
recipeRouter.get("/get-my-recipes",protect, recipeController.getMyRecipes);
recipeRouter.get("/feed", protect, recipeController.getFeed);
// recipeRouter.post("/:id/rate",protect,recipeController.rateRecipe)
recipeRouter.post("/:id/rate", protect, recipeController.rateRecipe);
recipeRouter.post("/:id/comment", protect, recipeController.addComment);
recipeRouter.get("/:id", recipeController.getSingleRecipe);
recipeRouter.patch("/:id", protect, recipeController.updateRecipe);
recipeRouter.delete("/:id", protect, recipeController.deleteRecipe);
export default recipeRouter;
