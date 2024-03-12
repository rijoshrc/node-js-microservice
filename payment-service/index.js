// payment-service/app.js
const express = require("express");
const app = express();
const port = 3002;

// In-memory storage for simplicity
const payments = [
  {
    userId: 1,
    amount: 100,
  },
];

// Routes
app.get("/payments", (req, res) => {
  res.json(payments);
});

app.get("/payments/user/:userId", (req, res) => {
  const { userId } = req.params;
  const payment = payments.find((payment) => payment.userId == userId);
  res.json(payment);
});

app.post("/payments", (req, res) => {
  const newPayment = req.body;
  payments.push(newPayment);
  res.status(201).json(newPayment);
});

app.listen(port, () => {
  console.log(`Payment Service running on port ${port}`);
});
