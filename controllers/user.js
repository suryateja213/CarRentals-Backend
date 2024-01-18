import ARSUser from "../models/user.js"
import ARSCar from "../models/car.js"
import ARSBooking from "../models/booking.js"
import CouponController from "./coupon.js"

const couponController = CouponController()

export default function UserController() {
    return {
        authenticate: async function ({ email, passwd }) {
            const user = await ARSUser.findOne({ email: email, passwd: passwd }, { host: 0, car_booked: 0 })
            return user
        },
        createUser: async function ({ name, email, passwd, phone }) {
            var user = new ARSUser({
                name: name,
                email: email,
                passwd: passwd,
                phone: phone,
                host: []
            })
            try {
                var result = await user.save()
                return result
            } catch (e) {
                return e
            }
        },
        profile: async function ({ email }) {
            try {
                const result = await ARSUser.findOne({ email: email }, { picture: 1 })
                return result
            } catch (e) {
                return { ...e, errno: 400 }
            }
        },
        updateProfile: async function (data) {
            try {
                let email = data.email
                delete data.email
                await ARSUser.findOneAndUpdate({ email: email }, {
                    $set: {
                        ...data
                    }
                })
                for (const k of data) {
                    data[k] = 1
                }
                const result = await ARSUser.findOne({ email: email }, { ...data })
                return result
            } catch (e) {
                return { ...e, errno: 400 }
            }
        },
        getCars: async function ({ _id }) {
            try {
                const data = await ARSUser.findOne({ _id: _id })
                return { host: data.host, car_booked: data.car_booked }
            } catch (e) {
                return { errno: 404, ...e }
            }
        },
        bookCar: async function ({ car_no, email, from_date, from_time, to_date, to_time, coupon_code }) {
            try {
                const bookings = await ARSCar.findOne({ car_no: car_no }, { booking: 1 })
                const arr = JSON.parse(JSON.stringify(bookings.booking))
                for (const booking of arr) {
                    if (booking.from_date + booking.from_time <= from_date + from_time
                        && from_date + from_time <= booking.to_date + booking.to_time) {
                        return { errno: 403 }
                    }
                    if (booking.from_date + booking.from_time <= to_date + to_time
                        && to_date + to_time <= booking.to_date + booking.to_time) {
                        return { errno: 403 }
                    }
                    if (from_date + from_time <= booking.from_date + booking.from_time
                        && booking.from_date + booking.from_time <= to_date + to_time) {
                        return { errno: 403 }
                    }
                    if (from_date + from_time <= booking.to_date + booking.to_time
                        && booking.to_date + booking.to_time <= to_date + to_time) {
                        return { errno: 403 }
                    }
                }
                const car_result = await ARSCar.findOneAndUpdate({ car_no: car_no }, {
                    $push: {
                        booking: {
                            email: email,
                            from_date: from_date,
                            from_time: from_time,
                            to_date: to_date,
                            to_time: to_time
                        }
                    }
                })
                const user_result = await ARSUser.findOneAndUpdate({ email: email }, {
                    $push: {
                        car_booked: {
                            car_no: car_no,
                            from_date: from_date,
                            from_time: from_time,
                            to_date: to_date,
                            to_time: to_time
                        }
                    }
                })
                const booking_data = new ARSBooking({
                    car: car_result._id,
                    user: user_result._id,
                    from_date: from_date,
                    from_time: from_time,
                    to_date: to_date,
                    to_time: to_time
                })
                await booking_data.save()
                if (coupon_code != undefined && coupon_code != '') {
                    await couponController.applyCoupon({
                        coupon_code: coupon_code,
                        _id: user_result._id,
                    })
                }
                return {
                    u_id: user_result._id,
                    c_id: car_result._id,
                    email: user_result.email,
                    car_no: car_result.car_no
                }
            } catch (e) {
                return { errno: 403, ...e }
            }
        },
    }
}
