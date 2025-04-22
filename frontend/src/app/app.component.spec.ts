import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CarService } from './services/car.service';

class MockCarService {
  getCars = jasmine.createSpy().and.returnValue(of([{ id: '1', name: 'Test Car' }]));
  generateCar = jasmine.createSpy().and.returnValue(of({}));
  deleteCar = jasmine.createSpy().and.returnValue(of({}));
}

describe('AppComponent', () => {
  let fixture: any;
  let component: AppComponent;
  let carService: MockCarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CarService, useClass: MockCarService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    carService = TestBed.inject(CarService) as unknown as MockCarService;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cars on init', () => {
    component.ngOnInit();
    expect(carService.getCars).toHaveBeenCalled();
    expect(component.cars()).toEqual([{ id: '1', name: 'Test Car' }]);
  });

  it('should generate a car and refresh the list', () => {
    component.onGenerateCar();
    expect(carService.generateCar).toHaveBeenCalled();
    expect(carService.getCars).toHaveBeenCalled();
  });

  it('should delete a car and refresh the list', () => {
    component.onDeleteCar('1');
    expect(carService.deleteCar).toHaveBeenCalledWith('1');
    expect(carService.getCars).toHaveBeenCalled();
  });

  it('should handle error on getCars', () => {
    spyOn(console, 'error');
    carService.getCars.and.returnValue(throwError(() => new Error('Error fetching')));
    component.getCars();
    expect(console.error).toHaveBeenCalledWith('Error fetching cars: ', jasmine.any(Error));
  });

  it('should handle error on generateCar', () => {
    spyOn(console, 'error');
    carService.generateCar.and.returnValue(throwError(() => new Error('Generate error')));
    component.onGenerateCar();
    expect(console.error).toHaveBeenCalledWith('Error generating car: ', jasmine.any(Error));
  });

  it('should handle error on deleteCar', () => {
    spyOn(console, 'error');
    carService.deleteCar.and.returnValue(throwError(() => new Error('Delete error')));
    component.onDeleteCar('1');
    expect(console.error).toHaveBeenCalledWith('Error deleting car: ', jasmine.any(Error));
  });
});
