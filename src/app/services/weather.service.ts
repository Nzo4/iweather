import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  findLocation(address: string): Observable<any> {
    return this.http.get(`https://api.locationiq.com/v1/autocomplete?key=${environment.ACCESS_TOKEN}&q=${address}&limit=3&dedupe=1&`)
  }

  getWeatherData(latitude: string, longitude: string): Observable<any> {
    return this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_probability_max&forecast_days=6`)
  }

}
