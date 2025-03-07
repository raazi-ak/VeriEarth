import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  AlertTriangle, 
  Wind, 
  Filter, 
  BarChart2, 
  Activity, 
  Shield, 
  TrendingUp, 
  Bell, 
  Cloud, 
  CheckCircle, 
  Users,
  Thermometer,
  Droplets,
  Sun,
  Clock,
  Map,
  Database,
  GitBranch,
  Globe,
  AlertCircle,
  LineChart,
  PieChart,
  Calendar,
  Target,
  ShieldCheck
} from 'lucide-react';
import CityAQIGrid from '../components/CityAQIGrid';

interface PollutionEvent {
  id: string;
  type: 'oil_spill' | 'air_quality';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: 'high' | 'medium' | 'low';
  details: {
    size?: number;
    aqi?: number;
    confidence: number;
    description?: string;
    recommendations?: string[];
  };
  blockchainHash?: string;
}

// Temporary mock data
const mockEvents: PollutionEvent[] = [
  {
    id: '1',
    type: 'oil_spill',
    timestamp: '2024-03-15T10:30:00Z',
    location: { lat: 28.6139, lng: 77.2090 },
    severity: 'high',
    details: {
      size: 2.5,
      confidence: 0.95,
      description: 'Large oil spill detected near coastal area',
      recommendations: [
        'Deploy containment booms immediately',
        'Notify local authorities',
        'Begin cleanup operations'
      ]
    },
    blockchainHash: '0x123...abc'
  },
  {
    id: '2',
    type: 'air_quality',
    timestamp: '2024-03-15T11:00:00Z',
    location: { lat: 28.6248, lng: 77.2108 },
    severity: 'medium',
    details: {
      aqi: 156,
      confidence: 0.88,
      description: 'Elevated particulate matter levels detected',
      recommendations: [
        'Wear masks when outdoors',
        'Limit outdoor activities',
        'Keep windows closed'
      ]
    }
  },
  {
    id: '3',
    type: 'air_quality',
    timestamp: '2024-03-15T09:15:00Z',
    location: { lat: 28.6000, lng: 77.2000 },
    severity: 'low',
    details: {
      aqi: 85,
      confidence: 0.92,
      description: 'Moderate air quality conditions',
      recommendations: [
        'Monitor air quality updates',
        'Safe for most outdoor activities'
      ]
    }
  }
];

// Add new interfaces for trends data
interface AQITrend {
  date: string;
  value: number;
  prediction: number;
  location: string;
}

interface OilSpillTrend {
  date: string;
  count: number;
  totalSize: number;
  locations: Array<{lat: number; lng: number}>;
}

interface WeatherCorrelation {
  date: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  aqi: number;
}

// Add new mock data for trends
const mockAQITrends: AQITrend[] = [
  { date: '2024-03-01', value: 120, prediction: 125, location: 'Downtown' },
  { date: '2024-03-02', value: 135, prediction: 130, location: 'Downtown' },
  { date: '2024-03-03', value: 145, prediction: 140, location: 'Downtown' },
  { date: '2024-03-04', value: 130, prediction: 135, location: 'Downtown' },
  { date: '2024-03-05', value: 125, prediction: 130, location: 'Downtown' },
  { date: '2024-03-06', value: 140, prediction: 145, location: 'Downtown' },
  { date: '2024-03-07', value: 150, prediction: 155, location: 'Downtown' }
];

const mockOilSpillTrends: OilSpillTrend[] = [
  { date: '2024-03-01', count: 2, totalSize: 1.5, locations: [{lat: 28.6139, lng: 77.2090}] },
  { date: '2024-03-02', count: 1, totalSize: 0.8, locations: [{lat: 28.6248, lng: 77.2108}] },
  { date: '2024-03-03', count: 3, totalSize: 2.1, locations: [{lat: 28.6000, lng: 77.2000}] },
  { date: '2024-03-04', count: 0, totalSize: 0, locations: [] },
  { date: '2024-03-05', count: 2, totalSize: 1.2, locations: [{lat: 28.6139, lng: 77.2090}] },
  { date: '2024-03-06', count: 1, totalSize: 0.5, locations: [{lat: 28.6248, lng: 77.2108}] },
  { date: '2024-03-07', count: 2, totalSize: 1.8, locations: [{lat: 28.6000, lng: 77.2000}] }
];

