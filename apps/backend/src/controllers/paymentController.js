function createIntent(req, res) {
  const { amount, method } = req.body || {};

  const normalizedAmount = Number(amount);
  if (!normalizedAmount || normalizedAmount <= 0) {
    return res.status(400).json({ message: "A positive amount is required" });
  }

  return res.status(201).json({
    clientSecret: `mock_pi_${Date.now()}`,
    amount: Number(normalizedAmount.toFixed(2)),
    currency: "USD",
    method: method || "card",
    status: "requires_confirmation",
    provider: "mock",
  });
}

module.exports = {
  createIntent,
};
