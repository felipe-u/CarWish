import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CarService } from './services/car.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private carService = inject(CarService);
  cars = signal<any>(null);

  ngOnInit(): void {
    this.getCars();
    console.log('Initalized cars');
  }

  getCars() {
    this.carService.getCars().subscribe({
      next: (data) => {
        this.cars.set(data);
      },
      error: (error) => {
        console.error('Error fetching cars: ', error);
      }
    })
  }

  onGenerateCar() {
    this.carService.generateCar().subscribe({
      next: () => {
        this.getCars();
        console.log('New car generated');
      },
      error: (error) => {
        console.error('Error generating car: ', error);
      }
    });
  }

  onDeleteCar(id: string) {
    this.carService.deleteCar(id).subscribe({
      next: () => {
        this.getCars();
        console.log('Car deleted');
      },
      error: (error) => {
        console.error("Error deleting car: ", error);
      }
    })
  }
}
