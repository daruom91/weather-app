import { AiOutlineEnter } from "react-icons/ai";
import Input from "../custom-input/Input";
import { MdKey } from "react-icons/md";
import { useMemo, useState } from "react";
import { useWeatherStore } from "../../services/stores/weather.store";
import { debounce } from "../../utils/debounce-fn";
import type { City } from "../../models/City";
import { FaCity } from "react-icons/fa";
import Loader from "../loader/Loader";
import Modal from "../custom-modal/Modal";
import { WeatherService, type WeatherData } from "../../services/weather.service";
import type { WeatherCity } from "../../models/WeatherCity";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiHumidity,
  WiStrongWind,
  WiThermometer,
  WiThermometerExterior,
} from "react-icons/wi";

export default function WeatherForm() {
  const regex = /^[a-f0-9]{32}$/;
  const { getCities, setApiKey, setQuery, query, apiKey, cities, loading } = useWeatherStore() as {
    getCities: () => void;
    setApiKey: (key: string) => void;
    setQuery: (query: string) => void;
    query: string;
    apiKey: string;
    cities: City[];
    loading: boolean;
  };
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City>();
  const [weather, setWeather] = useState<WeatherCity>();
  const [isValid, setIsValid] = useState<boolean | null>(regex.test(apiKey));

  // Regex for 32-character lowercase hex

  const debounceSearch = useMemo(
    () =>
      debounce(() => {
        getCities();
      }, 500),
    [setQuery]
  );

  const handleGetWeather = async (lat: number, long: number) => {
    const weatherService = new WeatherService();
    const weather = await weatherService.getWeatherCity(lat, long, apiKey);
    console.log("weather:", weather);
    setWeather(weather);
  };

  const getWeatherIcon = (condition: string) => {
    const iconClass = "text-white";
    const size = 80;

    switch (condition?.toLowerCase()) {
      case "clear":
        return <WiDaySunny className={iconClass} size={size} />;
      case "clouds":
        return <WiCloudy className={iconClass} size={size} />;
      case "rain":
      case "drizzle":
        return <WiRain className={iconClass} size={size} />;
      case "snow":
        return <WiSnow className={iconClass} size={size} />;
      case "thunderstorm":
        return <WiThunderstorm className={iconClass} size={size} />;
      case "mist":
      case "fog":
      case "haze":
        return <WiFog className={iconClass} size={size} />;
      default:
        return <WiDaySunny className={iconClass} size={size} />;
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center  blur-content ">
        <form className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Entrez la clé API OpenWeatherMap"
            label="API Key"
            value={apiKey}
            iconDirection="right"
            onChange={(value) => {
              setIsValid(regex.test(value) as unknown as null);
              setApiKey(value);
            }}
            required
            icon={<MdKey />}
            error={!isValid ? "La clé n'est pas valide" : ""}
          />
          <Input
            type="text"
            placeholder="Entrez le nom de la ville"
            label="Ville"
            value={query}
            onKeyDown={() => {
              getCities();
            }}
            iconDirection="right"
            disabled={!apiKey}
            onChange={(value) => {
              debounceSearch();
              setQuery(value);
            }}
            required
            icon={<AiOutlineEnter />}
          />
        </form>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <div className="overflow-x-auto w-full">
          <table className="w-full rounded-lg overflow-hidden blur-content-table">
            <thead className="">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {cities.map((city, index) => (
                <tr key={`${city.name}-${index}`} className="hover:bg-gray-100/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">{city.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">{city.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">{city.state || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className=" hover:text-gray-900 font-medium cursor-pointer"
                      onClick={async () => {
                        setSelectedCity(city);
                        await handleGetWeather(city.lat, city.lon);
                        setOpenDetailModal(true);
                      }}
                    >
                      <FaCity />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <Loader />
          </div>
        ) : (
          !cities.length && (
            <div className="blur-content w-full text-center rounded-lg">
              {query ? "Aucune ville trouvée" : "Veuillez entrez la ville"}
            </div>
          )
        )}
      </div>
      <Modal open={openDetailModal} onClose={() => setOpenDetailModal(false)}>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-md text-white">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-2">
              {selectedCity?.name}, {selectedCity?.country}
            </h2>
            <p className="text-lg mb-6">{selectedCity?.state || ""}</p>
            <div className="text-8xl mb-6">{getWeatherIcon(weather?.weather[0]?.main || "")}</div>
            <div className="text-5xl font-bold mb-6">{Math.round(weather?.main?.temp!)}°C</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
              <div className="flex items-center gap-2">
                <WiThermometerExterior size={30} />
                <span>Ressenti: {Math.round(weather?.main?.feels_like!)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <WiHumidity size={30} />
                <span>Humidité: {weather?.main?.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <WiStrongWind size={30} />
                <span>Vent: {Math.round(weather?.wind?.speed! * 3.6)} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <WiThermometer size={30} />
                <span>
                  Min/Max: {Math.round(weather?.main?.temp_min!)}°/
                  {Math.round(weather?.main?.temp_max!)}°
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
