import express from "express"
import verify from "../utility/verify.jwt.js"
import CouponController from "../controllers/coupon.js"

const app = express.Router()
app.use(express.json())
const couponController = CouponController()

app.route('/apply')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            res.status(400).json({ errno: 400 })
            return
        }
        res.status(200).json(await couponController.findCoupon(req.body))
    })

const coupon = app
export default coupon
