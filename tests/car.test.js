import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import car from "../routes/car.js";
import user from "../routes/user.js";

const app = new express();
app.use("/car", car);
app.use("/user", user);

const email = "sandyblaze911@gmail.com";
const passwd = "sandyblaze";
const car_no = "TS12PQ5912";

let jwt;

describe("TESTS CAR", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://batch6:herovired@cluster0.aqifkg2.mongodb.net/DarwinBox2"
    );
    console.log("TEST DB CARS");
    console.log("TEST DB");
    const response = await request(app)
      .post("/user/login")
      .send({ email: email, passwd: passwd });
    jwt = response.body.jwt;
  });

  test("POST /car/view", async () => {
    const response = await request(app)
      .post("/car/view")
      .set("token", jwt)
      .send({ car_no: car_no });
    expect(response.statusCode).toEqual(200);
  });

  test("POST /car/location/:idplate", async () => {
    const response = await request(app)
      .get(`/car/location/${car_no}`)
      .set("token", jwt);
    expect(response.statusCode).toEqual(200);
  });

  test("POST /car/addcar", async () => {
    const car = {
      car_no: "TS12PQ5912",
      seater_type: 2,
      price_per_day: 950,
      price_per_hour: 150,
      company: "BMW",
      model: "X5",
      manifactured_year: 2019,
      driven_distance: 10000,
      owner: "ObjectId:('6423df49aca597446c34d495')",
    };
    const response = await request(app)
      .post("/car/addcar")
      .set("token", jwt)
      .send(car);
    expect(response.statusCode).toEqual(200);
  });

  test("POST /car/setlocation", async () => {
    const location = {
      car_no: "TS12PQ5912",
      latitude: 17.385044,
      longitude: 78.486671,
    };
    const response = await request(app)
      .post("/car/setlocation")
      .set("token", jwt)
      .send(location);
    expect(response.statusCode).toEqual(200);
  });
});
