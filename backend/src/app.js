import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import authRuouter from "./routes/auth.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import userRouter from "./routes/user.routes.js";
import cookbookRoutes from "./routes/cookbook.routes.js";
import mealPlanRoutes from "./routes/mealPlan.routes.js";
import morgan from "morgan";

const app = express();
const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || "").split(","),
];

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://recipe-box-olive.vercel.app",
  ...configuredOrigins,
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
// app.use(cookieParser());

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
