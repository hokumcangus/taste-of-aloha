const windows = new Map();

function rateLimit({ max = 60, windowMs = 60000, keyFn } = {}) {
  return (req, res, next) => {
    // Skip rate limiting in test environment so the test suite can make
    // repeated rapid requests without hitting 429 responses.
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    const key =
      (typeof keyFn === "function" && keyFn(req)) ||
      req.ip ||
      req.headers["x-forwarded-for"] ||
      "unknown";
    const now = Date.now();
    const current = windows.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > current.resetAt) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    windows.set(key, current);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - current.count)));

    if (current.count > max) {
      return res.status(429).json({ message: "Too many requests" });
    }

    return next();
  };
}

module.exports = { rateLimit };
