import { Publisher, Subjects, TicketUpdatedEvent } from "@iqtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
