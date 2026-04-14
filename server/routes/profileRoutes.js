import express from "express"
import protect from "../middleware/authMiddleware.js"
import profileController from "../controllers/profileController.js"
import upload from "../middleware/uploadMiddleware.js"


const router = express.Router()


router.get("/:name", profileController.getProfile)
router.get("/followers", protect.forUser, profileController.getMyFollowers)
router.get("/followings", protect.forUser, profileController.getMyFollowings)
router.patch("/avatar", protect.forUser, upload.single('avatar'), profileController.updateAvatar)

export default router