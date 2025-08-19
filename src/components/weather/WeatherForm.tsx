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
  const [selectedCity, setSelectedCity] = useState<City & { weather?: WeatherCity }>();

  const debounceSearch = useMemo(
    () =>
      debounce(() => {
        getCities();
      }, 500),
    [setQuery]
  );

  const handleGetWeather = async () => {
    if (selectedCity) {
      const weatherService = new WeatherService();

      const weather = await weatherService.getWeatherCity(
        selectedCity.lat,
        selectedCity.lon,
        apiKey
      );
      setSelectedCity({ ...selectedCity, weather });
      console.log({ ...selectedCity, weather });
    }
  };

  const getWeatherIcon = (condition: string) => {
    const iconClass = "text-black";
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
              setApiKey(value);
            }}
            required
            icon={<MdKey />}
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
                        await handleGetWeather();
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
        {getWeatherIcon(selectedCity?.weather?.weather[0]?.main || "")}
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Détails de la ville</h2>
          <p className="text-lg">Nom de la ville: {selectedCity?.name}</p>
          <p className="text-lg">Pays: {selectedCity?.country}</p>
          <p className="text-lg">Région: {selectedCity?.state || "-"}</p>
          <p className="text-lg">
            Température: {Math.round(selectedCity?.weather?.main?.temp!) || "-"}
            °C
          </p>
          <p className="text-lg">
            Température ressentie:{" "}
            {selectedCity?.weather?.main?.feels_like
              ? Math.round(selectedCity?.weather?.main?.feels_like)
              : "-"}
            °C
          </p>
          <p className="text-lg">
            Température minimale:{" "}
            {selectedCity?.weather?.main?.temp_min
              ? Math.round(selectedCity?.weather?.main?.temp_min)
              : "-"}
            °C
          </p>
          <p className="text-lg">
            Température maximale:{" "}
            {selectedCity?.weather?.main?.temp_max
              ? Math.round(selectedCity?.weather?.main?.temp_max)
              : "-"}
            °C
          </p>
          <p className="text-lg">
            Humidité:{" "}
            {selectedCity?.weather?.main?.humidity
              ? `${selectedCity?.weather?.main?.humidity} %`
              : "-"}
          </p>
          <p className="text-lg">
            Vents:{" "}
            {selectedCity?.weather?.wind?.speed
              ? `${Math.round(selectedCity?.weather?.wind?.speed * 3.6)} Km/h`
              : "-"}
          </p>
        </div>
      </Modal>
    </div>
  );
}
