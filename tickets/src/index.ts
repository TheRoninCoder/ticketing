import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  // Check ENV variable JWT_KEY exists
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  //Connect to MongoDB and NATS
  try {
    await natsWrapper.connect(
      "ticketing",
      "sdsdsdfgfgfg",
      "http://nats-srv:4222"
    );

    // close down if connection is lost
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    // close down the listener if not available, signal discruption
    process.on("SIGNIT", () => natsWrapper.client.close());
    process.on("SIGNTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000......!");
  });
};

start();
