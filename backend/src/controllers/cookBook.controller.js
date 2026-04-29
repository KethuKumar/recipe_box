import cookBookModel from "../models/cookBook.model.js";

export const createCookbook = async (req, res) => {
  try {
    const { name } = req.body;

    const cookbook = await cookBookModel.create({
      name,
      user: req.user.id,
    });

    res.status(201).json(cookbook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get user cookbooks

export const getCookbooks = async (req, res) => {
  try {
    const cookbooks = await cookBookModel
      .find({ user: req.user.id })
      .populate("recipes");

    return res.status(200).json({
      cookbooks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

// add recipe to cookbook
export const addRecipeToCookbook = async (req, res) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({
        message: "recipeId is required",
      });
    }

    const cookbook = await cookBookModel.findById(req.params.id);

    if (!cookbook) {
      return res.status(404).json({ message: "Cookbook not found" });
    }

    // ✅ CRITICAL FIX (must be before .some)
    cookbook.recipes = cookbook.recipes || [];

    const alreadyExists = cookbook.recipes.some(
      (r) => r.toString() === recipeId,
    );

    if (!alreadyExists) {
      cookbook.recipes.push(recipeId);
      await cookbook.save();
    }

    return res.status(200).json({
      message: alreadyExists
        ? "Recipe already exists in cookbook"
        : "Recipe added successfully",
      cookbook,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// remove recipe
export const removeRecipeFromCookbook = async (req, res) => {
  try {
    const { recipeId } = req.body;

    const cookbook = await cookBookModel.findById(req.params.id);

    cookbook.recipes = cookbook.recipes.filter(
      (r) => r.toString() !== recipeId,
    );

    await cookbook.save();

    return res.status(200).json({
      cookbook,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
