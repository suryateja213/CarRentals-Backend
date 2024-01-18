import ARSCoupon from "../models/coupon.js"
import ARSUsedCoupon from "../models/usedCoupon.js"

export default function CouponController() {
    return {
        findCoupon: async function ({ coupon_code, _id }) {
            try {
                const result = await ARSCoupon.findOne({ coupon_code: coupon_code })
                if (!result) {
                    return {
                        message: "Promo Invalid"
                    }
                }
                const user_use = await ARSUsedCoupon.findOne({
                    user_id: _id,
                    coupon_code: coupon_code
                })
                if (user_use) {
                    return {
                        message: "You have already used this Promo Code"
                    }
                }
                return result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        },
        applyCoupon: async function ({ coupon_code, _id }) {
            try {
                const used_coupon = new ARSUsedCoupon({
                    user_id: _id,
                    coupon_code: coupon_code
                })
                const result = await used_coupon.save()
                return result
            } catch (e) {
                return { ...e, errno: 403 }
            }
        }
    }
}
