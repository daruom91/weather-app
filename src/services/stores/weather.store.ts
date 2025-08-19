import { create } from "zustand";
import type { City } from "../../models/City";
import { WeatherService } from "../weather.service";

export const useWeatherStore = create((set, get) => ({
  cities: [] as City[],
  query: "",
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  apiKey: import.meta.env.VITE_OWM_KEY || "",
  limit: 10,
  setQuery: (query: string) => set({ query }),
  setApiKey: (apiKey: string) => set({ apiKey }),
  setLimit: (limit: number) => set({ limit }),
  setCities: (cities: City[]) => set({ cities }),

  getCities: () => {
    const weatherService = new WeatherService();
    const { query, limit, apiKey } = get() as { query: string; limit: number; apiKey: string };
    if (apiKey && query) {
      set({ loading: true });

      weatherService
        .searchCities(query, limit, apiKey)
        .then((cities) => {
          console.log(cities);
          set({ cities });
          set({ loading: false });
        })
        .catch((error) => {
          console.log(error);
          set({ loading: false });
        });
    } else {
      set({ loading: false });
      set({ cities: [] });
    }
  },
}));
