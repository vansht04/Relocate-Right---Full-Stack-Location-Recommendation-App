import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Recommendation } from '../backend';

interface MapViewProps {
  currentLocation: string;
  recommendations: Recommendation[];
}

// Declare Leaflet types for global usage
declare global {
  interface Window {
    L: any;
  }
}

export default function MapView({ currentLocation, recommendations }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS and JS from CDN
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        initializeMap();
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Calculate center point from recommendations
      const avgLat =
        recommendations.reduce((sum, rec) => sum + rec.area.coordinates.latitude, 0) /
        recommendations.length;
      const avgLng =
        recommendations.reduce((sum, rec) => sum + rec.area.coordinates.longitude, 0) /
        recommendations.length;

      // Initialize map
      const map = window.L.map(mapRef.current).setView([avgLat, avgLng], 5);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create custom icons
      const currentLocationIcon = window.L.icon({
        iconUrl: '/assets/generated/current-location-pin-transparent.dim_64x64.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const recommendationIcon = window.L.icon({
        iconUrl: '/assets/generated/recommendation-pin-transparent.dim_64x64.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Add markers for recommendations
      recommendations.forEach((rec, index) => {
        const marker = window.L.marker(
          [rec.area.coordinates.latitude, rec.area.coordinates.longitude],
          { icon: recommendationIcon }
        ).addTo(map);

        const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
              ${rankEmoji} ${rec.area.name}
            </div>
            <div style="font-size: 20px; font-weight: bold; color: #0066cc; margin-bottom: 8px;">
              ${rec.matchPercentage.toFixed(1)}% Match
            </div>
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
              ${rec.area.lifestyleDescription}
            </div>
            <div style="font-size: 12px; color: #888;">
              Population: ${rec.area.population.toLocaleString()}
            </div>
          </div>
        `);
      });

      // Fit bounds to show all markers
      if (recommendations.length > 0) {
        const bounds = window.L.latLngBounds(
          recommendations.map((rec) => [
            rec.area.coordinates.latitude,
            rec.area.coordinates.longitude,
          ])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [recommendations]);

  return (
    <Card className="overflow-hidden border-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">Location Map</CardTitle>
        <CardDescription>
          Explore your recommended areas on the map
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={mapRef}
          className="w-full h-[500px] lg:h-[600px]"
          style={{ background: '#f0f0f0' }}
        />
      </CardContent>
    </Card>
  );
}
