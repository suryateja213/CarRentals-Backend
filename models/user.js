import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9\.]{1,26}@gmail.com$/.test(v)
            }
        }
    },
    passwd: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 8
            }
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v)
            },
        },
    },
    picture: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJh9ssaOwvRNDkIxFS3pYeZiTvRtmGqQrwA4jYF2H4&s"
    },
    host: {
        type: [{
            _id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            car_no: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^[A-Z]{2}\d\d[A-Z]{2}\d\d\d\d$/.test(v)
                    }
                }
            },
            company: {
                type: String,
                required: true,
            },
            model: {
                type: String,
                required: true,
            },
            used_this_month: {
                type: Number,
                default: 0
            }
        }],
        required: true,
    },
    car_booked: {
        type: [{
            car_no: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^[A-Z]{2}\d\d[A-Z]{2}\d\d\d\d$/.test(v)
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

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ phone: 1 }, { unique: true })

export default mongoose.model("ARSUser", userSchema)
