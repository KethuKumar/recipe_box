


import express from 'express'
import protect from '../middlewares/auth.middleware.js'
import { addRecipeToCookbook, createCookbook, getCookbooks, removeRecipeFromCookbook } from '../controllers/cookBook.controller.js'

const router = express.Router()

router.post("/", protect, createCookbook)
router.get("/", protect, getCookbooks)
router.post("/:id/add", protect, addRecipeToCookbook)
router.post("/:id/remove", protect, removeRecipeFromCookbook)

export default router