import axios from "axios";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Report from "../models/reportModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const generateAndPost = async (req, res) => {

    let userId = req.user.id
    let newPost

    // Check if user exists
    const user = await User.findById(userId)

    if (!user) {
        res.status(404)
        throw new Error("User Not Found!")
    }

    // Check if user have enough credits
    if (user.credits < 1) {
        res.status(409)
        throw new Error("Not Enough Credits!")
    }

    try {
        // Get Prompt, Ratio, Style
        const { prompt, ratio, style } = req.body

        // Check if prompt is coming in body
        if (!prompt) {
            res.status(400)
            throw new Error("Kindly Provide Prompt To Generate Image!")
        }

        const FREEPIK_HEADERS = {
            'x-freepik-api-key': process.env.FREEPIK_API_KEY,
            'Content-Type': 'application/json'
        }

        const freepikPrompt = style && style !== 'Realistic' ? `${prompt}. highly detailed, ${style} style.` : prompt;
        
        let freepikRatio = "square_1_1"
        if (ratio === "16:9") freepikRatio = "widescreen_16_9"
        if (ratio === "9:16") freepikRatio = "social_story_9_16"

        const freepikPayload = {
            prompt: freepikPrompt,
            aspect_ratio: freepikRatio
        }

        // Step 1: Create the generation task
        const createResponse = await axios.post(
            'https://api.freepik.com/v1/ai/text-to-image/flux-dev',
            freepikPayload,
            { headers: FREEPIK_HEADERS }
        ).catch(err => {
            console.error("DEBUG: Freepik Create Error:", err.response?.data)
            const msg = err.response?.data?.error?.message || err.response?.data?.message || "Freepik task creation failed"
            throw new Error(msg)
        })

        const taskId = createResponse.data?.data?.task_id
        if (!taskId) {
            console.error("DEBUG: No task_id in create response:", createResponse.data)
            res.status(502)
            throw new Error("Freepik did not return a task ID")
        }
        console.log(`DEBUG: Freepik task created: ${taskId}`)

        // Step 2: Poll for completion
        let imageUrl = null
        const MAX_POLLS = 30       // max ~60 seconds
        const POLL_INTERVAL = 2000 // 2 seconds

        for (let i = 0; i < MAX_POLLS; i++) {
            // Wait before polling
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))

            const pollResponse = await axios.get(
                `https://api.freepik.com/v1/ai/text-to-image/flux-dev/${taskId}`,
                { headers: FREEPIK_HEADERS }
            ).catch(err => {
                console.error("DEBUG: Freepik Poll Error:", err.response?.data)
                throw new Error("Failed to poll Freepik task status")
            })

            const taskData = pollResponse.data?.data
            const status = taskData?.status
            console.log(`DEBUG: Poll #${i + 1} - Status: ${status}`)

            if (status === 'COMPLETED') {
                const generated = taskData?.generated
                if (!generated || generated.length === 0) {
                    res.status(502)
                    throw new Error("Freepik task completed but no images were generated")
                }
                // generated[] is an array of image URLs
                imageUrl = generated[0]
                break
            } else if (status === 'FAILED' || status === 'ERROR') {
                res.status(502)
                throw new Error(`Freepik generation failed with status: ${status}`)
            }
            // Otherwise, status is CREATED/IN_PROGRESS, keep polling
        }

        if (!imageUrl) {
            res.status(504)
            throw new Error("Freepik image generation timed out. Please try again.")
        }

        console.log("DEBUG: Image URL from Freepik:", imageUrl)

        // Step 3: Download image and upload to Cloudinary
        const imageResponseStream = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(imageResponseStream.data)

        // Save locally
        const filename = crypto.randomUUID() + ".png"
        const folderPath = path.join(__dirname, "../generated-content")
        const filePath = path.join(folderPath, filename)

        // Create directory if not exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }

        // Write file into server
        fs.writeFileSync(filePath, buffer)

        // Upload to cloudinary
        const imageLink = await uploadToCloudinary(filePath)

        // Remove Image From Server (safe cleanup)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        // Create Post
        newPost = new Post({
            user: userId,
            imageLink: imageLink.secure_url,
            prompt: prompt
        })

        // Save Post To DB
        await newPost.save()
        // Aggregate User Details In newPost Object
        await newPost.populate('user')

        // Update Credits
        await User.findByIdAndUpdate(user._id, { credits: user.credits - 1 }, { new: true })

        res.status(201).json(newPost)

    } catch (error) {
        console.error("POST GENERATION ERROR:", error.message)
        if (!res.statusCode || res.statusCode === 200) res.status(500)
        throw new Error(error.message || "Post Not Created!")
    }

}


const getPosts = async (req, res) => {
    const posts = await Post.find().populate('user')

    if (!posts) {
        res.status(404)
        throw new Error("Posts Not Found!")
    }

    res.status(200).json(posts)

}

const getPost = async (req, res) => {
    const post = await Post.findById(req.params.pid).populate('user')

    if (!post) {
        res.status(404)
        throw new Error("Post Not Found!")
    }

    res.status(200).json(post)

}


const likeAndUnlikePost = async (req, res) => {

    let currentUser = await User.findById(req.user._id)

    // Check if user exists
    if (!currentUser) {
        res.status(404)
        throw new Error('User Not Found!')
    }

    // Check if posts exist
    const post = await Post.findById(req.params.pid).populate('user')

    if (!post) {
        res.status(404)
        throw new Error("Post Not Found!")
    }

    // Check if already liked
    if (post.likes.includes(currentUser._id)) {
        // Dislike
        // Remove Follower from likes
        let updatedLikesList = post.likes.filter(like => like.toString() !== currentUser._id.toString())
        post.likes = updatedLikesList
        await post.save()
    } else {
        // Like
        // Add Follower in Liked
        post.likes.push(currentUser._id)
        await post.save()
    }

    // Populate after save using the Post model directly
    // await Post.populate(post, { path: 'likes' })

    res.status(200).json(post)


}


const reportPost = async (req, res) => {

    const { text } = req.body
    const postId = req.params.pid
    const userId = req.user._id

    if (!text) {
        res.status(409)
        throw new Error("Please Enter Text")
    }

    const newReport = new Report({
        user: userId,
        post: postId,
        text: text
    })

    await newReport.save()
    await newReport.populate('user')
    await newReport.populate('post')

    if (!newReport) {
        res.status(409)
        throw new Error("Unable To Report This Post")
    }

    res.status(201).json(newReport)

}








const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.pid)

    if (!post) {
        res.status(404)
        throw new Error("Post Not Found!")
    }

    // Check if user is the owner
    if (post.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error("User Not Authorized to delete this post")
    }

    await Post.findByIdAndDelete(req.params.pid)

    res.status(200).json({ id: req.params.pid, message: "Post Deleted Successfully" })
}

const postController = { generateAndPost, getPosts, getPost, likeAndUnlikePost, reportPost, deletePost }




export default postController





