const express = require("express");

const router = express.Router();

const carController = require("../controllers/car.controller");

router.get("/api/cars", carController.getAllCars);

router.post("/api/generate", carController.generateCar);

router.delete("/api/cars/:id", carController.deleteCar);

module.exports = router;
