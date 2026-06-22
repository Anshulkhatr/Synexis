import express from "express";
import protect from "../middleware/authMiddleware.js";
import chatController from "../controllers/chatController.js";

const router = express.Router();

router.get("/contacts", protect.forUser, chatController.getContacts);
router.get("/messages/:otherUserId", protect.forUser, chatController.getMessages);

export default router;
