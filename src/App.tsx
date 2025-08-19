import "./App.css";
import WeatherForm from "./components/weather/WeatherForm";

function App() {
  return (
    <>
      <div className="">
        <div className="header">
          <h1 className="text-4xl text-center font-bold text-white tracking-wide hover:text-amber-200 transition-all duration-300 animate-bounce-slow [text-shadow:_2px_2px_1px_#164e63] ">
            Tempéris
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
