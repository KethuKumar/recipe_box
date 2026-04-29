import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Cookbooks = () => {
  const [cookbooks, setCookbooks] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchCookbooks = async () => {
    try {
      const res = await API.get("/cookbooks");
      setCookbooks(res.data.cookbooks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCookbooks();
  }, []);

  const createCookbook = async () => {
    if (!name.trim()) return;

    try {
      await API.post("/cookbooks", { name });
      setName("");
      fetchCookbooks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 px-4 py-8">

  <div className="max-w-6xl mx-auto">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        My Cookbooks 📚
      </h1>

      <div className="flex gap-2 w-full md:w-auto">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New cookbook..."
          className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={createCookbook}
          className="bg-orange-500 text-white px-5 rounded-full hover:bg-orange-600"
        >
          Create
        </button>
      </div>
    </div>

    {/* EMPTY STATE */}
    {cookbooks.length === 0 && (
      <div className="text-center mt-20">
        <p className="text-gray-500">No cookbooks yet 😢</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first cookbook above
        </p>
      </div>
    )}

    {/* GRID */}
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

      {cookbooks.map((cb) => (
        <div
          key={cb._id}
          onClick={() => navigate(`/cookbooks/${cb._id}`)}
          className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition cursor-pointer"
        >
          <h2 className="font-semibold text-lg group-hover:text-orange-500 transition">
            {cb.name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {cb.recipes.length} recipes
          </p>

          {/* preview dots */}
          <div className="flex gap-1 mt-3">
            {Array.from({ length: Math.min(3, cb.recipes.length) }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-orange-400 rounded-full" />
            ))}
          </div>

          <div className="mt-4 text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition">
            Open →
          </div>
        </div>
      ))}

    </div>

  </div>
</div>
  );
};

export default Cookbooks;
