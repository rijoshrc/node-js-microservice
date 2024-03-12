// user-service/app.js
const express = require("express");
const app = express();
const axios = require("axios");
const port = 3000;

// In-memory storage for simplicity
const users = [
  {
    id: 1,
    firstName: "Rijosh",
    lastName: "Ravi C",
  },
];

// Routes
app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const resp = await axios.get(`http://localhost:3002/payments/user/${id}`);
  const payments = resp.data;
  const user = users.find((user) => user.id == id);
  res.json({ ...user, payments });
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
