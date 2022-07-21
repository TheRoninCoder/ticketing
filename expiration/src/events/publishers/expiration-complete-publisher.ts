import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@iqtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
