import { CommonModule, registerLocaleData } from "@angular/common";
import { Component, LOCALE_ID } from "@angular/core";
import { ActivatedRoute, } from "@angular/router";
import { DayOfWeek } from "src/app/constants/day-of-week";
import { WeatherOnAddress } from "src/app/constants/weather-on-address";
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

  currentWeather: WeatherOnAddress = {
    current: {},
    daily: {},
  };

  dayOfWeek: DayOfWeek = {
    apparent_temperature_max: [],
    apparent_temperature_min: [],
    precipitation_probability_max: [],
    time: [],
    weather_code: [],
    uv_index_max: [],
  }

  address!: string;
  cloudState!: string;
  iconCurrentWeatherState!: string;
  iconDayOfWeekUrl!: string;

  constructor(private weatherService: WeatherService, private route: ActivatedRoute,) {
    this.route.queryParams.subscribe((params) => {
      const { address, lat, lon } = params;
      this.address = address;
      this.weatherService.getWeatherData(lat, lon).subscribe(data => {
        this.currentWeather = data;
        this.dayOfWeek = data.daily;

        this.cloudState = this.cloudCoverCalc(this.currentWeather.current.cloud_cover);
        this.changeWeather(
          this.currentWeather.current.is_day,
          this.currentWeather.current.rain,
          this.currentWeather.current.cloud_cover
        );

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


  changeWeather(isDay: number, isRain: number, cloudCover: number) {
    const weatherHeader = document.getElementsByClassName('weather-block-header')[0] as HTMLElement;
    if (isDay === 1) {
      weatherHeader.style.backgroundImage = "url('../../../assets/images/day-clear.png')";
      this.iconCurrentWeatherState = "../../assets/icons/day-clear.svg"
      if (cloudCover >= 1 && cloudCover <= 4) {
        weatherHeader.style.backgroundImage = "url('../../../assets/images/day-cloudy.png')";
        this.iconCurrentWeatherState = "../../assets/icons/day-cloudy.svg"
      }
      else if (cloudCover >= 5) {
        weatherHeader.style.backgroundImage = "url('../../../assets/images/day-few-cloudy.png')";
        this.iconCurrentWeatherState = "../../assets/icons/day-few-cloudy.svg"
      }
      if (isRain === 1) {
        weatherHeader.style.backgroundImage = "url('../../../assets/images/rain-day.png')";
        this.iconCurrentWeatherState = "../../assets/icons/rain-day.svg"
      }
    } else {
      weatherHeader.style.backgroundImage = "url('../../../assets/images/night-clear.png')";
      this.iconCurrentWeatherState = "../../assets/icons/night-clear.svg"

      if (cloudCover >= 1 && cloudCover <= 4) {
        weatherHeader.style.backgroundImage = "url('../../../assets/images/night-cloudy.png')";
        this.iconCurrentWeatherState = "../../assets/icons/night-cloudy.svg"
      }
      else if (cloudCover >= 5) {
        weatherHeader.style.backgroundImage = "url('../../../assets/images/day-few-cloudy.png')";
        this.iconCurrentWeatherState = "../../assets/icons/night-few-cloudy.svg"
      }
      if (isRain === 1) {
        weatherHeader.style.backgroundImage = "url('../../../assets/images/rain-night.png')";
        this.iconCurrentWeatherState = "../../assets/icons/rain-night.svg"
      }
    }

  }

  changeIconWeather(weatherCode: number): string {
    switch (weatherCode) {
      case 0:
        return "../../assets/icons/day-clear.svg";
      case 1:
        return '../../assets/icons/day-cloudy.svg';
      case 2:
      case 3:
        return '../../assets/icons/day-cloudy.svg';
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
      case 95:
      case 96:
      case 99:
        return '../../assets/icons/rain-day.svg';
      default:
        return "../../assets/icons/day-clear.svg";
    }
  }


}

