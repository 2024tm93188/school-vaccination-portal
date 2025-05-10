const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (process.env.NODE_ENV === "development" && !token) {
      req.user = { id: "development-user", role: "admin" }
      return next()
    }

    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_for_development")
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