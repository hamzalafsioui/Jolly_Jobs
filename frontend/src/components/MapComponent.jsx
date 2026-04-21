import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// default marker icon issue in Leaflet + Repackagers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to update map view when coordinates change
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({ address, latitude, longitude, cityName }) => {
  const [geocodedCenter, setGeocodedCenter] = useState(null);
  const [geoError, setGeoError] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasCoordinates = !!(latitude && longitude);

  // Effect to geocode city name if coordinates are missing (using Nominatim)
  useEffect(() => {
    if (!hasCoordinates && cityName) {
      setLoading(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setGeocodedCenter({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            });
            setGeoError(false);
          } else {
            setGeoError(true);
          }
        })
        .catch(err => {
          console.error("Leaflet Geocoding error:", err);
          setGeoError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [hasCoordinates, cityName]);

  const center = useMemo(() => {
    if (hasCoordinates) {
      return { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    }
    return geocodedCenter;
  }, [latitude, longitude, hasCoordinates, geocodedCenter]);

  const zoom = hasCoordinates ? 15 : 12;

  // Fallback for when NO location info at all is available OR geocoding failed
  if ((!hasCoordinates && !cityName) || geoError) {
    return (
      <div className="w-full h-full bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center border border-slate-100 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-500 mb-4 border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h4 className="text-lg font-bold text-jolly-navy">{cityName || "General Location"}</h4>
            <p className="text-xs text-jolly-slate mt-1 font-medium italic opacity-70">
              {geoError ? "Could not load map for this city" : "Precise location not provided"}
            </p>
        </div>
      </div>
    );
  }

  if (loading || (!hasCoordinates && cityName && !geocodedCenter)) {
    return (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl">
        <span className="text-slate-400 font-medium text-xs">Loading Free Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-slate-100 relative z-0">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />
        {hasCoordinates && (
          <Marker position={[center.lat, center.lng]}>
            <Popup>
              <div className="text-xs font-bold text-jolly-navy">{address || cityName}</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default React.memo(MapComponent);
