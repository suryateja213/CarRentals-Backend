import mongoose, { Schema } from "mongoose"
import ARSCar from './car.js'
import ARSUser from './user.js'

const bookingSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: ARSUser,
        required: true,
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: ARSCar,
        required: true,
    }, 
    from_date: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v)
            }
        },
    },
    from_time: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{2}:\d{2}$/.test(v)
            }
        },
    },
    to_date: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v)
            }
        },
    },
    to_time: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{2}:\d{2}$/.test(v)
            }
        },
    },
})

export default mongoose.model("ARSBooking", bookingSchema)