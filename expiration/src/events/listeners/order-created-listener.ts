import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@iqtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const expiryTime = new Date(data.expiresAt).getTime();
    const currentTime = new Date().getTime();
    const delay = expiryTime - currentTime;

    console.log("Expiry time:", expiryTime);
    console.log("Current time:", currentTime);
    console.log("Waiting this many milleseconds to process the job:", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}
