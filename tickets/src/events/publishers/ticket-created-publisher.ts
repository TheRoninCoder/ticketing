import { Publisher, Subjects, TicketCreatedEvent } from "@iqtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
