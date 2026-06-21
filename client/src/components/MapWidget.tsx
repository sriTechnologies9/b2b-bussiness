import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet when compiled in build pipelines
// @ts-ignore
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapWidgetProps {
  latitude: number;
  longitude: number;
  businessName: string;
  height?: string;
}

export const MapWidget: React.FC<MapWidgetProps> = ({
  latitude,
  longitude,
  businessName,
  height = '300px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 14,
        zoomControl: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);

      // Add marker
      markerInstanceRef.current = L.marker([latitude, longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${businessName}</b>`)
        .openPopup();
    } else {
      // Map is already initialized, update center and marker location
      mapInstanceRef.current.setView([latitude, longitude], 14);

      if (markerInstanceRef.current) {
        markerInstanceRef.current.setLatLng([latitude, longitude]);
        markerInstanceRef.current.setPopupContent(`<b>${businessName}</b>`);
      } else {
        markerInstanceRef.current = L.marker([latitude, longitude])
          .addTo(mapInstanceRef.current)
          .bindPopup(`<b>${businessName}</b>`)
          .openPopup();
      }
    }

    // Cleanup map on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, businessName]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-inner border border-slate-800 bg-slate-900">
      <div 
        ref={mapContainerRef} 
        style={{ height }} 
        className="w-full h-full z-10" 
      />
    </div>
  );
};
