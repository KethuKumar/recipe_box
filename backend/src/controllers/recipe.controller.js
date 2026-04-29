import imagekit from "../config/imagekit.js";
import recipeModel from "../models/recipe.model.js";
import userModel from "../models/user.model.js";

export async function createRecipe(req, res) {
  try {
    let imageUrl = "";

    const parsedIngredients = req.body.ingredients
      ? JSON.parse(req.body.ingredients)
      : [];

    const parsedInstructions = req.body.instructions
      ? JSON.parse(req.body.instructions)
      : [];

    const parsedTags = req.body.tags ? JSON.parse(req.body.tags) : [];
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "recipebox",
      });
      imageUrl = result.url;
    }

    // const recipe = await recipeModel.create({
    //   ...req.body,
    //   image: imageUrl,
    //   author: req.user._id,
    // });

    const recipe = await recipeModel.create({
      title: req.body.title,
      description: req.body.description,
      cookingTime: req.body.cookingTime,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      tags: parsedTags, // ✅ NOT "tag"
      image: imageUrl,
      author: req.user._id,
    });

    return res.status(201).json({
      message: "recipe created successfully",
      recipe: recipe,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
}

export async function getAllRecipes(req, res) {
  try {
    const recipes = await recipeModel.find().populate("author", "username"); // ✅ FIX

    return res.status(200).json({
      message: "recipes fetched successfully",
      recipes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
}

// export async function getRecipes(req, res) {
//   try {
//     const { tag, time, include, exclude, search, sort } = req.query;

//     let query = {};

//     // filter by tag
//     if (tag) {
//       query.tags = tag;
//       // this works because tag is an array
//     }

//     if (time) {
//       query.cookingTime = { $lte: Number(time) };
//     }

//     if (include) {
//       const includeArray = include.split(",").map((i) => i.toLowerCase());
//       query["ingredients.name"] = { $all: includeArray };
//     }

//     if (exclude) {
//       const excludeArray = exclude.split(",");
//       query["ingredients.name"] = {
//         ...query["ingredients.name"],
//         $nin: excludeArray,
//       };
//     }

//     // text search
//     if (search) {
//       query.$or = [
//         {
//           title: { $regex: search, $options: "i" },
//         },
//         {
//           description: { $regex: search, $options: "i" },
//         },
//       ];
//     }

//     // sorting
//     let sortOption = {};

//     if (sort === "latest") {
//       sortOption = { createdAt: -1 };
//     } else if (sort === "oldest") {
//       sortOption = { createdAt: 1 };
//     }

//     const recipes = await recipeModel.find(query).sort(sortOption);

//     return res.status(200).json({
//       success: true,
//       count: recipes.length,
//       recipes,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "internal server error",
//       error: error.message,
//     });
//   }
// }

// export const getRecipes = async (req, res) => {
//   try {
//     const { search, time, tag } = req.query;

//     let query = {};

//     // 🔍 NAME SEARCH (partial match)
//     if (search) {
//       query.title = {
//         $regex: search,
//         $options: "i",
//       };
//     }

//     // ⏱ TIME FILTER
//     if (time) {
//       query.cookingTime = {
//         $lte: Number(time),
//       };
//     }

//     // 🏷 TAG FILTER (case insensitive)
//     if (tag) {
//       query.tags = {
//         $elemMatch: {
//           $regex: tag,
//           $options: "i",
//         },
//       };
//     }

//     const recipes = await recipeModel.find(query);

//     res.json({ recipes });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getRecipes = async (req, res) => {
  try {
    const { search, time, tag } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (time) {
      query.cookingTime = { $lte: Number(time) };
    }

    if (tag) {
      query.tags = {
        $elemMatch: { $regex: tag, $options: "i" },
      };
    }

    const recipes = await recipeModel
      .find(query)
      .populate("author", "username"); // ✅ FIX

    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// feed api
export async function getFeed(req, res) {
  try {
    const user = await userModel.findById(req.user._id);

    const recipes = await recipeModel
      .find({
        author: { $in: user.following },
      })
      .populate("author", "username") // ✅ IMPORTANT
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// export const rateRecipe = async (req, res) => {
//   try {
//     const { value } = req.body; // 1–5
//     const userId = req.user._id;
//     const recipeId = req.params.id;

//     const recipe = await recipeModel.findById(recipeId);

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     // check if user already rated
//     const existingRating = recipe.ratings.find(
//       (r) => r.user.toString() === userId.toString(),
//     );

//     if (existingRating) {
//       existingRating.value = value; // update rating
//     } else {
//       recipe.ratings.push({ user: userId, value });
//     }

//     await recipe.save();

//     res.json({ message: "Rating submitted", ratings: recipe.ratings });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const rateRecipe = async (req, res) => {
  try {
    const { value } = req.body;
    const recipeId = req.params.id;

    // 🔐 CHECK USER
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const recipe = await recipeModel.findById(recipeId);

    // ❗ CHECK RECIPE
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // ❗ ENSURE ratings exists
    if (!recipe.ratings) {
      recipe.ratings = [];
    }

    // check existing rating
    const existing = recipe.ratings.find(
      (r) => r.user.toString() === userId.toString(),
    );

    if (existing) {
      existing.value = value;
    } else {
      recipe.ratings.push({ user: userId, value });
    }

    // 🔥 CALCULATE AVG
    const avg =
      recipe.ratings.reduce((acc, r) => acc + r.value, 0) /
      recipe.ratings.length;

    recipe.averageRating = avg;

    await recipe.save();

    res.json({
      message: "Rating saved",
      averageRating: avg,
    });
  } catch (error) {
    console.log("RATE ERROR:", error); // 👈 IMPORTANT
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const recipeId = req.params.id;

    const recipe = await recipeModel.findById(recipeId);

    recipe.comments.push({
      user: req.user._id,
      text,
    });

    await recipe.save();

    res.json({
      message: "Comment added",
      comments: recipe.comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleRecipe = async (req, res) => {
  try {
    const recipe = await recipeModel
      .findById(req.params.id)
      .populate("author", "username email");

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      recipe,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await recipeModel.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    // auth check
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "not allowed",
      });
    }

    // parse fields
    const ingredients = req.body.ingredients
      ? JSON.parse(req.body.ingredients)
      : recipe.ingredients;

    const instructios = req.body.instructions
      ? JSON.parse(req.body.instructions)
      : recipe.instructions;

    const tags = req.body.tags ? JSON.parse(req.body.tags) : recipe.tags;

    // image updation
    let imageUrl = recipe.image;

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "recipebox",
      });
      imageUrl = result.url;
    }

    recipe.title = req.body.title || recipe.title;
    recipe.description = req.body.description || recipe.description;
    recipe.cookingTime = req.body.cookingTime || recipe.cookingTime;
    recipe.ingredients = ingredients;
    recipe.tags = tags;
    recipe.image = imageUrl;

    await recipe.save();

    return res.status(200).json({
      success: true,
      message: "Recipe updated",
      recipe,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await recipeModel.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    // auth check
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "not allowed",
      });
    }

    await recipe.delete();

    return res.status(200).json({
      success: true,
      message: "Recipe deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// export const getRecipeById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const recipe = await recipeModel
//       .findById(id)
//       .populate("author", "username email") // 👈 important
//       .populate("comments.user", "username")
//       .populate("ratings.user", "username");

//     // ❌ not found
//     if (!recipe) {
//       return res.status(404).json({
//         message: "Recipe not found",
//       });
//     }

//     // ✅ success
//     return res.status(200).json({
//       success: true,
//       recipe,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    const recipes = await recipeModel
      .find({ author: userId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      recipes,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};