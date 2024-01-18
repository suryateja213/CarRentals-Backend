import mongoose, { Schema } from "mongoose"
import ARSUser from "./user.js"

const carSchema = new mongoose.Schema({
    car_no: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[A-Z]{2}\d\d[A-Z]{2}\d\d\d\d$/.test(v)
            }
        },
    },
    car_picture: {
        type: String,
        default: "https://img.freepik.com/free-vector/sport-car-cartoon-vector-icon-illustration-transportation-object-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3953.jpg?size=338&ext=jpg",
    },
    seater_type: {
        type: Number,
        required: true,
        enum: [2, 4, 6],
    },
    price_per_day: {
        type: Number,
        required: true,
    },
    price_per_hour: {
        type: Number,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    manifactured_year: {
        type: Number,
        required: true,
        min: 1980,
        max: 2023
    },
    driven_distance: {
        type: Number,
        required: true,
    },
    trueLocation: {
        type: Boolean,
        default: false,
    },
    location: {
        type: [Number],
        validate: {
            validator: function (v) {
                return v.length == 2
            }
        },
        default: [0, 0],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: ARSUser,
        required: true,
    },
    booking: {
        type: [{
            email: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^[a-zA-Z0-9\.]{1,26}@gmail.com$/.test(v)
                    }
                }
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
        }],
        default: [],
    }
})


carSchema.index({ car_no: 1 }, { unique: true })
carSchema.index({ owner: 1, car_no: 1 }, { unique: true })
carSchema.index({ location: "2d" })


export default mongoose.model("ARSCar", carSchema)
