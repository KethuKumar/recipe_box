import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRuouter from "./routes/auth.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import userRouter from "./routes/user.routes.js";
import cookbookRoutes from "./routes/cookbook.routes.js";
import mealPlanRoutes from "./routes/mealPlan.routes.js";
import morgan from "morgan";

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "https://recipe-box-olive.vercel.app",
    credentials: true,
  }),
);
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  return res.send("server is running");
});

app.use("/api/auth", authRuouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/users", userRouter);
app.use("/api/cookbooks", cookbookRoutes);
app.use("/api/meal-plan", mealPlanRoutes);

export default app;
