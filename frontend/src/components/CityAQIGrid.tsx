import React from 'react';
import AQICard from './AQICard';

interface CityData {
  cityName: string;
  aqi: number;
  temperature: number;
  humidity: number;
  landmarkIcon: string;
}

interface CityAQIGridProps {
  cities: CityData[];
}

const CityAQIGrid: React.FC<CityAQIGridProps> = ({ cities }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {cities.map((city, index) => (
        <AQICard
          key={index}
          cityName={city.cityName}
          aqi={city.aqi}
          temperature={city.temperature}
          humidity={city.humidity}
          landmarkIcon={city.landmarkIcon}
        />
      ))}
    </div>
  );
};

export default CityAQIGrid; 