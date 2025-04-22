const carController = require("../../../controllers/car.controller");
const Car = require("../../../models/car.model");
const { faker } = require("@faker-js/faker");

jest.mock("@faker-js/faker", () => ({
  faker: {
    vehicle: {
      manufacturer: jest.fn(),
      model: jest.fn(),
    },
    number: {
      int: jest.fn(),
    },
  },
}));

describe("Get All Cars", () => {
  let req, res, next;

  beforeEach(() => {
    Car.find = jest.fn();
    Car.findByIdAndDelete = jest.fn();
    req = { params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it("should return all cars", async () => {
    const mockCars = [
      { brand: "Toyota", model: "Corolla", year: 2020, value: 30000 },
      { brand: "Chevrolet", model: "Sail", year: 2000, value: 40000 },
    ];
    Car.find = jest.fn().mockResolvedValue(mockCars);

    await carController.getAllCars(req, res, next);

    expect(Car.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCars);
  });

  it("should return 500 if an error occurs", async () => {
    Car.find = jest.fn().mockRejectedValue(new Error("Database error"));

    await carController.getAllCars(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred",
      error: "Database error",
    });
  });
});

describe("Generate Car", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it("should generate a new car", async () => {
    faker.vehicle.manufacturer.mockReturnValue("Toyota");
    faker.vehicle.model.mockReturnValue("Corolla");
    faker.number.int.mockReturnValueOnce(2022).mockReturnValueOnce(45000);
    const saveMock = jest.fn().mockResolvedValue(true);
    jest.spyOn(Car.prototype, "save").mockImplementation(saveMock);

    await carController.generateCar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "New car generated" });

    expect(saveMock).toHaveBeenCalled();
  });

  it("should return 500 if an error occurs", async () => {
    faker.vehicle.manufacturer.mockReturnValue("Ford");
    faker.vehicle.model.mockReturnValue("Focus");
    faker.number.int.mockReturnValueOnce(2018).mockReturnValueOnce(35000);

    const saveMock = jest.fn().mockRejectedValue(new Error("DB error"));
    jest.spyOn(Car.prototype, "save").mockImplementation(saveMock);

    await carController.generateCar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred",
      error: "DB error",
    });

    expect(saveMock).toHaveBeenCalled();
  });
});

describe("Delete Car", () => {
  let req, res, next;

  beforeEach(() => {
    Car.find = jest.fn();
    Car.findByIdAndDelete = jest.fn();
    req = { params: { id: "123" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it("should delete a car", async () => {
    const deletedCar = {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      value: 30000,
    };
    Car.findByIdAndDelete = jest.fn().mockResolvedValue(deletedCar);

    await carController.deleteCar(req, res, next);

    expect(Car.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Car deleted successfully",
    });
  });

  it("should return 404 if car not found", async () => {
    Car.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await carController.deleteCar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Car not found" });
  });

  it("should return 500 if an error occurs", async () => {
    Car.findByIdAndDelete = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await carController.deleteCar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred",
      error: "Database error",
    });
  });
});
