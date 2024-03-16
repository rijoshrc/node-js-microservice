// payment-service/app.js
const express = require("express");
const amqplib = require("amqplib");
const app = express();
const port = 3002;

// In-memory storage for simplicity
const payments = [
  {
    userId: 1,
    amount: 100,
  },
];

// RabbitMQ connection
let channel;

// Connect to RabbitMQ
const connectToRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    channel = await connection.createChannel();
    const queue = "payment_queue";
    await channel.assertQueue(queue, { durable: false });
    console.log("Connected to RabbitMQ");

    // Start consuming messages
    channel.consume(queue, (message) => {
      const order = JSON.parse(message.content.toString());
      processPayment(order);
      channel.ack(message);
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

connectToRabbitMQ();

// Process payment
const processPayment = (order) => {
  const payment = {
    orderId: order.id,
    amount: order.total,
    status: "processed",
  };
  payments.push(payment);
  console.log("Payment processed:", payment);
};

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
