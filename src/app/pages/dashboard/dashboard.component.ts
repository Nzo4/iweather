import { CommonModule, registerLocaleData } from "@angular/common";
import { Component, LOCALE_ID, OnInit } from "@angular/core";
import { ActivatedRoute, } from "@angular/router";
import { CurrentWeather, DailyWeather, Weather } from "src/app/constants/weather";
import { WeatherService } from "src/app/services/weather.service";
import localeRu from '@angular/common/locales/ru';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }]
})

export class DashboardComponent implements OnInit {
  currentWeather: CurrentWeather = {
    time: '',
    interval: 0,
    temperature_2m: 0,
    relative_humidity_2m: 0,
    apparent_temperature: 0,
    is_day: 0,
    precipitation: 0,
    rain: 0,
    weather_code: 0,
    cloud_cover: 0,
    wind_speed_10m: 0,
  }

  dailyWeather: DailyWeather = {
    apparent_temperature_max: [],
    apparent_temperature_min: [],
    precipitation_probability_max: [],
    time: [],
    weather_code: [],
    uv_index_max: [],
  }

  weatherMap = new Map<string, { isDay: number, weatherCodes: number[] }>([
    ["day-clear", { isDay: 1, weatherCodes: [0] }],
    ["day-few-cloudy", { isDay: 1, weatherCodes: [1, 2] }],
    ["day-cloudy", { isDay: 1, weatherCodes: [3] }],
    ["day-rain", { isDay: 1, weatherCodes: [61, 63, 65, 80, 81, 82] }],
    ["day-storm", { isDay: 1, weatherCodes: [95, 96, 97, 98, 99] }],
    ["night-clear", { isDay: 0, weatherCodes: [0] }],
    ["night-few-cloudy", { isDay: 0, weatherCodes: [1, 2] }],
    ["night-cloudy", { isDay: 0, weatherCodes: [3] }],
    ["night-rain", { isDay: 0, weatherCodes: [61, 63, 65, 80, 81, 82] }],
    ["night-storm", { isDay: 0, weatherCodes: [95, 96, 97, 98, 99] }]
  ]);

  address!: string;
  cloudState!: string;
  weatherCurrentIcon!: string;
  nameCurrentWeather!: string;
  isLoading: boolean = false;
  lat!: string;
  lon!: string;

  constructor(private weatherService: WeatherService, private route: ActivatedRoute,) {
    registerLocaleData(localeRu, 'ru-RU');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { address, lat, lon } = params;
      if (address && lat && lon) {
        this.address = address;
        this.lat = lat;
        this.lon = lon;
      }
    });
    this.fetchWeather();

  }

  fetchWeather() {
    if (this.lat && this.lon) {
      this.isLoading = true;
      this.weatherService.getWeatherData(this.lat, this.lon).subscribe({
        next: (weather: Weather) => {
          this.currentWeather = weather.current;
          this.dailyWeather = weather.daily;
          this.cloudState = this.calculateWeatherCode(this.currentWeather.weather_code);
          this.updateWeather();
          this.isLoading = false;

        },
        error: (err) => {
          console.error('Ошибка получения данных', err);
          this.isLoading = false;
        }
      });
    }
  }

  updateWeather() {
    this.nameCurrentWeather = this.calculateWeather(this.currentWeather.is_day, this.currentWeather.weather_code);
    this.weatherCurrentIcon = this.getWeatherIcon(this.nameCurrentWeather);
  }

  calculateWeather(isDay: number, weatherCode: number): string {
    for (let [key, value] of this.weatherMap) {
      if (value.isDay === isDay && value.weatherCodes.includes(weatherCode)) {
        return key;
      }
    }
    return '';
  }

  calculateWeatherCode(weatherCode: number): string {
    switch (weatherCode) {
      case 0:
        return 'Чистое небо';
      case 1:
        return 'Преимущественно ясно';
      case 2:
        return 'Переменная облачность';
      case 3:
        return 'Пасмурно';
      case 61:
        return 'Слабый дождь';
      case 63:
        return 'Умеренный дождь';
      case 65:
        return 'Сильный дождь';
      case 80:
        return 'Слабый ливневый дождь';
      case 81:
        return 'Умеренный ливневый дождь';
      case 82:
        return 'Сильный ливневый дождь';
      case 95:
        return 'Гроза'
      case 96:
        return 'Гроза с небольшим градом';
      case 99:
        return 'Гроза с сильным градом';
      default:
        return 'Неопределенно';
    }
  }

  renderingDailyWeather(weatherCode: number): string {
    switch (weatherCode) {
      case 0:
        return "../../../assets/icons/weather-icons/clear-day-icon.svg";
      case 1:
        return "../../../assets/icons/weather-icons/few-cloudy-day-icon.svg";
      case 2:
      case 3:
        return "../../../assets/icons/weather-icons/cloudy-day-icon.svg";
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        return "../../../assets/icons/weather-icons/rain-day-icon.svg";
      case 95:
      case 96:
      case 99:
        return "../../assets/icons/weather-icons/storm-day-icon.svg";
      default:
        return "../../assets/icons/weather-icons/clear-day-icon.svg";
    }
  }

  getWeatherIcon(weather: string): string {
    switch (weather) {
      case 'day-clear':
        return '../../../assets/icons/weather-icons/clear-day-icon.svg';
      case 'day-few-cloudy':
        return '../../../assets/icons/weather-icons/few-cloudy-day-icon.svg';
      case 'day-cloudy':
        return '../../../assets/icons/weather-icons/cloudy-day-icon.svg';
      case 'day-rain':
        return '../../../assets/icons/weather-icons/rain-day-icon.svg';
      case 'day-storm':
        return '../../../assets/icons/weather-icons/storm-day-icon.svg';
      case 'night-clear':
        return '../../../assets/icons/weather-icons/clear-night-icon.svg';
      case 'night-few-cloudy':
        return '../../../assets/icons/weather-icons/few-cloudy-night-icon.svg';
      case 'night-cloudy':
        return '../../../assets/icons/weather-icons/cloudy-night-icon.svg';
      case 'night-rain':
        return '../../../assets/icons/weather-icons/rain-night-icon.svg';
      case 'night-storm':
        return '../../../assets/icons/weather-icons/storm-night-icon.svg'
      default:
        return '';
    }
  }
}




