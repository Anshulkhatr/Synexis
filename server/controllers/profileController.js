import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import Saved from "../models/savedPostModel.js"
import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js"
import fs from "node:fs"

const getMyFollowers = async (req, res) => {

    const user = await User.findById(req.user.id).populate('followers')

    if (!user) {
        res.status(404)
        throw new Error('User Not Found!')
    }

    res.status(200).json(user.followers)


}

const getProfile = async (req, res) => {

    const { name } = req.params
    const user = await User.findOne({ name: name }).populate('followers').populate('following')
    
    if (!user) {
        res.status(404)
        throw new Error('User Not Found!')
    }

    const posts = await Post.find({ user: user._id }).populate('user')
    const likedPosts = await Post.find({ likes: user._id }).populate('user')
    const savedDocs = await Saved.find({ user: user._id }).populate({
        path: 'post',
        populate: { path: 'user' }
    })

    const savedPosts = savedDocs.map(doc => doc.post).filter(post => post !== null)

    const profile = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        credits: user.credits,
        posts: posts,
        likedPosts: likedPosts,
        savedPosts: savedPosts,
        createdAt: user.createdAt
    }


    res.status(200).json(profile)


}



const getMyFollowings = async (req, res) => {
    const user = await User.findById(req.user.id).populate('following')

    if (!user) {
        res.status(404)
        throw new Error('User Not Found!')
    }

    res.status(200).json(user.following)
}

const updateAvatar = async (req, res) => {
    
    if (!req.file) {
        res.status(400)
        throw new Error("Please upload an image!")
    }

    try {
        const filePath = req.file.path
        
        // Upload to Cloudinary
        const result = await uploadToCloudinary(filePath)
        
        if (!result) {
            throw new Error("Failed to upload to Cloudinary")
        }

        // Update User in DB
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { avatar: result.secure_url }, 
            { new: true }
        )

        // Cleanup local file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            credits: user.credits,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            createdAt: user.createdAt
        })

    } catch (error) {
        // Cleanup on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        res.status(500)
        throw new Error(error.message || "Failed to update avatar")
    }
}



const profileController = { getMyFollowers, getMyFollowings, getProfile, updateAvatar }


export default profileController