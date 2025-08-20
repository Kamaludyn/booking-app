const jwt = require("jsonwebtoken");

// Secret key used for signing tokens
const JWT_SECRET = process.env.JWT_SECRET;

// Token expiration time
const JWT_EXPIRES_IN = "3d";

// Signs a payload into a JWT token
const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT and handle expiration/invalid token errors
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw error;
    }
  }
};

module.exports = {
  signToken,
  verifyToken,
};
