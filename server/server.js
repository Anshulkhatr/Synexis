import path from "path"
import { fileURLToPath } from "url"
import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"

// Local Imports
import errorHandler from "./middleware/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import followRoutes from "./routes/followRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import savedPostsRoutes from "./routes/savedPostRoutes.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

// Health Check for Render
app.get("/health-check", (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date() })
})


// DB Connection
connectDB()

// Body Parser
app.use(express.json())
app.use(express.urlencoded())


// Serve Frontend
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// Auth Routes
app.use("/api/auth", authRoutes)

// Follow Routes
app.use("/api/user", followRoutes)

// Profile Routes
app.use("/api/profile", profileRoutes)

// Admin Routes
app.use("/api/admin", adminRoutes)

// Post Routes
app.use("/api/posts", postRoutes)

// Saved Posts
app.use("/api/saved-posts", savedPostsRoutes)

// API 404 Handler - Catch-all for undefined API routes
app.use("/api/*path", (req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route ${req.originalUrl} not found`
    })
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")))

    app.get("*path", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../", "client", "dist", "index.html"))
    })
} else {
    // Default Route for Development
    app.get("/", (req, res) => {
        res.json({
            message: "WELCOME TO SYNEXIS API..."
        })
    })
}

// Error Handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue.black)
})