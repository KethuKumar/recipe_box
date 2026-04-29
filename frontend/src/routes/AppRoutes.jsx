import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "../pages/Home";
import Login from "../pages/Login";
import CreateRecipe from "../pages/CreateRecipe";
import RecipeDetails from "../pages/RecipeDetails";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import Cookbooks from "../pages/Cookbooks";
import CookbookDetails from "../pages/cookbookDetails";
import MealPlanner from "../pages/Mealplanner";

// 🔐 Protected Route
const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cookbooks" element={<Cookbooks />} />
      <Route path="/cookbooks/:id" element={<CookbookDetails />} />
      <Route path="/meal-planner" element={<MealPlanner />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/create"
        element={
          <PrivateRoute>
            <CreateRecipe />
          </PrivateRoute>
        }
      />

      <Route path="/recipes/:id" element={<RecipeDetails />} />
    </Routes>
  );
};

export default AppRoutes;
