import request from "supertest";
import { app } from "../../app";

it("Fails when a email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "ik3000@ik.com",
      password: "pass1234",
    })
    .expect(400);
});

it("Fails when incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "ik@ik.com",
      password: "pass1234",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "ik@ik.com",
      password: "blahblah",
    })
    .expect(400);
});

it("Responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
