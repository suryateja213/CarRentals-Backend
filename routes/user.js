import express from "express";
import UserController from "../controllers/user.js";
import upload from "../modules/fileHandler.js";
import jwt from "jsonwebtoken";
import verify from "../utility/verify.jwt.js";
import dotenv from "dotenv";

dotenv.config();
const app = express.Router();
app.use(express.json());
const userController = UserController();

app.route("/login").post(async (req, res) => {
  let data = await userController.authenticate(req.body);
  if (data) {
    data = JSON.parse(JSON.stringify(data));
    let token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    delete data.passwd;
    res.status(200).json({ jwt: token, ...data });
  } else {
    res.status(200).json({ errno: 404, message: "Data not found" });
  }
});

app.route("/addCoupon").post(async (req, res) => {
  let data = await userController.addCoupon(req.body);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ errno: 404, message: "Error in adding coupon" });
  }
});

// app.route("/getCoupon").get(async (req, res) => {
//   let data = await userController.getCoupon();
//   if (data) {
//     res.status(200).json(data);
//   } else {
//     res.status(200).json({ errno: 404, message: "Coupon not found" });
//   }
// });

// app.route("/updateCoupon").post(async (req, res) => {
//   let data = await userController.updateCoupon(req.body);
//   if (data) {
//     res.status(200).json(data);
//   } else {
//     res.status(200).json({ errno: 404, message: "Error in updating coupon" });
//   }
// });

app.route("/register").post(async (req, res) => {
  let data = await userController.createUser(req.body);
  if (data["email"]) {
    res.status(200).json(data);
  } else {
    res.status(200).json({ errno: 406, message: "Error in inserting" });
  }
});

app.route("/cars").post(async (req, res) => {
  if (!verify(req.headers)) {
    res.status(400).json({ errno: 400 });
    return;
  }
  let data = await userController.getCars(req.body);
  res.status(200).json(data);
});

app.route("/bookcar").post(async (req, res) => {
  if (!verify(req.headers)) {
    res.status(400).json({ errno: 400 });
    return;
  }
  console.log("user.js 75", req.body);
  let data = await userController.bookCar(req.body);
  res.status(200).json(data);
});

app.route("/updateProfile").put(async (req, res) => {
  if (!verify(req.headers)) {
    res.status(400).json({ errno: 400 });
    return;
  }
  let data = await userController.updateProfile(req.body);
  res.status(200).json(data);
});

app.route("/profile").post(async (req, res) => {
  if (!verify(req.headers)) {
    res.status(400).json({ errno: 400 });
    return;
  }
  let data = await userController.profile(req.body);
  res.status(200).json(data);
});

app.route("/upload").post(async (req, res) => {
  if (!verify(req.headers)) {
    res.status(400).json({ errno: 400 });
    return;
  }
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.log(err);
        res.status(200).json({ errno: 400 });
      } else {
        const root =
          "D:\\CRT\\Backend\\";
        req.file.path = root + req.file.path;
        const result = await userController.updateProfile({
          email: req.body.email,
          picture: req.file.path,
        });
        res.status(200).json(req.file);
      }
    } catch (e) {
      res.status(200).json({ ...e, errno: 400 });
    }
  });
});

const user = app;
export default user;
