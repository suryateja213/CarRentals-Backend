import mongoose, { Schema } from "mongoose"
import ARSUser from './user.js'

const usedCouponSchema = new mongoose.Schema({
    coupon_code: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: ARSUser,
        required: true,
    },
    count: {
        type: Number,
        required: true,
        default: 1,
    },
})

usedCouponSchema.index({ coupon_code: 1, user_id: 1 }, { unique: true })
usedCouponSchema.index({ user_id: 1, coupon_code: 1 }, { unique: true })

export default mongoose.model('ARSUsedCoupon', usedCouponSchema)
