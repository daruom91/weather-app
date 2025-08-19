import "./App.css";
import WeatherForm from "./components/weather/WeatherForm";

function App() {
  return (
    <>
      <div className="">
        <div className="header">
          <h1 className="text-5xl text-center font-bold text-amber-200 tracking-wide hover:text-white transition-all duration-300 animate-bounce-slow [text-shadow:_2px_2px_1px_#164e63] ">
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
