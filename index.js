import express from "express"
import user from "./routes/user.js"
import car from "./routes/car.js"
import admin from "./routes/admin.js"
import cors from "cors"
import mongoose from "mongoose"
import config from "config"
import { Server } from "socket.io"
import dotenv from "dotenv"
import http from "http"
import CarsController from "./controllers/car.js"
import coupon from "./routes/coupon.js"
import payment from "./routes/payment.js"
dotenv.config()

const HOST = process.env.HOST || config.get("server.host")
const PORT = process.env.PORT || config.get("server.port")
const MONGO_URL = process.env.MONGODB || config.get("mongo.url")
const SOCKET_PORT = process.env.SOCKET || config.get("socket.port")

const app = express()
app.use(cors())
app.use(express.json())

var count = 0

app.get("/", (req, res) => {
	++count
	res.status(200).json({ message: `Hello from server [ count: ${count} ]` })
})

app.use("/user", user)
app.use("/car", car)
app.use("/admin", admin)
app.use("/coupon", coupon)
app.use("/payment", payment)

// ------------------------ socket --------------------------

let cache = new Map()
let carController = new CarsController()

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "*",
	},
})

io.on("connection", function (socket) {
	console.log(socket.id + ' : connection')
	socket.on("connected", (car_id) => {
		socket.join(car_id)
		cache.set(socket.id, car_id)
	})
	socket.on("change", (car_id, lat, lng) => {
		// carController.setCarLocation({
		// 	car_id: car_id,
		// 	latitude: lat,
		// 	longitude: lng
		// })
		socket.to(car_id).emit("loction", {
			latitude: lat,
			longitude: lng
		})
	})
	socket.on("disconnect", function () {
		socket.leave(cache.get(socket.id))
		cache.delete(socket.id)
		console.log(socket.id + " : disconnected")
	})
})

mongoose
	.connect(MONGO_URL)
	.then(() => {
		console.log("DB Connected")
		app.listen(PORT, () => console.log(`open http://${HOST}:${PORT}`))
		server.listen(SOCKET_PORT, () => console.log(`socket http://${HOST}:${SOCKET_PORT}`))
	})
	.catch(() => console.log("db NOT connected"))
