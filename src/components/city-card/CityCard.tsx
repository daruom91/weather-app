import React from "react";
import type { City } from "../../models/City";

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full h-48 object-cover" src={city.image} alt={`Weather in ${city.name}`} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Weather in {city.name}</div>
        <p className="text-gray-700 text-base">
          {city.country}, {city.state}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {/* {city.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{tag}
          </span>
        ))} */}
      </div>
    </div>
  );
};

export default CityCard;
