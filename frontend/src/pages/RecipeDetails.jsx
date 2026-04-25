import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { FiClock, FiStar, FiSend } from "react-icons/fi";

const RecipeDetails = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecipe = async () => {
    try {
      const res = await API.get(`/recipes/${id}`);
      setRecipe(res.data.recipe);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const getAverageRating = () => {
    if (!recipe?.ratings?.length) return 0;
    const total = recipe.ratings.reduce((acc, r) => acc + r.value, 0);
    return (total / recipe.ratings.length).toFixed(1);
  };

  const handleRate = async (value) => {
    try {
      await API.post(`/recipes/${id}/rate`, { value });
      fetchRecipe();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await API.post(`/recipes/${id}/comment`, { text: comment });
      setComment("");
      fetchRecipe();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
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

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* DESCRIPTION */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-orange-500">
            About this recipe
          </h2>
          <p className="text-gray-600">{recipe.description}</p>
        </div>

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
                className="cursor-pointer text-gray-300 hover:text-orange-400 transition hover:scale-110"
              />
            ))}
          </div>
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
                  💬 {c.text}
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
