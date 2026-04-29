import { useState } from "react";
import API from "../api/axios";
import { FiUpload } from "react-icons/fi";

const CreateRecipe = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    cookingTime: "",
    ingredients: "",
    instructions: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      const ingredientsArray = form.ingredients
        .split(",")
        .map((item) => ({
          name: item.trim(),
          quantity: 1,
          unit: "",
        }));

      const instructionsArray = form.instructions
        .split(",")
        .map((step) => step.trim());

      const tagsArray = form.tags
        .split(",")
        .map((tag) => tag.trim());

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("cookingTime", form.cookingTime);
      formData.append("ingredients", JSON.stringify(ingredientsArray));
      formData.append("instructions", JSON.stringify(instructionsArray));
      formData.append("tags", JSON.stringify(tagsArray));
      formData.append("image", image);

      await API.post("/api/recipes", formData);

      alert("✅ Recipe created!");

      setForm({
        title: "",
        description: "",
        cookingTime: "",
        ingredients: "",
        instructions: "",
        tags: "",
      });
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.log(error);
      alert("❌ Error creating recipe");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Recipe 🍳
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Share your delicious creation with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Recipe Image
            </label>

            <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-orange-50 transition">
              <input
                type="file"
                className="hidden"
                id="imageUpload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />

              <label htmlFor="imageUpload" className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <FiUpload className="text-2xl mb-2 text-orange-500" />
                    <p>Click to upload image</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Recipe Title"
              value={form.title}
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Cooking Time (mins)"
              value={form.cookingTime}
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              onChange={(e) =>
                setForm({ ...form, cookingTime: e.target.value })
              }
            />

          </div>

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={form.description}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* INGREDIENTS */}
          <textarea
            placeholder="Ingredients (comma separated)"
            value={form.ingredients}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) =>
              setForm({ ...form, ingredients: e.target.value })
            }
          />

          {/* INSTRUCTIONS */}
          <textarea
            placeholder="Instructions (comma separated)"
            value={form.instructions}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) =>
              setForm({ ...form, instructions: e.target.value })
            }
          />

          {/* TAGS */}
          <input
            type="text"
            placeholder="Tags (veg, dinner, spicy...)"
            value={form.tags}
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) =>
              setForm({ ...form, tags: e.target.value })
            }
          />

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-3 rounded-full font-semibold hover:scale-[1.02] active:scale-95 transition shadow-md"
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;