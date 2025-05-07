const jwt = require("jsonwebtoken")

// Simplified auth middleware that doesn't require database lookup
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "")

    // For development/testing, allow requests without token
    if (process.env.NODE_ENV === "development" && !token) {
      req.user = { id: "development-user", role: "admin" }
      return next()
    }

    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_for_development")

      // Add user info to request
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ message: "Token is invalid" })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Server error in auth middleware" })
  }
}

module.exports = authMiddleware
