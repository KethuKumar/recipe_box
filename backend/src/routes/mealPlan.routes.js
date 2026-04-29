

import express from 'express'
import protect from '../middlewares/auth.middleware.js'
import { getMealPlan, saveMealPlan } from '../controllers/mealPlan.controller.js'

const router = express.Router()


router.get("/", protect, getMealPlan)
router.post("/", protect, saveMealPlan)

export default router;