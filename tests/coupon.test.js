import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import user from "../routes/user.js";
import ARSCoupon from "../models/coupon.js";
import ARSUsedCoupon from "../models/usedCoupon.js";

const app = new express();
app.use("/user", user);

describe("TESTS COUPON", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://batch6:herovired@cluster0.aqifkg2.mongodb.net/DarwinBox2"
    );
    console.log("TEST DB Coupon");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Adding new coupon", async () => {
    const coupon = {
      coupon_code: "FLAT20",
      coupon_name: "ugadi offer",
      discount: {
        name: "percentage",
        value: 20,
      },
    };
    const new_coupon = new ARSCoupon(coupon);
    await new_coupon.save();
    expect(new_coupon.coupon_code).toEqual(coupon.coupon_code);
  });

  test("Find coupon", async () => {
    const coupon_code = "ugd1423";
    const result = await ARSCoupon.find({ coupon_code: coupon_code });
    expect(result.coupon_code).toEqual(coupon_code);
  });

  test("Apply coupon", async () => {
    const used_coupon = new ARSUsedCoupon({
      user_id: "643261a4efe836a10387522f",
      coupon_code: "qwerty",
    });
    const result = await used_coupon.save();
    expect(result.coupon_code).toEqual(used_coupon.coupon_code);
  });
});
