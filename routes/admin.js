import express from "express"
import jwt from "jsonwebtoken"
import verify from "../utility/verify.jwt.js"
import AdminController from "../controllers/admin.js"

const app = express.Router()
app.use(express.json())
const adminController = AdminController()

app.route('/login')
    .post(async (req, res) => {
        let data = await adminController.login(req.body)
        if (data) {
            data = JSON.parse(JSON.stringify(data))
            data.isAdmin = true
            let token = jwt.sign(data, process.env.JWT_SECRET, {
                expiresIn: "365d",
            })
            res.status(200).json({ jwt: token, email: data.email, _id: data._id })
        } else {
            res.status(200).json({ errno: 404, message: "Data not found" })
        }
    })

// app.route('/register')
//     .post(async (req, res) => {
//         res.status(200).json(await adminController.createAdmin(req.body))
//     })

app.route('/isAdmin')
    .post(async (req, res) => {
        let _v = verify(req.headers)
        if (!_v || _v.isAdmin == undefined) {
            res.status(400).json({ status: false })
            return
        }
        res.status(200).json({ status: true })
    })

app.route('/add-coupon')
    .post(async (req, res) => {
        let _v = verify(req.headers)
        if (!_v || _v.isAdmin == undefined) {
            res.status(400).json({ status: false })
            return
        }
        res.status(200).json(await adminController.createCoupon(req.body))
    })

app.route('/get-all-cars')
    .post(async (req, res) => {
        let _v = verify(req.headers)
        if (!_v || _v.isAdmin == undefined) {
            res.status(400).json({ status: false })
            return
        }
        res.status(200).json(await adminController.getAllCars())
    })

app.route('/get-some-cars')
    .post(async (req, res) => {
        let _v = verify(req.headers)
        if (!_v || _v.isAdmin == undefined) {
            res.status(400).json({ status: false })
            return
        }
        res.status(200).json(await adminController.getSomeCars(req.body))
    })

app.route('/get-one-car')
    .post(async (req, res) => {
        let _v = verify(req.headers)
        if (!_v || _v.isAdmin == undefined) {
            res.status(400).json({ status: false })
            return
        }
        res.status(200).json(await adminController.getOneCar(req.body))
    })

const admin = app
export default admin
