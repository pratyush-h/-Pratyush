import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { CycloneTelemetry, EvacuationShelter } from '../types/cyclone';
import { OSDMA_SHELTERS } from '../data/shelters';
import { Navigation } from 'lucide-react';

interface Props {
  telemetry: CycloneTelemetry;
  selectedShelterId?: string;
  onSelectShelter?: (shelter: EvacuationShelter) => void;
}

export const InteractiveCycloneMap: React.FC<Props> = ({
  telemetry,
  onSelectShelter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy map instance if re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center between Cyclone Eye and Odisha Coast
    const map = L.map(mapContainerRef.current, {
      center: [20.0, 86.2],
      zoom: 7,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Dark styled basemap tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO & OSDMA',
      maxZoom: 18,
    }).addTo(map);

    // 1. Draw Odisha Coast Line Warning Buffer (Red/Amber coastal strip)
    const coastalPolygon: [number, number][] = [
      [19.0, 84.8], // Gopalpur
      [19.8, 85.8], // Puri
      [20.26, 86.67], // Paradip
      [20.79, 86.91], // Dhamra
      [21.47, 87.01], // Chandipur
      [21.6, 87.3], // Digha / Border
    ];

    L.polyline(coastalPolygon, {
      color: '#ef4444',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.8,
    }).addTo(map).bindTooltip('Odisha High Risk Storm Surge Coastal Buffer', { permanent: false });

    // 2. Plot Cyclone Eye Position & Pulsing Red Circle
    const cycloneIcon = L.divIcon({
      className: 'custom-cyclone-marker',
      html: `
        <div class="relative flex items-center justify-center w-12 h-12">
          <span class="absolute w-12 h-12 rounded-full bg-red-600/40 animate-ping"></span>
          <span class="absolute w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-extrabold text-xs">🌀</span>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const stormMarker = L.marker([telemetry.latitude, telemetry.longitude], { icon: cycloneIcon }).addTo(map);
    stormMarker.bindPopup(`
      <div style="color: #0f172a; padding: 4px;">
        <strong style="font-size: 14px; color: #dc2626;">${telemetry.systemName}</strong><br/>
        <b>Central Pressure:</b> ${telemetry.centralPressureHpa} hPa<br/>
        <b>Max Winds:</b> ${telemetry.maxWindSpeedKmph} km/h (Gusts ${telemetry.gustWindSpeedKmph} km/h)<br/>
        <b>Distance to Shore:</b> ${telemetry.distanceToCoastKm} km<br/>
        <b>Heading:</b> ${telemetry.movementHeading}
      </div>
    `);

    // 3. Projected Track Line & Cone of Uncertainty
    const trackPoints: [number, number][] = [
      [telemetry.latitude, telemetry.longitude],
      [
        (telemetry.latitude + telemetry.forecastLandfallCoords[0]) / 2,
        (telemetry.longitude + telemetry.forecastLandfallCoords[1]) / 2,
      ],
      telemetry.forecastLandfallCoords,
    ];

    L.polyline(trackPoints, {
      color: '#38bdf8',
      weight: 3,
      opacity: 0.9,
    }).addTo(map);

    // Landfall Marker
    const landfallIcon = L.divIcon({
      className: 'custom-landfall-marker',
      html: `
        <div class="flex items-center justify-center px-2 py-1 bg-amber-500 text-black font-extrabold text-[10px] rounded-md shadow-lg border border-black">
          🎯 LANDFALL
        </div>
      `,
      iconSize: [70, 24],
      iconAnchor: [35, 12],
    });

    L.marker(telemetry.forecastLandfallCoords, { icon: landfallIcon })
      .addTo(map)
      .bindTooltip(`Expected Landfall: ${telemetry.forecastLandfallPoint}`, { permanent: true, direction: 'top' });

    // 4. Plot OSDMA Shelter Markers
    OSDMA_SHELTERS.forEach((shelter) => {
      const shelterIcon = L.divIcon({
        className: 'custom-shelter-marker',
        html: `
          <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[11px] font-bold">
            🏠
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const sMarker = L.marker([shelter.latitude, shelter.longitude], { icon: shelterIcon }).addTo(map);
      sMarker.bindPopup(`
        <div style="color: #0f172a; padding: 4px; min-width: 180px;">
          <strong style="color: #059669; font-size: 13px;">${shelter.name}</strong><br/>
          <small style="color: #64748b;">${shelter.nameOdia}</small><br/>
          <b>District:</b> ${shelter.district} (${shelter.block})<br/>
          <b>Capacity:</b> ${shelter.capacityPersons} Persons<br/>
          <b>Helpline:</b> <a href="tel:${shelter.contactPhone}" style="color: #0284c7; font-weight: bold;">${shelter.contactPhone}</a><br/>
          <button id="btn-shelter-${shelter.id}" style="margin-top: 6px; padding: 4px 8px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">Select Shelter</button>
        </div>
      `);

      sMarker.on('popupopen', () => {
        const btn = document.getElementById(`btn-shelter-${shelter.id}`);
        if (btn && onSelectShelter) {
          btn.onclick = () => onSelectShelter(shelter);
        }
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [telemetry]);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-white text-xs space-y-1 shadow-lg">
        <div className="flex items-center gap-2 font-bold text-cyan-400">
          <Navigation className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Odisha GIS Cyclone & Shelter Radar</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Storm Eye
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Landfall Target
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> OSDMA Shelter
          </span>
        </div>
      </div>

      {/* Leaflet map container */}
      <div ref={mapContainerRef} className="w-full h-full z-0"></div>
    </div>
  );
};
