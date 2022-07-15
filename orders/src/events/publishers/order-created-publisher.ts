import { Publisher, OrderCreatedEvent, Subjects } from "@iqtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
