const { rateLimit: _rateLimit } = require("express-rate-limit");

/**
 * Returns an express-rate-limit middleware with sensible defaults.
 * Rate limiting is automatically skipped when NODE_ENV === "test".
 *
 * @param {{ max?: number, windowMs?: number }} options
 */
function rateLimit({ max = 60, windowMs = 60_000 } = {}) {
  return _rateLimit({
    max,
    windowMs,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    message: { message: "Too many requests" },
  });
}

module.exports = { rateLimit };
