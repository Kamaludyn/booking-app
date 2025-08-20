const jwt = require("../lib/jwt");

// Middleware to authenticate users based on JWT
const authenticate = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.headers.authorization;

  // Ensure token exists and is properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Extract the token part from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verifyToken(token);

    // Attach decoded user info to the request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    // Pass control to the route handler
    next();
  } catch (error) {
    // Forward errors to global error handler middleware
    next(error);
  }
};

module.exports = authenticate;
