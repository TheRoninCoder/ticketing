import { Ticket } from "../tickets";

it("Implements Optimitic Concurrnecy control", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to DB
  await ticket.save();

  // fetch the tikcet twice
  const firstInsance = await Ticket.findById(ticket.id);
  const secondInsance = await Ticket.findById(ticket.id);

  // Make a chaneg to each ticket (two tickets)
  firstInsance!.set({ price: 10 });
  secondInsance!.set({ price: 15 });

  // Save the first fetched ticket
  await firstInsance!.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInsance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("Increments the version number on multiple saves", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to DB
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
