import ARSCar from "../models/car.js";
import ARSUser from "../models/user.js";

export default function CarsController() {
  return {
    addCar: async function ({
      car_no,
      seater_type,
      price_per_day,
      price_per_hour,
      company,
      model,
      manifactured_year,
      driven_distance,
      owner,
    }) {
      try {
        const car = new ARSCar({
          car_no: car_no,
          seater_type: seater_type,
          price_per_day: price_per_day,
          price_per_hour: price_per_hour,
          company: company,
          model: model,
          manifactured_year: manifactured_year,
          driven_distance: driven_distance,
          owner: owner,
        });
        const result = await car.save();
        const user = await ARSUser.findOneAndUpdate(
          { _id: owner },
          {
            $push: {
              host: {
                _id: result._id,
                car_no: result.car_no,
                company: result.company,
                model: result.model,
              },
            },
          }
        );
        return result;
      } catch (e) {
        return { ...e, errno: 403 };
      }
    },
    getCar: async function ({ car_no }) {
      const car = await ARSCar.findOne({ car_no: car_no });
      return car || { errno: 404 };
    },
    getCarLocation: async function ({ car_no }) {
      const location = await ARSCar.findOne(
        { car_no: car_no },
        { location: 1 }
      );
      console.log("loc", location);
      return location || { message: "car not avaliable" };
    },
    getNearLocation: async function ({ latitude, longitude, kms }) {
      try {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        kms = parseFloat(kms);
        const nearby = await ARSCar.find(
          {
            location: {
              $geoWithin: {
                $center: [[latitude, longitude], kms / 111],
              },
            },
          },
          {
            booking: 0,
          }
        );
        return nearby;
      } catch (e) {
        return { ...e, errno: 403 };
      }
    },
    setCarLocation: async function ({ car_no, latitude, longitude }) {
      try {
        const result = await ARSCar.findOneAndUpdate(
          { car_no: car_no },
          {
            trueLocation: true,
            location: [latitude, longitude],
          }
        );
        return { car_no: result.car_no, location: result.location };
      } catch (e) {
        return { errno: 403, ...e };
      }
    },
  };
}
