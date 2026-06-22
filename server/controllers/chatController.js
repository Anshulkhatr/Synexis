import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

const getContacts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('followers', 'name email avatar bio')
            .populate('following', 'name email avatar bio');

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Combine followers and following into unique list
        const contactsMap = new Map();
        user.followers.forEach(f => {
            if (f) contactsMap.set(f._id.toString(), f);
        });
        user.following.forEach(f => {
            if (f) contactsMap.set(f._id.toString(), f);
        });

        const contacts = Array.from(contactsMap.values());

        // Fetch last message for each contact
        const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { sender: req.user.id, receiver: contact._id },
                    { sender: contact._id, receiver: req.user.id }
                ]
            }).sort({ createdAt: -1 });

            return {
                ...contact.toObject(),
                lastMessage: lastMessage ? {
                    message: lastMessage.message,
                    sender: lastMessage.sender,
                    createdAt: lastMessage.createdAt
                } : null
            };
        }));

        res.status(200).json(contactsWithLastMessage);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

const chatController = { getContacts, getMessages };
export default chatController;
