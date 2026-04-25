import { Router } from "express";
import * as userController from "../controllers/user.controller.js"
import protect from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.post("/follow/:id",protect,userController.followUser)
userRouter.post("/unfollow/:id",protect,userController.unfollowUser)

export default userRouter