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

export type Weather = {
  latitude: number,
  longitude: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: string,
  timezone_abbreviation: string,
  elevation: number,
  current_units: {
    time: string,
    interval: string,
    temperature_2m: string,
    relative_humidity_2m: string,
    apparent_temperature: string,
    is_day: string,
    precipitation: string,
    rain: string
    weather_code: string,
    cloud_cover: string,
    wind_speed_10m: string,
  },
  current: CurrentWeather,
  daily_units: {
    time: string,
    weather_code: string,
    apparent_temperature_max: string,
    apparent_temperature_min: string,
    uv_index_max: string,
    precipitation_probability_max: string
  },
  daily: DailyWeather
}

export type Location = {
  place_id: number,
  osm_id: number,
  osm_type: string,
  licence: string,
  lat: number,
  lon: number,
  boundingbox: number[],
  class: string,
  type: string,
  display_name: string,
  display_place: string,
  display_address: string,
  address: {
    name: string,
    state: string,
    country: string,
    country_code: string
  }
}

