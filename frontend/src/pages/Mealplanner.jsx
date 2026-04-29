import { useEffect, useState } from "react";
import API from "../api/axios";

const daysList = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const MealPlanner = () => {
  const [plan, setPlan] = useState({});
  const [recipes, setRecipes] = useState([]);

  // 🔥 fetch recipes
  const fetchRecipes = async () => {
    const res = await API.get("/api/recipes");
    setRecipes(res.data.recipes);
  };

  // 🔥 fetch meal plan
  const fetchPlan = async () => {
    const res = await API.get("/api/meal-plan");
    if (res.data) setPlan(res.data.days || {});
  };

  useEffect(() => {
    fetchRecipes();
    fetchPlan();
  }, []);

  // 🔥 change day recipe
  const handleChange = (day, recipeId) => {
    setPlan((prev) => ({
      ...prev,
      [day]: recipeId,
    }));
  };

  // 🔥 save plan
  const savePlan = async () => {
    try {
      await API.post("/api/meal-plan", { days: plan });
      alert("Plan saved!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 px-4 py-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Meal Planner 📅
        </h1>

        <div className="space-y-4">

          {daysList.map((day) => (
            <div
              key={day}
              className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center"
            >
              <span className="capitalize font-medium">
                {day}
              </span>

              <select
                value={plan[day] || ""}
                onChange={(e) =>
                  handleChange(day, e.target.value)
                }
                className="border rounded px-3 py-1"
              >
                <option value="">Select recipe</option>

                {recipes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          ))}

        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={savePlan}
          className="mt-6 w-full bg-orange-500 text-white py-3 rounded-full"
        >
          Save Plan
        </button>

      </div>
    </div>
  );
};

export default MealPlanner;