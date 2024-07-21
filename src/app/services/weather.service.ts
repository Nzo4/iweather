import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Location, Weather } from '../constants/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  findLocation(address: string): Observable<Location[]> {
    const params = new HttpParams()
      .set('key', environment.ACCESS_TOKEN)
      .set('q', address)
      .set('limit', 3)
      .set('dedupe', 1)
    return this.http.get<Location[]>(`https://api.locationiq.com/v1/autocomplete`, { params })
  }

  getWeatherData(latitude: string, longitude: string): Observable<Weather> {
    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude)
      .set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m')
      .set('daily', 'weather_code,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_probability_max')
      .set('forecast_days', '6');
    return this.http.get<Weather>('https://api.open-meteo.com/v1/forecast?', { params })
  }
}

