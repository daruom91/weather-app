import "./App.css";
import WeatherForm from "./components/weather/WeatherForm";

function App() {
  return (
    <>
      <div className="">
        <div className="header">
          <h1 className="text-6xl font-bold text-amber-300 tracking-wide hover:text-cyan-900 transition-all duration-300 animate-bounce-slow [text-shadow:_2px_2px_1px_#164e63] hover:[text-shadow:_2px_2px_1px_rgb(252,211,77)]">
            Weather App
          </h1>
        </div>
        <div className="content">
          <WeatherForm />
        </div>
      </div>
    </>
  );
}

export default App;
