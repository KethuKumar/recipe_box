import { useEffect, useState } from "react";
import API from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiClock, FiStar } from "react-icons/fi";
import { setUser } from "../features/auth/authSlice";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  // ✅ fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/recipes${location.search}`);
        setRecipes(res.data.recipes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [location.search]);

  // ✅ check following
  const isFollowing = (authorId) => {
    return user?.following?.includes(authorId);
  };

  // ✅ follow / unfollow handler
  const handleFollow = async (e, authorId) => {
    e.stopPropagation();

    try {
      if (isFollowing(authorId)) {
        await API.post(`/api/users/unfollow/${authorId}`);

        // update redux user manually
        const updatedUser = {
          ...user,
          following: user.following.filter((id) => id !== authorId),
        };

        dispatch(setUser(updatedUser));
      } else {
        await API.post(`/api/users/follow/${authorId}`);

        const updatedUser = {
          ...user,
          following: [...(user.following || []), authorId],
        };

        dispatch(setUser(updatedUser));
      }
    } catch (err) {
      console.log(err);
    }
  };

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

      {/* EMPTY */}
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
                  alt={recipe.title}
                  className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>

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

                {/* AUTHOR */}
                <p className="text-xs text-gray-500 mt-1">
                  by {recipe.author?.username || "Unknown"}
                </p>

                <div className="flex justify-between items-center mt-2">

                  {/* RATING */}
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <FiStar />
                    {recipe.averageRating
                      ? recipe.averageRating.toFixed(1)
                      : "0.0"}
                  </div>

                  <span className="text-xs text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition">
                    View →
                  </span>
                </div>

                {/* FOLLOW BUTTON */}
                {user && recipe.author?._id !== user._id && (
                  <button
                    onClick={(e) =>
                      handleFollow(e, recipe.author._id)
                    }
                    className={`mt-3 w-full py-1 rounded-full text-sm transition ${
                      isFollowing(recipe.author._id)
                        ? "bg-gray-300 text-gray-700"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {isFollowing(recipe.author._id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Home;
