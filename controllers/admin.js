import ARSAdmin from "../models/admin.js"
import ARSCoupon from "../models/coupon.js"
import ARSCar from "../models/car.js"
import * as clustering from "density-clustering"


export default function AdminController() {
    return {
        login: async function ({ email, passwd }) {
            try {
                const result = await ARSAdmin.findOne({ email: email, passwd: passwd })
                return result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        },
        createAdmin: async function ({ email, passwd }) {
            try {
                const admin = new ARSAdmin({
                    email: email,
                    passwd: passwd
                })
                const result = await admin.save()
                return result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        },
        createCoupon: async function ({ coupon_name, coupon_code, name, value }) {
            const coupon = new ARSCoupon({
                coupon_name: coupon_name,
                coupon_code: coupon_code,
                discount: {
                    name: name,
                    value: value,
                }
            })
            try {
                const result = await coupon.save()
                return result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        },
        getAllCars: async function () {
            try {
                const result = await ARSCar.find()
                let cache = new Map()
                let kmeans = new clustering.default.KMEANS()
                let arr = []
                for (const car of result) {
                    const key = car.location[0] + "-" + car.location[1]
                    cache.set(key, car)
                    arr.push(car.location)
                }
                let clusters = kmeans.run(arr, 7 * 3)
                let user_result = []
                for (let i = 0; i < clusters.length; i++) {
                    user_result.push([])
                }
                for (let [index, cluster] of clusters.entries()) {
                    for (let i of cluster) {
                        const key = arr[i][0] + '-' + arr[i][1]
                        user_result[index].push(cache.get(key))
                    }
                }
                return user_result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        },
        getSomeCars: async function ({ skip, limit }) {
            try {
                const result = await ARSCar.find().skip(skip).limit(limit)
                return result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        },
        getOneCar: async function ({ car_no }) {
            try {
                const result = await ARSCar.findOne({ car_no: car_no })
                return result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        }
    }
}