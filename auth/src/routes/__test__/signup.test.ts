import request from "supertest";
import { app } from "../../app";

it("Returns a 201 on successful signup", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@ik.com",
      password: "pass1234",
    })
    .expect(201);
});

it("Returns a 400 with an invalid email", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@",
      password: "pass1234",
    })
    .expect(400);
});

it("Returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@",
      password: "1",
    })
    .expect(400);
});

it("Returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@ik.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "1retteet",
    })
    .expect(400);
});

it("Disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@ik.com",
      password: "12345",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@ik.com",
      password: "12345",
    })
    .expect(400);
});

it("Sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@ik.com",
      password: "12345",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
