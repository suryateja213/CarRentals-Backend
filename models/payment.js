import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-z0-9\.]{2,50}@gmail.com$/.test(v)
            },
        },
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    payment_id: {
        type: String,
        required: true,
    },
    order_id: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['success', 'failed'],
    },
    time_stamp: {
        type: Date,
        default: Date,
    },
})

paymentSchema.index({ payment_id: 1 }, { unique: true })
paymentSchema.index({ email: 1, time_stamp: -1 }, { unique: true })

export default mongoose.model('ARSPayment', paymentSchema)