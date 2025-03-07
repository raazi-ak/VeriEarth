import React from 'react';

interface AQICardProps {
  cityName: string;
  aqi: number;
  temperature: number;
  humidity: number;
  landmarkIcon: string;
}

const AQICard: React.FC<AQICardProps> = ({
  cityName,
  aqi,
  temperature,
  humidity,
  landmarkIcon
}) => {
  const getAQIColor = (aqi: number) => {
    if (aqi < 50) return 'text-green-400';
    if (aqi < 100) return 'text-yellow-400';
    if (aqi < 150) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
      <div className="flex items-start space-x-6">
        {/* Image Container */}
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={landmarkIcon}
            alt={`${cityName} landmark`}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error(`Error loading image for ${cityName}`);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">{cityName}</h3>
            <div className={`text-3xl font-bold ${getAQIColor(aqi)}`}>
              {aqi}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Temperature</p>
              <p className="text-lg font-semibold text-white">{temperature}°C</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Humidity</p>
              <p className="text-lg font-semibold text-white">{humidity}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQICard; 