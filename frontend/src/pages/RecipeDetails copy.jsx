import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const RecipeDetails = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH
  const fetchRecipe = async () => {
    try {
      const res = await API.get(`/api/recipes/${id}`);
      setRecipe(res.data.recipe);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  // ⭐ CALCULATE AVG
  const getAverageRating = () => {
    if (!recipe?.ratings?.length) return 0;

    const total = recipe.ratings.reduce(
      (acc, r) => acc + r.value,
      0
    );

    return (total / recipe.ratings.length).toFixed(1);
  };

  // ⭐ RATE
  const handleRate = async (value) => {
    try {
      await API.post(`/recipes/${id}/rate`, { value });
      fetchRecipe(); // refresh UI
    } catch (err) {
      console.log(err);
    }
  };

  // 💬 COMMENT
  const handleComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);

    try {
      await API.post(`/recipes/${id}/comment`, {
        text: comment,
      });

      setComment("");
      fetchRecipe();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  if (!recipe) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl w-full">

        {/* IMAGE */}
        <img
          src={recipe.image}
          alt=""
          className="w-full h-64 object-cover rounded-xl"
        />

        {/* ⭐ AVG RATING */}
        <div className="mt-3 text-yellow-500 text-lg font-semibold">
          ⭐ {getAverageRating()} / 5
          <span className="text-gray-500 text-sm ml-2">
            ({recipe.ratings.length} reviews)
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mt-3">
          {recipe.title}
        </h1>

        {/* DESC */}
        <p className="text-gray-600 mt-2">
          {recipe.description}
        </p>

        {/* TIME */}
        <p className="text-sm text-gray-500 mt-2">
          ⏱ {recipe.cookingTime} mins
        </p>

        {/* ⭐ RATE INPUT */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Rate this recipe:
          </h3>

          <div className="flex gap-2 text-2xl">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => handleRate(num)}
                className="cursor-pointer hover:scale-125 transition"
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        {/* 🍗 INGREDIENTS */}
        <h3 className="mt-6 font-semibold">Ingredients</h3>
        <ul className="list-disc ml-5">
          {recipe.ingredients.map((i) => (
            <li key={i._id}>
              {i.name} - {i.quantity} {i.unit}
            </li>
          ))}
        </ul>

        {/* 📋 INSTRUCTIONS */}
        <h3 className="mt-6 font-semibold">Instructions</h3>
        <ol className="list-decimal ml-5">
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>

        {/* 💬 COMMENT INPUT */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Add Comment
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              placeholder="Write a comment..."
              className="flex-1 border p-2 rounded"
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={handleComment}
              className="bg-blue-500 text-white px-4 rounded"
            >
              {loading ? "..." : "Post"}
            </button>
          </div>
        </div>

        {/* 💬 COMMENTS LIST */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Comments
          </h3>

          {recipe.comments.length === 0 && (
            <p className="text-gray-500 text-sm">
              No comments yet
            </p>
          )}

          {recipe.comments.map((c) => (
            <div
              key={c._id}
              className="border-b py-2 text-sm"
            >
              💬 {c.text}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RecipeDetails;