const mockWeatherCorrelations: WeatherCorrelation[] = [
  { date: '2024-03-01', temperature: 28, windSpeed: 12, precipitation: 0, aqi: 120 },
  { date: '2024-03-02', temperature: 30, windSpeed: 8, precipitation: 0, aqi: 135 },
  { date: '2024-03-03', temperature: 32, windSpeed: 5, precipitation: 0, aqi: 145 },
  { date: '2024-03-04', temperature: 25, windSpeed: 15, precipitation: 10, aqi: 130 },
  { date: '2024-03-05', temperature: 27, windSpeed: 10, precipitation: 5, aqi: 125 },
  { date: '2024-03-06', temperature: 29, windSpeed: 7, precipitation: 0, aqi: 140 },
  { date: '2024-03-07', temperature: 31, windSpeed: 6, precipitation: 0, aqi: 150 }
];

// Update the mock cities data with correct file extensions
const mockCities = [
  {
    cityName: "Gulf of Mexico",
    aqi: 65,
    temperature: 28,
    humidity: 75,
    landmarkIcon: "/citicons/gulf of mexico.png"
  },
  {
    cityName: "Surat",
    aqi: 85,
    temperature: 32,
    humidity: 70,
    landmarkIcon: "/citicons/surat.png"
  },
  {
    cityName: "Delhi",
    aqi: 150,
    temperature: 35,
    humidity: 65,
    landmarkIcon: "/citicons/delhi.png"
  },
  {
    cityName: "Suez Canal",
    aqi: 45,
    temperature: 25,
    humidity: 80,
    landmarkIcon: "/citicons/suez canal.webp"
  }
];

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Add chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#9CA3AF',
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: '#374151',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    x: {
      grid: {
        color: '#374151',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
  },
};

