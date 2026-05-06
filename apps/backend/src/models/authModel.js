const bcrypt = require("bcrypt");
const { prisma } = require("../config/database");

const SALT_ROUNDS = 10;

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

async function findById(id) {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  return sanitizeUser(user);
}

async function createUser({ email, password, name }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (String(password).length < 8) {
    const error = new Error("Password must be at least 8 characters");
    error.statusCode = 400;
    throw error;
  }

  const existing = await findByEmail(normalizedEmail);
  if (existing) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const created = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name ? String(name).trim() : null,
      passwordHash,
    },
  });

  return sanitizeUser(created);
}

async function verifyUser({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await findByEmail(normalizedEmail);
  if (!user || !user.passwordHash) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return sanitizeUser(user);
}

module.exports = {
  createUser,
  verifyUser,
  findById,
};
