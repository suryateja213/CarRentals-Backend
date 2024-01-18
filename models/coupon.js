import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
    coupon_code: {
        type: String,
        required: true,
    },
    coupon_name: {
        type: String,
        required: true,
    },
    discount: {
        type: {
            name: {
                type: String,
                required: true,
                enum: ['amount', 'percentage']
            },
            value: {
                type: Number,
                required: true,
            }
        },
    },
})

couponSchema.index({ coupon_code: 1 }, { unique: true })

export default mongoose.model("ARSCoupon", couponSchema)
