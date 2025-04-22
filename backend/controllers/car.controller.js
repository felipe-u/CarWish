const { faker } = require("@faker-js/faker");
const Car = require("../models/car.model");

exports.getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

exports.generateCar = async (req, res, next) => {
  try {
    const newCar = new Car({
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      year: faker.number.int({ min: 1980, max: 2025 }),
      value: faker.number.int({ min: 30000, max: 100000, multipleOf: 1000 }),
    });
    await newCar.save();
    res.status(201).json({ message: "New car generated" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    const carId = req.params.id;
    const deletedCar = await Car.findByIdAndDelete(carId);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};
