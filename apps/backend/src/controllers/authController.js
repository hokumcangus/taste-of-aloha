const bcrypt = require("bcrypt");
const { prisma } = require("../config/database");
const { issueToken } = require("../middleware/auth");

const VALID_ROLES = ["CUSTOMER", "ADMIN", "KITCHEN", "DRIVER"];

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user && process.env.ALLOW_DEV_AUTH_BOOTSTRAP === "true") {
    const role = VALID_ROLES.includes(req.body?.role)
      ? req.body.role
      : "CUSTOMER";
    const passwordHash = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: req.body?.name || normalizedEmail.split("@")[0],
        role,
        passwordHash,
      },
    });
  }

  if (!user?.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: issueToken(user),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}

function me(req, res) {
  return res.json({ user: req.user || null });
}

module.exports = {
  login,
  me,
};
