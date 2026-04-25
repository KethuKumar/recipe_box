import { useEffect, useState } from "react";
import API from "../api/axios";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    include: "",
    exclude: "",
    time: "",
    tag: "",
  });

  const fetchRecipes = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/recipes?${query}`);
      setRecipes(res.data.recipes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRate = async (id, value) => {
    await API.post(`/recipes/${id}/rate`, { value });
  };

  const handleComment = async (id, text) => {
    await API.post(`/recipes/${id}/comment`, { text });
  };

  const handleFollow = async (userId) => {
    await API.post(`/users/follow/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔥 HEADER */}
      <h1 className="text-3xl font-bold text-center mb-6">
        🍗 Recipe Feed
      </h1>

      {/* 🔎 FILTER BOX */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <input
          placeholder="🔍 Search..."
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <input
          placeholder="Include (chicken,rice)"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, include: e.target.value })
          }
        />

        <input
          placeholder="Exclude (onion)"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, exclude: e.target.value })
          }
        />

        <input
          placeholder="Max Time"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, time: e.target.value })
          }
        />

        <input
          placeholder="Tag"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, tag: e.target.value })
          }
        />

        <button
          onClick={fetchRecipes}
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 transition"
        >
          Apply
        </button>
      </div>

      {/* 🍗 RECIPES GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            {/* IMAGE */}
            <img
              src={recipe.image}
              alt=""
              className="h-40 w-full object-cover"
            />

            <div className="p-4">

              {/* TITLE */}
              <h2 className="text-lg font-semibold">
                {recipe.title}
              </h2>

              {/* DESC */}
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {recipe.description}
              </p>

              {/* INFO */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>⏱ {recipe.cookingTime} mins</span>
                <span>{recipe.tags?.join(", ")}</span>
              </div>

              {/* FOLLOW */}
              <button
                onClick={() => handleFollow(recipe.author)}
                className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
              >
                Follow
              </button>

              {/* ⭐ RATING */}
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    onClick={() => handleRate(recipe._id, num)}
                    className="cursor-pointer hover:scale-125 transition"
                  >
                    ⭐
                  </span>
                ))}
              </div>

              {/* 💬 COMMENT */}
              <input
                type="text"
                placeholder="💬 Add comment..."
                className="border p-1 w-full mt-2 rounded text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(recipe._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;