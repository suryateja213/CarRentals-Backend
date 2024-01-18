import express from "express"
import CarsController from "../controllers/car.js"
import verify from "../utility/verify.jwt.js"

const app = express.Router()
const carController = CarsController()
app.use(express.json())

app.route('/location/:idplate')
    .get(async (req, res) => {
        if (!verify(req.headers)) {
            res.status(400).json({ errno: 400 })
            return
        }
        res.status(200).json(await carController.getCarLocation({ car_no: req.params.idplate }))
        return
    })

app.route('/view')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            res.status(400).json({ errno: 400 })
            return
        }
        let data = req.body
        res.status(200).json(await carController.getCar(data))
    })

app.route('/addcar')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            res.status(400).json({ errno: 400 })
            return
        }
        let data = req.body
        res.status(200).json(await carController.addCar(data))
    })

app.route('/nearby')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            res.status(400).json({ errno: 400 })
            return
        }
        let data = req.body
        res.status(200).json(await carController.getNearLocation(data))
    })

app.route('/setlocation')
    .post(async (req, res) => {
        let data = req.body
        res.status(200).json(await carController.setCarLocation(data))
    })

const car = app
export default car
