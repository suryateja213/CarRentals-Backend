import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
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
})

adminSchema.index({ email: 1 }, { unique: true })

export default mongoose.model("ARSAdmin", adminSchema)
