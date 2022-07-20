import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { TicketCreatedEvent } from "@iqtickets/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // Create an insatnce of a listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("Acknowledges the message", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
