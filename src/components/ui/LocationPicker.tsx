'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';

interface LocationData {
  address: string;
  city: string;
  zipCode: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: {
    address: string;
    city: string;
    zipCode: string;
    lat: string;
    lng: string;
  };
  onChange: (data: LocationData) => void;
}

const DEFAULT_CENTER = { lat: 44.4268, lng: 26.1025 }; // Bucharest, Romania
const DEFAULT_ZOOM = 7;
const SELECTED_ZOOM = 16;

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value.address || '');
  const [isLocating, setIsLocating] = useState(false);

  // Parse address components from Google's geocoder result
  const parseAddressComponents = useCallback((components: google.maps.GeocoderAddressComponent[]): { city: string; zipCode: string } => {
    let city = '';
    let zipCode = '';

    for (const comp of components) {
      if (comp.types.includes('locality')) {
        city = comp.long_name;
      }
      if (comp.types.includes('administrative_area_level_1') && !city) {
        city = comp.long_name;
      }
      if (comp.types.includes('postal_code')) {
        zipCode = comp.long_name;
      }
    }

    return { city, zipCode };
  }, []);

  // Reverse geocode from lat/lng
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        const result = response.results[0];
        const { city, zipCode } = parseAddressComponents(result.address_components);
        const address = result.formatted_address;
        setInputValue(address);
        onChange({ address, city, zipCode, lat, lng });
      }
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    }
  }, [onChange, parseAddressComponents]);

  // Initialize Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local');
      return;
    }

    setOptions({
      key: apiKey,
      v: 'weekly',
    });

    const init = async () => {
      try {
        await importLibrary('maps');
        await importLibrary('marker');
        await importLibrary('places');
        await importLibrary('geocoding');

        if (!mapRef.current) return;

        const initialCenter = value.lat && value.lng
          ? { lat: parseFloat(value.lat), lng: parseFloat(value.lng) }
          : DEFAULT_CENTER;

        const initialZoom = value.lat && value.lng ? SELECTED_ZOOM : DEFAULT_ZOOM;

        // Create map
        const map = new google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapId: 'IMOOB_LOCATION_PICKER',
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });
        mapInstanceRef.current = map;

        // Create draggable marker
        const markerContent = document.createElement('div');
        markerContent.innerHTML = `
          <div style="
            display: flex; align-items: center; justify-content: center;
            width: 44px; height: 44px;
            background: linear-gradient(135deg, #139E69, #0e704a);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 20px rgba(19, 158, 105, 0.4);
            border: 3px solid white;
          ">
            <svg style="transform: rotate(45deg); width: 20px; height: 20px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: initialCenter,
          gmpDraggable: true,
          content: markerContent,
        });
        markerRef.current = marker;

        // Only show marker if we have a position
        if (!value.lat || !value.lng) {
          marker.map = null;
        }

        // Listen for marker drag end
        marker.addListener('dragend', () => {
          const pos = marker.position;
          if (pos) {
            const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
            const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;
            reverseGeocode(lat, lng);
          }
        });

        // Setup Autocomplete on the input
        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            fields: ['formatted_address', 'geometry', 'address_components'],
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry?.location) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // Move map and marker
            map.setCenter({ lat, lng });
            map.setZoom(SELECTED_ZOOM);
            marker.position = { lat, lng };
            marker.map = map;

            // Parse address components
            const address = place.formatted_address || '';
            const { city, zipCode } = parseAddressComponents(place.address_components || []);

            setInputValue(address);
            onChange({ address, city, zipCode, lat, lng });
          });

          autocompleteRef.current = autocomplete;
        }

        setIsMapLoaded(true);
      } catch (err) {
        console.error('Failed to load Google Maps:', err);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use browser geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(SELECTED_ZOOM);
          markerRef.current.position = { lat, lng };
          markerRef.current.map = mapInstanceRef.current;
        }

        reverseGeocode(lat, lng);
        setIsLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-5">
      {/* Search Input */}
      <div>
        <h3 className="text-[#f25c1a] font-bold text-lg mb-4">Localizare</h3>
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <input
            ref={inputRef}
            type="text"
            className="w-full h-14 pl-12 pr-14 border-2 border-gray-200 rounded-xl bg-white text-[#333] focus:ring-2 focus:ring-[#139E69]/20 focus:border-[#139E69] font-medium transition-all text-[15px]"
            placeholder="Caută adresa completă..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {/* Locate Me button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-[#139E69]/10 text-gray-400 hover:text-[#139E69] transition-all border border-gray-100"
            title="Localizează-mă"
          >
            {isLocating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Navigation size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Info Banner - shown when address is selected */}
      {value.city && (
        <div className="flex items-center gap-3 p-4 bg-[#e8f5ee] rounded-xl border border-[#139E69]/20">
          <div className="w-8 h-8 rounded-full bg-[#139E69]/10 flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-[#139E69]" />
          </div>
          <p className="text-sm font-semibold text-[#139E69]">
            Localizare detectată în <span className="font-black">{value.city}</span>
            {value.zipCode && <span> • Cod poștal: <span className="font-black">{value.zipCode}</span></span>}
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-10 gap-3">
            <Loader2 size={32} className="text-[#139E69] animate-spin" />
            <p className="text-sm font-semibold text-gray-400">Se încarcă harta...</p>
          </div>
        )}
        <div
          ref={mapRef}
          className="w-full h-[350px] md:h-[400px]"
        />
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
        <MapPin size={14} />
        Introdu adresa și selectează din listă · Mută pinul pentru ajustare fină
      </p>

      {/* Hidden city/zipCode display (read-only feedback) */}
      {value.city && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-2">Oraș</h3>
            <div className="h-12 px-4 flex items-center border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-bold text-[13px]">
              {value.city}
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-2">Cod Poștal</h3>
            <div className="h-12 px-4 flex items-center border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-bold text-[13px]">
              {value.zipCode || '—'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
