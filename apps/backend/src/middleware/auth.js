const jwt = require("jsonwebtoken");

const DEFAULT_SECRET = "taste-of-aloha-dev-secret";
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

function authenticate(optional = false) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token =
      (header.startsWith("Bearer ") ? header.slice(7) : null) ||
      req.query?.token ||
      null;

    if (!token) {
      if (optional) {
        req.user = null;
        return next();
      }
      return res.status(401).json({ message: "Missing bearer token" });
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    return next();
  };
}

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "8h" },
  );
}

module.exports = {
  authenticate,
  requireRoles,
  issueToken,
};
