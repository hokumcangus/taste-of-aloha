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

async function updateUserRole(req, res) {
  const allowed = ["CUSTOMER", "ADMIN"];
  const role = String(req.body?.role || "").toUpperCase();

  if (!allowed.includes(role)) {
    return res.status(400).json({ message: "Role must be CUSTOMER or ADMIN" });
  }

  try {
    const { prisma } = require("../config/database");
    const updated = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });

    return res.json({ user: updated });
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }

    return handleAuthError(res, error, "Failed to update role");
  }
}

async function guestAuth(req, res) {
  try {
    const user = await authModel.findOrCreateGuest(req.body?.phone);
    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    return handleAuthError(res, error, "Failed to continue as guest");
  }
}

module.exports = {
  register,
  login,
  me,
  guestAuth,
  updateUserRole,
};
