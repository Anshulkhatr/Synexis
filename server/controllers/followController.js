import User from "../models/userModel.js"
import Notification from "../models/notificationModel.js"

const followUserRequest = async (req, res) => {

    let targetUser = await User.findById(req.params.uid).select("-password")
    let currentUser = await User.findById(req.user._id).select("-password")


    // Check if both users exists
    if (!targetUser || !currentUser) {
        res.status(404)
        throw new Error('User Not Found!')
    }

    // Check if already followed
    if (targetUser.followers.includes(currentUser._id)) {
        res.status(409)
        throw new Error("Already Followed!")
    }

    // Add Follower 
    targetUser.followers.push(currentUser._id)
    await targetUser.save()

    // Add Following
    currentUser.following.push(targetUser._id)
    await currentUser.save()

    // Create notification
    const notification = new Notification({
        type: 'follow',
        sender: currentUser._id,
        receiver: targetUser._id,
        isRead: false
    });
    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'name avatar');

    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    
    if (io && onlineUsers) {
        const receiverSocketId = onlineUsers.get(targetUser._id.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new_notification", populatedNotification);
        }
    }

    res.status(200).json(targetUser)
}



const unfollowUserRequest = async (req, res) => {

    let targetUser = await User.findById(req.params.uid).select("-password")
    let currentUser = await User.findById(req.user._id).select("-password")


    // Check if both users exists
    if (!targetUser || !currentUser) {
        res.status(404)
        throw new Error('User Not Found!')
    }

    // Check if already unfollowed
    if (!targetUser.followers.includes(currentUser._id)) {
        res.status(409)
        throw new Error("Already Un-Followed!")
    }



    // Remove Follower 
    let updatedFollowersList = targetUser.followers.filter(follower => follower.toString() !== currentUser._id.toString())
    targetUser.followers = updatedFollowersList
    await targetUser.save()

    // Remove Following
    let updatedFollowingList = currentUser.following.filter(follower => follower.toString() !== targetUser._id.toString())
    currentUser.following = updatedFollowingList
    await currentUser.save()


    res.status(200).json(targetUser)
}



const followController = { followUserRequest, unfollowUserRequest }

export default followController