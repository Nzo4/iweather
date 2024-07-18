export type CurrentWeather = {
  time: string,
  interval: number,
  temperature_2m: number,
  relative_humidity_2m: number,
  apparent_temperature: number,
  is_day: number,
  precipitation: number,
  rain: number,
  weather_code: number,
  cloud_cover: number,
  wind_speed_10m: number,
}

export type DailyWeather = {
  time: string[],
  weather_code: number[],
  apparent_temperature_max: number[],
  apparent_temperature_min: number[],
  uv_index_max: number[],
  precipitation_probability_max: number[]
}