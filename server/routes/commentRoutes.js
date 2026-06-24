import express from "express"
import protect from "../middleware/authMiddleware.js"
import commentController from "../controllers/commentController.js"

const router = express.Router()

router.get("/:pid", protect.forUser, commentController.getComments)
router.post("/:pid", protect.forUser, commentController.addComment)
router.delete("/:cid", protect.forUser, commentController.removeComment)

export default router
