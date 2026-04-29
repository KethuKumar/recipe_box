import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiClock, FiStar } from "react-icons/fi";

const Profile = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // ✅ fetch user's recipes
  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/recipes/get-my-recipes");
        setRecipes(res.data.recipes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 px-4 md:px-8 py-8">

  {/* 🔥 HEADER CARD */}
  <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8">

    <div className="flex flex-col md:flex-row justify-between items-center gap-6">

      {/* USER INFO */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800">
          {user?.username || "User"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {user?.email}
        </p>
      </div>

      {/* 🔥 ACTION BUTTONS */}
      <div className="flex gap-3 flex-wrap justify-center">

        <button
          onClick={() => navigate("/create")}
          className="px-5 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
        >
          + Create Recipe
        </button>

        <button
          onClick={() => navigate("/meal-planner")}
          className="px-5 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-50 transition"
        >
          📅 Planner
        </button>

      </div>

    </div>

    {/* 📊 STATS */}
    <div className="flex justify-center md:justify-start gap-8 mt-6 text-center">
      <div>
        <p className="text-xl font-bold text-gray-800">
          {recipes.length}
        </p>
        <p className="text-sm text-gray-500">Recipes</p>
      </div>

      <div>
        <p className="text-xl font-bold text-gray-800">
          {recipes.reduce((acc, r) => acc + (r.averageRating || 0), 0).toFixed(1)}
        </p>
        <p className="text-sm text-gray-500">Total Rating</p>
      </div>
    </div>

  </div>

  {/* LOADING */}
  {loading && (
    <div className="flex justify-center mt-10">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}

  {/* EMPTY */}
  {!loading && recipes.length === 0 && (
    <div className="text-center mt-20">
      <p className="text-gray-500">
        You haven’t posted any recipes yet 😢
      </p>

      <button
        onClick={() => navigate("/create")}
        className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-full"
      >
        Create your first recipe
      </button>
    </div>
  )}

  {/* 🔥 RECIPES GRID */}
  <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

    {recipes.map((recipe) => (
      <div
        key={recipe._id}
        onClick={() => navigate(`/recipes/${recipe._id}`)}
        className="group cursor-pointer"
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300">

          {/* IMAGE */}
          <div className="relative overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-black/10"></div>

            <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow">
              <FiClock className="text-orange-500" />
              {recipe.cookingTime} min
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4">
            <h2 className="font-semibold text-lg line-clamp-1">
              {recipe.title}
            </h2>

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <FiStar />
                {recipe.averageRating
                  ? recipe.averageRating.toFixed(1)
                  : "0.0"}
              </div>

              <span className="text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition">
                View →
              </span>
            </div>
          </div>

        </div>
      </div>
    ))}

  </div>
</div>
  );
};

export default Profile;