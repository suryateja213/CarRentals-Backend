import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import user from "../routes/user.js";

const app = new express();
app.use("/user", user);

let jwt;
const email = "sandyblaze911@gmail.com";
const passwd = "sandyblaze";

describe("TESTS USER", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://batch6:herovired@cluster0.aqifkg2.mongodb.net/DarwinBox2"
    );
    console.log("TEST DB");
    const response = await request(app)
      .post("/user/login")
      .send({ email: email, passwd: passwd });
    jwt = response.body.jwt;
    // console.log("jwt", jwt);
  });

  test("POST /user/login", async () => {
    const res = await request(app).post("/user/login").send({
      email: email,
      passwd: passwd,
    });

    expect(res.statusCode).toEqual(200);
    expect(await res.body.email).toEqual(email);
  });

  test("POST /user/register", async () => {
    const newuser = {
      name: "johnswick",
      email: "johns@gmail.com",
      passwd: "johnwick",
      phone: "1232512345",
    };
    const response = await request(app).post("/user/register").send(newuser);
    console.log(response.body);
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual(newuser.name);
    expect(response.body.email).toEqual(newuser.email);
    expect(response.body.phone).toEqual(newuser.phone);
  });

  test("POST /user/cars", async () => {
    const id = "641bdcb42ae3920b845bc23d";
    const response = await request(app)
      .post("/user/cars")
      .set("token", jwt)
      .send({ _id: id });
    expect(response.statusCode).toEqual(200);
    console.log(response.body);
    expect(response.body.host).not.toBeNull();
    expect(response.body.car_booked).not.toBeNull();
  });

  test("POST /user/bookcar", async () => {
    const car = {
      car_no: "DE25XG0002",
      email: "john@gmail.coam",
      from_date: "2023-04-14",
      from_time: "12:00",
      to_date: "2023-04-15",
      to_time: "12:00",
    };
    const response = await (await request(app).post("/user/bookcar"))
      .setEncoding("token", jwt)
      .send(car);
    expect(response.statusCode).toEqual(200);
  });

  test("POST /user/cars", async () => {
    const user = {
      email: "sandyblaze911@gmail.com",
    };
    const response = await request(app).post("/user/cars").send(user);
    expect(response.statusCode).toEqual(200);
  });

  test("POST /user/updateProfile", async () => {
    const new_phone = "0987654321";
    const response = await request(app)
      .put("/user/updateProfile")
      .set("token", jwt)
      .send({ email: email, phone: new_phone });
    expect(response.statusCode).toEqual(200);
    expect(response.body.phone).toEqual(new_phone);
  });

  test("POST /user/profile", async () => {
    const response = await request(app)
      .post("/user/profile")
      .send({ email: email });
    expect(response.statusCode).toEqual(200);
    expect(response.body).not.toBeNull();
  });

  test("POST /user/upload", async () => {
    const response = await request(app)
      .post("/user/upload")
      .send({ email: email });
    expect(response.statusCode).toEqual(400);
  });
});
