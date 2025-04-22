import { TestBed } from "@angular/core/testing";
import { CarService } from "./car.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { environment } from "../../environments/environment";

describe("CarService", () => {
    let service: CarService;
    let httpMock: HttpTestingController;
    const APIURL = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CarService]
        });

        service = TestBed.inject(CarService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    })

    it('should retrieve cars with GET ', () => {
        const mockCars = [{ id: '1', name: 'Test Car' }];

        service.getCars().subscribe(cars => {
            expect(cars).toEqual(mockCars);
        });

        const req = httpMock.expectOne(`${APIURL}/cars`);
        expect(req.request.method).toBe('GET');
        req.flush(mockCars);
    });

    it('should generate a new car with POST', () => {
        const mockResponse = { success: true };

        service.generateCar().subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${APIURL}/generate`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        req.flush(mockResponse);
    });

    it('should delete a car with DELETE', () => {
        const mockResponse = { success: true };
        const id = '123';

        service.deleteCar(id).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${APIURL}/cars/${id}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
    });
})