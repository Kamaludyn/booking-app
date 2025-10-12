const jwt = require("../lib/jwt");

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      // Verify the token and decode the payload
      const decoded = jwt.verifyToken(token);

      // Attach decoded user info to the request object
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = optionalAuth;
