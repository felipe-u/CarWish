import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarService {
    private httpClient = inject(HttpClient);
    private APIURL = environment.apiUrl;

    getCars() {
        return this.httpClient.get(`${this.APIURL}/cars`);
    }

    generateCar() {
        return this.httpClient.post(`${this.APIURL}/generate`, {});
    }

    deleteCar(id: string) {
        return this.httpClient.delete(`${this.APIURL}/cars/${id}`);
    }
}