const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Import routes
const authRoutes = require("./routes/auth.routes")
const studentRoutes = require("./routes/student.routes")
const driveRoutes = require("./routes/drive.routes")
const dashboardRoutes = require("./routes/dashboard.routes")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON in request body" })
  }
  next(err)
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/drives", driveRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Basic route
app.get("/", (req, res) => {
  res.send("School Vaccination Portal API is running")
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "development" ? err.toString() : undefined,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
