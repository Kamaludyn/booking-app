const crypto = require("crypto");

const processMockPayment = async ({ amount, currency = "NGN" }) => {
  return {
    success: true,
    transactionId: `MOCK-${crypto.randomUUID()}`,
    amount,
    currency,
    processedAt: new Date().toISOString(),
  };
};

module.exports = processMockPayment;
