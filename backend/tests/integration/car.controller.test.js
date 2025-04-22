const request = require("supertest");
const app = require("../../app");
const Car = require("../../models/car.model");

jest.mock("../../models/car.model", () => {
  const mockCar = jest.fn();
  mockCar.find = jest.fn();
  mockCar.findByIdAndDelete = jest.fn();
  mockCar.prototype.save = jest.fn();
  return mockCar;
});

describe("Car Controller Integration Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/cars", () => {
    it("should return a list of cars", async () => {
      const mockCars = [
        { brand: "Toyota", model: "Corolla", year: 2020, value: 20000 },
        { brand: "Honda", model: "Civic", year: 2021, value: 22000 },
      ];
      Car.find.mockResolvedValue(mockCars);

      const res = await request(app).get("/api/cars");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCars);
      expect(Car.find).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if an error occurs", async () => {
      Car.find.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/api/cars");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: "An error occurred",
        error: "Database error",
      });
    });
  });

  describe("POST /api/generate", () => {
    it("should generate a new car", async () => {
      Car.prototype.save.mockResolvedValue();

      const res = await request(app).post("/api/generate");

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: "New car generated" });
      expect(Car.prototype.save).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if an error occurs", async () => {
      Car.prototype.save.mockRejectedValue(new Error("Save error"));

      const res = await request(app).post("/api/generate");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: "An error occurred",
        error: "Save error",
      });
    });
  });

  describe("DELETE /api/cars/:id", () => {
    it("should delete a car successfully", async () => {
      Car.findByIdAndDelete.mockResolvedValue({ _id: "123", brand: "Toyota" });

      const res = await request(app).delete("/api/cars/123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Car deleted successfully" });
      expect(Car.findByIdAndDelete).toHaveBeenCalledWith("123");
    });

    it("should return 404 if car is not found", async () => {
      Car.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete("/api/cars/123");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Car not found" });
    });

    it("should return 500 if an error occurs", async () => {
      Car.findByIdAndDelete.mockRejectedValue(new Error("Delete error"));

      const res = await request(app).delete("/api/cars/123");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: "An error occurred",
        error: "Delete error",
      });
    });
  });
});
