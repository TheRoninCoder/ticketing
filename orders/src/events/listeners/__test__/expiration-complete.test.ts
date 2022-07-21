import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@iqtickets/common";
import { ExpirationCompleteListener } from "../../listeners/expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/orders";

const setup = async () => {
  // Create a listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 10,
  });
  await ticket.save();

  // Creat an order for the above ticket
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "sdsds",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Expiration complete Event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

// TESTS

it("Updates the order status to cancelled", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits an OrderCancelled Event", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // [0][1] is traversing the JSON object to get orderId value
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("Acknowledge the message", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
