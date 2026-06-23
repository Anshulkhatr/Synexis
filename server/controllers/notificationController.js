import Notification from "../models/notificationModel.js";

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.user.id })
            .populate('sender', 'name avatar')
            .populate('post', 'content image')
            .sort({ createdAt: -1 })
            .limit(50); // Get latest 50 notifications

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.receiver.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { receiver: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const notificationController = { getNotifications, markAsRead, markAllAsRead };
export default notificationController;
