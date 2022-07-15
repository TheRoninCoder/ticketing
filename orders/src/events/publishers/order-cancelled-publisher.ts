import { Publisher, OrderCancelledEvent, Subjects } from "@iqtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
