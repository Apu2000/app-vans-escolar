'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Route, RoutePoint } from '@/lib/types';
import { Button } from '@/components/ui/button';

// Fix para ícones do Leaflet no Next.js
const createIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const defaultIcon = createIcon('#3B82F6');
const currentIcon = createIcon('#EAB308'); // Amarelo CAAT
const routeIcon = createIcon('#000000'); // Preto CAAT

interface RouteMapProps {
  route: Route;
  isDriver?: boolean;
  onLocationUpdate?: (pointIndex: number) => void;
}

export default function RouteMap({ route, isDriver = false, onLocationUpdate }: RouteMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Carregando mapa...</p>
      </div>
    );
  }

  const center: LatLngExpression = route.points.length > 0 
    ? [route.points[0].lat, route.points[0].lng]
    : [-15.7942, -47.8822];

  const routePath: LatLngExpression[] = route.points.map(point => [point.lat, point.lng]);

  const handleMarkerClick = (pointIndex: number) => {
    if (isDriver && onLocationUpdate) {
      onLocationUpdate(pointIndex);
    }
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-200">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Linha da rota */}
        <Polyline 
          positions={routePath} 
          color="#000000" 
          weight={4}
          opacity={0.7}
        />

        {/* Marcadores dos pontos */}
        {route.points.map((point, index) => {
          const isCurrentLocation = route.currentLocation === index;
          const icon = isCurrentLocation ? currentIcon : routeIcon;
          
          return (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={icon}
              eventHandlers={isDriver ? {
                click: () => handleMarkerClick(index)
              } : {}}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold text-black">{point.name}</h3>
                  <p className="text-sm text-gray-600">
                    {isCurrentLocation ? '📍 Van está aqui!' : `Parada ${index + 1}`}
                  </p>
                  {isDriver && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkerClick(index)}
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Atualizar Localização
                    </Button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}