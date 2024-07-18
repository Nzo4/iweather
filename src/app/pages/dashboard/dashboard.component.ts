import { CommonModule, registerLocaleData } from "@angular/common";
import { Component, LOCALE_ID } from "@angular/core";
import { ActivatedRoute, } from "@angular/router";
import { CurrentWeather, DailyWeather } from "src/app/constants/weather";
import { WeatherService } from "src/app/services/weather.service";
import localeRu from '@angular/common/locales/ru';


registerLocaleData(localeRu, 'ru-RU');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }]
})

export class DashboardComponent {
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

  weatherMap = new Map([
    ["day-clear", { isDay: 1, isRain: 0, cloudCover: ["Ясная погода", "Незначительная облачность"] }],
    ["day-few-cloudy", { isDay: 1, isRain: 0, cloudCover: ["Небольшая облачность"] }],
    ["day-cloudy", { isDay: 1, isRain: 0, cloudCover: ["Значительная облачность", "Облачно", "Пасмурно"] }],
    ["day-rain", { isDay: 1, isRain: 1 }],
    ["night-clear", { isDay: 0, isRain: 0, cloudCover: ["Ясная погода", "Незначительная облачность"] }],
    ["night-few-cloudy", { isDay: 0, isRain: 0, cloudCover: ["Небольшая облачность"] }],
    ["night-cloudy", { isDay: 0, isRain: 0, cloudCover: ["Значительная облачность", "Облачно", "Пасмурно"] }],
    ["night-rain", { isDay: 0, isRain: 1 }]
  ]);

  address!: string;
  cloudState!: string;
  weatherCurrentIcon!: string;

  constructor(private weatherService: WeatherService, private route: ActivatedRoute,) {
    this.route.queryParams.subscribe((params) => {
      const { address, lat, lon } = params;
      this.address = address;
      this.weatherService.getWeatherData(lat, lon).subscribe(weather => {
        this.currentWeather = weather.current;
        this.dailyWeather = weather.daily;
        this.cloudState = this.cloudCoverCalc(this.currentWeather.cloud_cover);
        this.changeCurrentWeather(this.currentWeather.is_day, this.currentWeather.rain, this.cloudState);
      })
    })
  }

  cloudCoverCalc(cloudCover: number): string {
    if (cloudCover >= 0 && cloudCover <= 10) {
      return 'Ясная погода';
    } else if (cloudCover > 10 && cloudCover <= 40) {
      return 'Незначительная облачность';
    } else if (cloudCover > 40 && cloudCover <= 70) {
      return 'Небольшая облачность';
    } else if (cloudCover > 70 && cloudCover <= 80) {
      return 'Значительная облачность';
    } else if (cloudCover > 80 && cloudCover <= 89) {
      return 'Облачно';
    } else if (cloudCover > 90 && cloudCover <= 100) {
      return 'Пасмурно';
    } else {
      return 'Неопределенно';
    }
  }

  getWeather(isDay: number, isRain: number, cloudState: string) {
    for (let [key, value] of this.weatherMap.entries()) {
      if (value.isDay === isDay && value.isRain === isRain && (value.cloudCover ? value.cloudCover.includes(cloudState) : true)) {
        return key;
      }
    }
    return true;
  }

  changeCurrentWeather(isDay: number, isRain: number, cloudState: string) {
    const currentWeather = this.getWeather(isDay, isRain, cloudState);
    const backgroundImg = document.getElementsByClassName('weather-block-header')[0] as HTMLElement;
    switch (currentWeather) {
      case 'day-clear': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/clear-day-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/clear-day-icon.svg';
        break;
      };
      case 'day-few-cloudy': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/few-cloudy-day-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/few-cloudy-day-icon.svg';
        break;
      }
      case 'day-cloudy': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/cloudy-day-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/cloudy-day-icon.svg';
        break;
      }
      case 'day-rain': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/rain-day-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/rain-day-icon.svg';
        break;
      }
      case 'night-clear': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/clear-night-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/clear-night-icon.svg';
        break;
      }
      case 'night-few-cloudy': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/few-cloudy-night-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/few-cloudy-night-icon.svg';
        break;
      }
      case 'night-cloudy': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/cloudy-night-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/cloudy-night-icon.svg';
        break;
      }
      case 'night-rain': {
        backgroundImg.style.backgroundImage = "url('../../../assets/images/weather-backgrounds/rain-night-bg.png')";
        this.weatherCurrentIcon = '../../../assets/icons/weather-icons/rain-night-icon.svg';
        break;
      }
    }
  }

  getWeatherDaily(weatherCode: number): string {
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

}


