import express from "express";
import protect from "../middleware/authMiddleware.js";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

router.route("/").get(protect.forUser, notificationController.getNotifications);
router.route("/mark-all-read").put(protect.forUser, notificationController.markAllAsRead);
router.route("/:id/read").put(protect.forUser, notificationController.markAsRead);

export default router;
