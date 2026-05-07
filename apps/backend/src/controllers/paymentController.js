const orderModel = require("../models/orderModel");

function buildStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // eslint-disable-next-line global-require
  const Stripe = require("stripe");
  return new Stripe(key, { apiVersion: "2024-04-10" });
}

async function createIntent(req, res) {
  const { amount, method } = req.body || {};
  const normalizedAmount = Number(amount);

  if (!normalizedAmount || normalizedAmount <= 0) {
    return res.status(400).json({ message: "A positive amount is required" });
  }

  const stripe = buildStripe();

  if (!stripe) {
    return res.status(201).json({
      clientSecret: `mock_pi_${Date.now()}`,
      amount: Number(normalizedAmount.toFixed(2)),
      currency: "usd",
      method: method || "card",
      status: "requires_confirmation",
      provider: "mock",
    });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(normalizedAmount * 100),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { method: method || "card" },
    });

    return res.status(201).json({
      clientSecret: intent.client_secret,
      amount: normalizedAmount,
      currency: "usd",
      method: method || "card",
      status: intent.status,
      provider: "stripe",
    });
  } catch (error) {
    console.error("Stripe createIntent error:", error);
    return res.status(500).json({ message: "Failed to create payment intent" });
  }
}

async function handleWebhook(req, res) {
  const stripe = buildStripe();

  if (!stripe) {
    return res.status(200).json({ received: true, provider: "mock" });
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
    return res.status(200).json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    try {
      await orderModel.markOrderPaidByReference(intent.id);
    } catch (err) {
      console.error("Failed to update order from webhook:", err);
    }
  }

  return res.status(200).json({ received: true });
}

module.exports = {
  createIntent,
  handleWebhook,
};
