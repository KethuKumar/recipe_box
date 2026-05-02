import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";
import { FiClock, FiStar, FiSend } from "react-icons/fi";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [error, setError] = useState("");
  const [cookbooks, setCookbooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCookbook, setNewCookbook] = useState("");

  const fetchRecipe = async () => {
    try {
      const res = await API.get(`/api/recipes/${id}`);
      setRecipe(res.data.recipe);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCookbooks = async () => {
    const res = await API.get("/api/cookbooks");
    setCookbooks(res.data.cookbooks);
  };

  const saveToCookbook = async (cookbookId) => {
    try {
      await API.post(`/api/cookbooks/${cookbookId}/add`, {
        recipeId: recipe._id,
      });

      setShowModal(false);
      alert("Saved!");
    } catch (err) {
      console.log(err);
    }
  };

  const createCookbook = async () => {
    if (!newCookbook.trim()) return;

    try {
      await API.post("/api/cookbooks", {
        name: newCookbook,
      });

      setNewCookbook("");
      fetchCookbooks(); // refresh list
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const getAverageRating = () => {
    return Number(recipe?.averageRating || 0).toFixed(1);
  };

  const getUserRating = () => {
    if (!user || !recipe?.ratings?.length) return 0;

    return (
      recipe.ratings.find((rating) => {
        const ratingUserId =
          typeof rating.user === "string" ? rating.user : rating.user?._id;

        return ratingUserId === user._id;
      })?.value || 0
    );
  };

  const handleRate = async (value) => {
    if (!user) {
      navigate("/login", { state: { from: `/recipes/${id}` } });
      return;
    }

    setError("");
    setRatingLoading(true);
    try {
      const res = await API.post(`/api/recipes/${id}/rate`, { value });
      setRecipe(res.data.recipe);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Could not save rating");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    if (!user) {
      navigate("/login", { state: { from: `/recipes/${id}` } });
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await API.post(`/api/recipes/${id}/comment`, { text: comment });
      setComment("");
      setRecipe(res.data.recipe);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Could not post comment");
    } finally {
      setLoading(false);
    }
  };

  if (!recipe)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="bg-linear-to-br from-orange-50 via-white to-orange-100 min-h-screen">
      {/* HERO */}
      <div className="relative h-[60vh]">
        <img src={recipe.image} className="w-full h-full object-cover" />

        {/* light overlay instead of dark */}
        {/* <div className="absolute inset-0 bg-linear-to-t from-white via-white/70 to-transparent" /> */}
        <div className="absolute inset-0 from-white via-white/70 to-transparent" />

        {/* CONTENT */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-linear-to-r from-orange-400/90 to-orange-500/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {recipe.title}
            </h1>

            <div className="flex items-center gap-6 mt-2 text-sm text-white/90">
              <span className="flex items-center gap-1">
                <FiClock /> {recipe.cookingTime} min
              </span>

              <span className="flex items-center gap-1">
                <FiStar /> {getAverageRating()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-2xl shadow-xl p-6 animate-scaleIn">
            <h3 className="text-lg font-semibold mb-4">Save to Cookbook 📚</h3>

            {/* CREATE NEW */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="New cookbook..."
                className="flex-1 border rounded-full px-4 py-2 text-sm"
                value={newCookbook}
                onChange={(e) => setNewCookbook(e.target.value)}
              />

              <button
                onClick={createCookbook}
                className="bg-orange-500 text-white px-4 rounded-full text-sm"
              >
                Add
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cookbooks.map((cb) => (
                <div
                  key={cb._id}
                  onClick={() => saveToCookbook(cb._id)}
                  className="flex justify-between items-center p-3 border rounded-xl hover:bg-orange-50 cursor-pointer transition"
                >
                  <span>{cb.name}</span>
                  <span className="text-xs text-gray-400">
                    {cb.recipes.length}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* DESCRIPTION */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-orange-500">
            About this recipe
          </h2>
          <p className="text-gray-600">{recipe.description}</p>
        </div>

        <button
          onClick={() => {
            fetchCookbooks();
            setShowModal(true);
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-full"
        >
          Save 🍳
        </button>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {/* RATE */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            Rate this recipe
          </h3>

          <div className="flex gap-3 text-3xl">
            {[1, 2, 3, 4, 5].map((num) => (
              <FiStar
                key={num}
                onClick={() => handleRate(num)}
                className={`cursor-pointer transition hover:scale-110 ${
                  num <= getUserRating()
                    ? "fill-orange-400 text-orange-400"
                    : "text-gray-300 hover:text-orange-400"
                } ${ratingLoading ? "pointer-events-none opacity-60" : ""}`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Average: {getAverageRating()} from {recipe.ratings?.length || 0} ratings
          </p>
        </div>

        {/* INGREDIENTS */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-orange-500">
            Ingredients
          </h3>

          <div className="grid sm:grid-cols-2 gap-3">
            {recipe.ingredients.map((i) => (
              <div
                key={i._id}
                className="bg-white border border-gray-200 p-3 rounded-lg flex justify-between shadow-sm hover:shadow-md transition"
              >
                <span className="text-gray-800">{i.name}</span>
                <span className="text-gray-400 text-sm">
                  {i.quantity} {i.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-orange-500">
            Instructions
          </h3>

          <div className="space-y-4">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="bg-orange-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COMMENTS */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-orange-500">
            Comments
          </h3>

          {/* INPUT */}
          <div className="flex gap-2 mb-6">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write something..."
              className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              onClick={handleComment}
              className="bg-orange-500 text-white px-5 rounded-full flex items-center gap-2 hover:bg-orange-600 transition"
            >
              <FiSend />
              {loading ? "..." : "Post"}
            </button>
          </div>

          {/* LIST */}
          {recipe.comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet</p>
          ) : (
            <div className="space-y-3">
              {recipe.comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {c.user?.username || "Someone"}
                  </p>
                  <p className="text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
