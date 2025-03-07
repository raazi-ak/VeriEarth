export interface PollutionEvent {
  id: string;
  type: 'oil_spill' | 'air_quality';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: 'low' | 'medium' | 'high';
  details: {
    size?: number; // For oil spills (in sq km)
    aqi?: number; // For air quality
    confidence: number;
  };
  blockchainHash?: string;
}