import { apiClient } from "../core/api";
import type { City } from "../models/City";
import type { WeatherCity } from "../models/WeatherCity";
import type { WikiCity } from "../models/WkiCity";

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
}

export interface WeatherForecastData {
  location: WeatherData["location"];
  current: WeatherData["current"];
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
    }>;
  };
}

export class WeatherService {
  constructor() {
    // Configure the API client for weather API
    apiClient.setDefaultHeaders({
      "Content-Type": "application/json",
    });
  }

  async searchCities(query: string, limit: number = 10, appId: string): Promise<Array<City>> {
    const URL = `https://api.openweathermap.org/geo/1.0/direct`;
    const response = await apiClient.get<City[]>(URL, {
      params: {
        q: query,
        limit,
        appId,
      },
    });

    return response.data;
  }

  async getImageCity(query: string): Promise<WikiCity> {
    const URL = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`;
    const response = await apiClient.get<WikiCity>(URL);
    return response.data;
  }
  async getWeatherCity(lat: number, lon: number, appId: string): Promise<WeatherCity> {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`;
    const response = await apiClient.get<WeatherCity>(URL);
    return response.data;
  }
}
