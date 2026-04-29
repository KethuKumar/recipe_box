import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";

const CookbookDetails = () => {
  const { id } = useParams();
  const [cookbook, setCookbook] = useState(null);

  const fetchCookbook = async () => {
    const res = await API.get(`/api/cookbooks/${id}`);
    setCookbook(res.data.cookbook);
  };

  const removeRecipe = async (recipeId) => {
    try {
      await API.post(`/api/cookbooks/${id}/remove`, {
        recipeId,
      });

      fetchCookbook();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCookbook();
  }, [id]);

  if (!cookbook) return <p>Loading...</p>;

  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold mb-4">{cookbook.name}</h1>

    //   <div className="grid md:grid-cols-3 gap-4">
    //     {cookbook.recipes.map((r) => (
    //       <div
    //         key={r._id}
    //         className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
    //       >
    //         <img src={r.image} className="h-40 w-full object-cover" />

    //         <div className="p-3">
    //           <h3 className="font-semibold">{r.title}</h3>

    //           <button
    //             onClick={() => removeRecipe(r._id)}
    //             className="mt-2 text-sm text-red-500 hover:underline"
    //           >
    //             Remove
    //           </button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{cookbook.name}</h1>

          <span className="text-sm text-gray-500">
            {cookbook.recipes.length} recipes
          </span>
        </div>

        {/* EMPTY STATE */}
        {cookbook.recipes.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-gray-500">No recipes yet 🍳</p>
            <p className="text-sm text-gray-400 mt-1">
              Save recipes to see them here
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cookbook.recipes.map((r) => (
            <div
              key={r._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <img
                  src={r.image}
                  className="h-44 w-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* REMOVE BTN */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!window.confirm("Remove this recipe?")) return;
                    removeRecipe(r._id);
                  }}
                  className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  Remove
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {r.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  ⏱ {r.cookingTime} mins
                </p>

                <div className="mt-3 text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition">
                  View →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CookbookDetails;
