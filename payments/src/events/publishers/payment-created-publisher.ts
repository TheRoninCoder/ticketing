import { Subjects, Publisher, PaymentCreatedEvent } from "@iqtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
