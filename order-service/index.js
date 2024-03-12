// order-service/app.js
const express = require("express");
const app = express();
const port = 3001;

// In-memory storage for simplicity
const orders = [];

// Routes
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.listen(port, () => {
  console.log(`Order Service running on port ${port}`);
});
