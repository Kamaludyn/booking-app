const Vendor = require("../../vendor/vendor.model");

const getStripeInstance = (vendorId) => {
  const vendor = Vendor.findOne({ userId: vendorId });

  if (!vendor) {
    const error = new Error("Vendor not found");
    error.statusCode = 404;
    throw error;
  }

  let secretKey;

  if (vendor.stripe.mode === "live" && vendor.stripe.liveEnabled) {
    // Use live key from env
    secretKey = process.env.STRIPE_LIVE_SECRET_KEY;
  } else {
    // Use vendor's test key
    secretKey =
      vendor.stripe.test?.secretKey || process.env.STRIPE_TEST_SECRET_KEY;
  }

  return require("stripe")(secretKey);
};

const getWebHookSecret = async (vendorId) => {
  // Fetch vendor info to determine which Stripe key + webhook secret to use
  const vendor = await Vendor.findOne({ userId: vendorId }).lean();
  if (!vendor) {
    console.error("Vendor not found");
    throw new Error("Vendor not found");
  }

  // Determine which webhook secret to use
  const stripeMode = vendor.stripe.mode;
  const liveEnabled = vendor.stripe.liveEnabled;
  const webhookSecret =
    stripeMode === "live" && liveEnabled
      ? process.env.STRIPE_LIVE_WEBHOOK_SECRET
      : process.env.STRIPE_TEST_WEBHOOK_SECRET;
  return webhookSecret;
};
module.exports = {
  getStripeInstance,
  getWebHookSecret,
};
