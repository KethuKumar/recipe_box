import { useEffect, useState } from "react";
import API from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FiClock, FiStar } from "react-icons/fi";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/recipes${location.search}`);
        setRecipes(res.data.recipes);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 px-4 md:px-8 py-8">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Explore Recipes 🍽️
        </h1>
        <p className="text-gray-500 mt-2">
          Discover, cook, and enjoy amazing dishes
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && recipes.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No recipes found 😢
        </p>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

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
                  className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>

                {/* TIME BADGE */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow">
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

                  {/* RATING */}
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <FiStar />
                    {recipe.averageRating?.toFixed(1) || "0.0"}
                  </div>

                  {/* CTA */}
                  <span className="text-xs text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition">
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

export default Home;