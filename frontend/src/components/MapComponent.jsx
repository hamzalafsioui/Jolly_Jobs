import React, { useMemo, useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = ({ address, latitude, longitude, cityName }) => {
  const [geocodedCenter, setGeocodedCenter] = useState(null);
  const [geoError, setGeoError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const hasCoordinates = !!(latitude && longitude);

  
  const styleUrl = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

  // Effect to geocode city name if coordinates are missing
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
          console.error("Geocoding error:", err);
          setGeoError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [hasCoordinates, cityName]);

  const center = useMemo(() => {
    if (hasCoordinates) {
      return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    }
    if (geocodedCenter) {
        return { latitude: geocodedCenter.lat, longitude: geocodedCenter.lng };
    }
    return null;
  }, [latitude, longitude, hasCoordinates, geocodedCenter]);

  const initialZoom = hasCoordinates ? 14 : 11;

  const [viewState, setViewState] = useState({
    latitude: center?.latitude || 0,
    longitude: center?.longitude || 0,
    zoom: initialZoom
  });

  // Sync viewState when center or zoom props change
  useEffect(() => {
    if (center) {
      setViewState({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: initialZoom
      });
    }
  }, [center, initialZoom]);

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
        <span className="text-slate-400 font-medium text-xs">Loading Map...</span>
      </div>
    );
  }

  if (!center) return null;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-slate-100 relative z-0">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={styleUrl}
        attributionControl={false}
      >

        <NavigationControl position="top-right" />
        
        {hasCoordinates && (
          <>
            <Marker 
              longitude={center.longitude} 
              latitude={center.latitude} 
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setShowPopup(true);
              }}
            >
              <div className="text-indigo-600 cursor-pointer drop-shadow-md hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
              </div>
            </Marker>

            {showPopup && (
              <Popup
                longitude={center.longitude}
                latitude={center.latitude}
                anchor="top"
                offset={5}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
              >
                <div className="text-xs font-bold text-jolly-navy p-1">{address || cityName}</div>
              </Popup>
            )}
          </>
        )}
      </Map>
    </div>
  );
};

export default React.memo(MapComponent);


