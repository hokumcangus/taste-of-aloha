const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");
const { JWT_SECRET } = require("../middleware/authMiddleware");

function buildAuthResponse(user) {
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user,
  };
}

function handleAuthError(res, error, fallbackMessage) {
  if (error?.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: fallbackMessage });
}

async function register(req, res) {
  try {
    const user = await authModel.createUser(req.body || {});
    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    return handleAuthError(res, error, "Failed to register");
  }
}

async function login(req, res) {
  try {
    const user = await authModel.verifyUser(req.body || {});
    return res.json(buildAuthResponse(user));
  } catch (error) {
    return handleAuthError(res, error, "Failed to login");
  }
}

async function me(req, res) {
  try {
    const user = await authModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return handleAuthError(res, error, "Failed to fetch profile");
  }
}

module.exports = {
  register,
  login,
  me,
};
