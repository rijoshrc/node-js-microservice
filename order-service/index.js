// order-service/app.js
const express = require("express");
const redis = require("redis");
// const amqplib = require("amqplib");
const app = express();
const port = 3001;

// In-memory storage for simplicity
const orders = [];

// RabbitMQ connection
// let channel;

// Connect to RabbitMQ
// const connectToRabbitMQ = async () => {
//   try {
//     const connection = await amqplib.connect("amqp://localhost");
//     channel = await connection.createChannel();
//     const queue = "payment_queue";
//     await channel.assertQueue(queue, { durable: false });
//     console.log("Connected to RabbitMQ");
//   } catch (error) {
//     console.error("Error connecting to RabbitMQ:", error);
//   }
// };

// connectToRabbitMQ();

// Routes
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);

  // Send message to RabbitMQ
  if (channel) {
    const queue = "payment_queue";
    const message = JSON.stringify(newOrder);
    channel.sendToQueue(queue, Buffer.from(message));
    console.log("Message sent to RabbitMQ:", message);
  }

  res.status(201).json(newOrder);
});

app.listen(port, () => {
  console.log(`Order Service running on port ${port}`);
});

const channel = "message_queue";
const subscriber = redis.createClient();
subscriber.subscribe(channel);
console.log("Waiting for messages...");
subscriber.on("message", (channel, message) => {
  console.log(`Received: ${message}`);
});