// Fix missing marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component to handle clicks on the map and update coordinates
function ClickHandler({ setCoordinates }: { setCoordinates: React.Dispatch<React.SetStateAction<[number, number][]>> }) {
  useMapEvents({
    click(e) {
      setCoordinates((prev: [number, number][]) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
}

const Dashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<PollutionEvent | null>(null);
  const [filter, setFilter] = useState<'all' | 'oil_spill' | 'air_quality'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'tasks'>('overview');
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const filteredEvents = mockEvents.filter(event => 
    filter === 'all' ? true : event.type === filter
  );

  const stats = {
    total: mockEvents.length,
    highSeverity: mockEvents.filter(e => e.severity === 'high').length,
    oilSpills: mockEvents.filter(e => e.type === 'oil_spill').length,
    airQuality: mockEvents.filter(e => e.type === 'air_quality').length
  };

  // Mock data for new features
  const weatherData = {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    uvIndex: 7,
    forecast: [
      { day: 'Today', temp: 28, condition: 'Sunny' },
      { day: 'Tomorrow', temp: 26, condition: 'Partly Cloudy' },
      { day: 'Wed', temp: 25, condition: 'Rainy' }
    ]
  };

  const recentActivity = [
    { id: 1, type: 'event', message: 'New oil spill detected in coastal area', time: '2 hours ago' },
    { id: 2, type: 'alert', message: 'High AQI warning for downtown area', time: '4 hours ago' },
    { id: 3, type: 'update', message: 'Cleanup operation completed', time: '6 hours ago' },
    { id: 4, type: 'task', message: 'New report generated', time: '8 hours ago' }
  ];

  const tasks = [
    { id: 1, title: 'Review latest pollution report', status: 'pending', priority: 'high' },
    { id: 2, title: 'Schedule team meeting', status: 'completed', priority: 'medium' },
    { id: 3, title: 'Update monitoring equipment', status: 'pending', priority: 'high' },
    { id: 4, title: 'Prepare presentation for stakeholders', status: 'pending', priority: 'medium' }
  ];

  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Environmental Scientist', status: 'online' },
    { id: 2, name: 'Jane Smith', role: 'Data Analyst', status: 'offline' },
    { id: 3, name: 'Mike Johnson', role: 'Field Researcher', status: 'online' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trends'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Total Events</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">High Severity</p>
                    <p className="text-2xl font-bold text-white">{stats.highSeverity}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500/10 rounded-full">
                    <Shield className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Oil Spills</p>
                    <p className="text-2xl font-bold text-white">{stats.oilSpills}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <Wind className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Air Quality Alerts</p>
                    <p className="text-2xl font-bold text-white">{stats.airQuality}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather and Map Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Weather Card */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Weather Conditions</h3>
                  <Cloud className="h-6 w-6 text-blue-400" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-gray-300">Temperature</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{weatherData.temperature}°C</p>
                    <p className="text-sm text-gray-400 mt-1">Feels like 30°C</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-gray-300">Humidity</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{weatherData.humidity}%</p>
                    <p className="text-sm text-gray-400 mt-1">Dew point: 20°C</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-gray-300">Wind Speed</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{weatherData.windSpeed} km/h</p>
                    <p className="text-sm text-gray-400 mt-1">Direction: NE</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Sun className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-gray-300">UV Index</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{weatherData.uvIndex}</p>
                    <p className="text-sm text-gray-400 mt-1">High Risk</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Visibility</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-white">10 km</span>
                      <span className="text-sm text-green-400">Good</span>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Cloud Cover</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-white">25%</span>
                      <span className="text-sm text-blue-400">Partly Cloudy</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">3-Day Forecast</h4>
                  <div className="space-y-2">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between text-gray-300 bg-gray-700 p-3 rounded-lg">
                        <span className="font-medium">{day.day}</span>
                        <div className="flex items-center space-x-4">
                          <span>{day.temp}°C</span>
                          <span className="text-sm">{day.condition}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-gray-800 rounded-lg p-4 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Interactive Map</h3>
                <p className="text-sm text-gray-300 mb-4">Click on the map to add points. A polygon will be drawn automatically.</p>
                <MapContainer
                  center={[28.6139, 77.2090]}
                  zoom={13}
                  style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
                  className="w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <ClickHandler setCoordinates={setCoordinates} />

                  {/* Render markers for clicked points */}
                  {coordinates.map((coord, index) => (
                    <Marker key={index} position={coord} icon={customIcon}>
                      <Popup>
                        Point {index + 1}: {coord[0].toFixed(5)}, {coord[1].toFixed(5)}
                      </Popup>
                    </Marker>
                  ))}

                  {/* Draw the polygon */}
                  {coordinates.length > 2 && <Polygon positions={coordinates} color="blue" />}
                </MapContainer>

                {/* Display clicked coordinates */}
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Clicked Coordinates</h3>
                  {coordinates.length === 0 ? (
                    <p className="text-gray-300">No points added yet.</p>
                  ) : (
                    <ul className="space-y-1">
                      {coordinates.map((coord, index) => (
                        <li key={index} className="text-gray-300">
                          Point {index + 1}: {coord[0].toFixed(5)}, {coord[1].toFixed(5)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Global Air Quality Index */}
            <div className="col-span-full">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Global Air Quality Index</h3>
                <CityAQIGrid cities={mockCities} />
              </div>
            </div>

            {/* Recent Activity and Team Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <Bell className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      </div>
                      <div>
                        <p className="text-gray-300">{activity.message}</p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <p className="text-gray-300">{member.name}</p>
                          <p className="text-sm text-gray-400">{member.role}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{member.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            {/* Air Quality Trends Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Air Quality Trends</h2>
                <Wind className="h-6 w-6 text-blue-400" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Historical AQI Data</h3>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: mockAQITrends.map(trend => format(new Date(trend.date), 'MMM dd')),
                        datasets: [
                          {
                            label: 'Actual AQI',
                            data: mockAQITrends.map(trend => trend.value),
                            borderColor: '#60A5FA',
                            backgroundColor: 'rgba(96, 165, 250, 0.1)',
                            fill: true,
                          },
                          {
                            label: 'Predicted AQI',
                            data: mockAQITrends.map(trend => trend.prediction),
                            borderColor: '#34D399',
                            borderDash: [5, 5],
                            fill: false,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Predictions</h3>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: mockAQITrends.map(trend => format(new Date(trend.date), 'MMM dd')),
                        datasets: [
                          {
                            label: 'Predicted AQI',
                            data: mockAQITrends.map(trend => trend.prediction),
                            borderColor: '#34D399',
                            backgroundColor: 'rgba(52, 211, 153, 0.1)',
                            fill: true,
                          },
                        ],
                      }}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            display: true,
                            text: '7-Day Forecast',
                            color: '#9CA3AF',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Weekly Average</h4>
                  <p className="text-2xl font-bold text-white">135</p>
                  <p className="text-sm text-gray-400">AQI</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Monthly Trend</h4>
                  <p className="text-2xl font-bold text-white">+12%</p>
                  <p className="text-sm text-gray-400">vs Last Month</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Predicted Peak</h4>
                  <p className="text-2xl font-bold text-white">160</p>
                  <p className="text-sm text-gray-400">Next 24 Hours</p>
                </div>
              </div>
            </div>

            {/* Oil Spill Analysis Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Oil Spill Analysis</h2>
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Spill Frequency</h3>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: mockOilSpillTrends.map(trend => format(new Date(trend.date), 'MMM dd')),
                        datasets: [
                          {
                            label: 'Number of Spills',
                            data: mockOilSpillTrends.map(trend => trend.count),
                            backgroundColor: '#EF4444',
                            borderColor: '#DC2626',
                          },
                          {
                            label: 'Total Area (km²)',
                            data: mockOilSpillTrends.map(trend => trend.totalSize),
                            backgroundColor: '#F59E0B',
                            borderColor: '#D97706',
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Impact Assessment</h3>
                  <div className="h-64">
                    <Pie
                      data={{
                        labels: ['Marine Life', 'Coastal Areas', 'Water Quality', 'Economic Impact'],
                        datasets: [
                          {
                            data: [35, 25, 20, 20],
                            backgroundColor: [
                              '#EF4444',
                              '#F59E0B',
                              '#60A5FA',
                              '#34D399',
                            ],
                            borderColor: [
                              '#DC2626',
                              '#D97706',
                              '#3B82F6',
                              '#10B981',
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            position: 'right' as const,
                            labels: {
                              color: '#9CA3AF',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Total Spills</h4>
                  <p className="text-2xl font-bold text-white">11</p>
                  <p className="text-sm text-gray-400">This Month</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Total Area</h4>
                  <p className="text-2xl font-bold text-white">8.9</p>
                  <p className="text-sm text-gray-400">km² Affected</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Risk Level</h4>
                  <p className="text-2xl font-bold text-white">High</p>
                  <p className="text-sm text-gray-400">Current Status</p>
                </div>
              </div>
            </div>

            {/* Heatmaps & Geospatial Insights */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Geospatial Analysis</h2>
                <Map className="h-6 w-6 text-green-400" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Pollution Hotspots</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <Globe className="h-8 w-8 mr-2" />
                    Interactive Heatmap
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Zones</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <Target className="h-8 w-8 mr-2" />
                    AI Risk Assessment Map
                  </div>
                </div>
              </div>
            </div>

            {/* Climate & Weather Correlations */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Weather Correlations</h2>
                <Cloud className="h-6 w-6 text-blue-400" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Weather Impact Analysis</h3>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: mockWeatherCorrelations.map(data => format(new Date(data.date), 'MMM dd')),
                        datasets: [
                          {
                            label: 'Temperature (°C)',
                            data: mockWeatherCorrelations.map(data => data.temperature),
                            borderColor: '#EF4444',
                            yAxisID: 'y',
                          },
                          {
                            label: 'AQI',
                            data: mockWeatherCorrelations.map(data => data.aqi),
                            borderColor: '#60A5FA',
                            yAxisID: 'y1',
                          },
                        ],
                      }}
                      options={{
                        ...chartOptions,
                        scales: {
                          y: {
                            type: 'linear' as const,
                            display: true,
                            position: 'left' as const,
                            title: {
                              display: true,
                              text: 'Temperature (°C)',
                              color: '#9CA3AF',
                            },
                          },
                          y1: {
                            type: 'linear' as const,
                            display: true,
                            position: 'right' as const,
                            title: {
                              display: true,
                              text: 'AQI',
                              color: '#9CA3AF',
                            },
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Extreme Events</h3>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: ['Heat Waves', 'Storms', 'Floods', 'Droughts'],
                        datasets: [
                          {
                            label: 'Number of Events',
                            data: [5, 3, 2, 1],
                            backgroundColor: [
                              '#EF4444',
                              '#60A5FA',
                              '#34D399',
                              '#F59E0B',
                            ],
                            borderColor: [
                              '#DC2626',
                              '#3B82F6',
                              '#10B981',
                              '#D97706',
                            ],
                          },
                        ],
                      }}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            display: true,
                            text: 'Last 30 Days',
                            color: '#9CA3AF',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain-Verified Reports */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Blockchain Verification</h2>
                <GitBranch className="h-6 w-6 text-purple-400" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Verified Data</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">AQI Records</span>
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Oil Spill Reports</span>
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Weather Data</span>
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Compliance Reports</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Environmental Standards</span>
                      <span className="text-green-400">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Data Accuracy</span>
                      <span className="text-green-400">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Verification Rate</span>
                      <span className="text-green-400">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulatory & Policy Insights */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Policy Insights</h2>
                <Database className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Regional Compliance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">North Region</span>
                      <span className="text-green-400">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">South Region</span>
                      <span className="text-yellow-400">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">East Region</span>
                      <span className="text-red-400">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">West Region</span>
                      <span className="text-green-400">92%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                      <span className="text-gray-300">Implement stricter emission controls in industrial zones</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                      <span className="text-gray-300">Enhance monitoring in high-risk coastal areas</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                      <span className="text-gray-300">Develop emergency response protocols for extreme weather events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Tasks & Action Items</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className={`h-5 w-5 ${
                      task.status === 'completed' ? 'text-green-400' : 'text-gray-400'
                    }`} />
                    <div>
                      <p className="text-gray-300">{task.title}</p>
                      <p className="text-sm text-gray-400">Priority: {task.priority}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'completed' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-yellow-900 text-yellow-200'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;