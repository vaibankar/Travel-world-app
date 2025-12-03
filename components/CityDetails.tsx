import React, { useEffect, useState, useRef } from 'react';
import { getCityDetails, getNearbyPlaces } from '../services/geminiService';
import { TravelPackage, ItineraryItem, Place } from '../types';
import { 
  ArrowLeft, Calendar, DollarSign, MapPin, Clock, Star, CheckCircle, Heart,
  Plane, Landmark, Utensils, ShoppingBag, Waves, Mountain, Camera, Pencil, Plus, Trash2, Save, X,
  Car, Bed, Music, Moon, Sun, Map as MapIcon, Crosshair, Search, Radar
} from 'lucide-react';

interface CityDetailsProps {
  city: string;
  initialData?: TravelPackage;
  onBack: () => void;
  onSave: (pkg: TravelPackage) => void;
  onUpdate?: (pkg: TravelPackage) => void;
  isSaved: boolean;
}

const getDayIcon = (activity: string, day: number) => {
  const text = activity.toLowerCase();
  
  // Arrival / Departure
  if (day === 1 && (text.includes('arriv') || text.includes('land') || text.includes('welcome') || text.includes('check-in'))) return <Plane size={18} />;
  if (text.includes('depart') || text.includes('fly') || text.includes('airport') || text.includes('check-out') || text.includes('leave')) return <Plane size={18} className="-rotate-45" />;
  
  // Transport
  if (text.includes('drive') || text.includes('transfer') || text.includes('taxi') || text.includes('bus') || text.includes('ride') || text.includes('train')) return <Car size={18} />;

  // Accommodation / Relaxation
  if (text.includes('hotel') || text.includes('resort') || text.includes('relax') || text.includes('spa') || text.includes('leisure') || text.includes('check in')) return <Bed size={18} />;
  
  // Culture & History
  if (text.includes('museum') || text.includes('history') || text.includes('culture') || text.includes('temple') || text.includes('art') || text.includes('palace') || text.includes('castle') || text.includes('monument') || text.includes('church') || text.includes('cathedral')) return <Landmark size={18} />;
  
  // Food & Drink
  if (text.includes('food') || text.includes('dinner') || text.includes('lunch') || text.includes('breakfast') || text.includes('tasting') || text.includes('eat') || text.includes('restaurant') || text.includes('cafe') || text.includes('bar') || text.includes('wine')) return <Utensils size={18} />;
  
  // Shopping
  if (text.includes('shop') || text.includes('market') || text.includes('mall') || text.includes('souvenir') || text.includes('store') || text.includes('boutique')) return <ShoppingBag size={18} />;
  
  // Nature & Water
  if (text.includes('beach') || text.includes('swim') || text.includes('water') || text.includes('cruise') || text.includes('boat') || text.includes('island') || text.includes('lake') || text.includes('sea') || text.includes('ocean') || text.includes('river')) return <Waves size={18} />;
  if (text.includes('hike') || text.includes('mountain') || text.includes('trek') || text.includes('nature') || text.includes('park') || text.includes('forest') || text.includes('jungle') || text.includes('garden') || text.includes('zoo')) return <Mountain size={18} />;
  
  // Entertainment & Nightlife
  if (text.includes('show') || text.includes('performance') || text.includes('music') || text.includes('concert') || text.includes('club') || text.includes('dance')) return <Music size={18} />;
  if (text.includes('night') || text.includes('evening')) return <Moon size={18} />;
  
  // Morning specific
  if (text.includes('morning') || text.includes('sunrise')) return <Sun size={18} />;

  // Default
  return <Camera size={18} />;
};

export const CityDetails: React.FC<CityDetailsProps> = ({ city, initialData, onBack, onSave, onUpdate, isSaved }) => {
  const [data, setData] = useState<TravelPackage | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItinerary, setEditedItinerary] = useState<ItineraryItem[]>([]);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [discoveredPlaces, setDiscoveredPlaces] = useState<Place[]>([]);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const discoveredMarkersRef = useRef<any[]>([]);

  useEffect(() => {
    // If we have initial data (e.g. from planner), use it directly
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

    // Otherwise fetch fresh data
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      const result = await getCityDetails(city);
      if (isMounted) {
        setData(result);
        setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [city, initialData]);

  // Initialize Map
  useEffect(() => {
    if (data && mapRef.current && !mapInstanceRef.current && (window as any).L) {
      const L = (window as any).L;
      const { lat, lng } = data.coordinates;
      
      const map = L.map(mapRef.current, {
        zoomControl: false // Hide default zoom control to position custom controls better
      }).setView([lat, lng], 13);
      
      setCurrentZoom(13);
      
      // Use CartoDB Dark Matter tiles for dark theme matching
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Add markers for original places
      data.places.forEach((place: Place) => {
        const marker = L.marker([place.coordinates.lat, place.coordinates.lng]).addTo(map);
        marker.bindPopup(`
          <div class="text-slate-900 min-w-[150px]">
            <h3 class="font-bold text-sm border-b border-slate-200 pb-1 mb-1">${place.name}</h3>
            <p class="text-xs text-slate-600">${place.description}</p>
          </div>
        `);
        markersRef.current.push(marker);
      });

      // Update zoom state
      map.on('zoomend', () => {
        setCurrentZoom(Math.round(map.getZoom()));
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        discoveredMarkersRef.current = [];
      }
    };
  }, [data]);

  // Handle discovered places markers
  useEffect(() => {
    if (mapInstanceRef.current && (window as any).L && discoveredPlaces.length > 0) {
       const L = (window as any).L;
       
       // Clear old discovered markers
       discoveredMarkersRef.current.forEach(m => m.remove());
       discoveredMarkersRef.current = [];

       discoveredPlaces.forEach(place => {
          // Create a custom icon for discovered places (Purple)
          const discoveredIcon = L.divIcon({
             className: 'custom-div-icon',
             html: `<div style="background-color: #a855f7; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #a855f7;"></div>`,
             iconSize: [12, 12],
             iconAnchor: [6, 6]
          });

          const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: discoveredIcon }).addTo(mapInstanceRef.current);
          marker.bindPopup(`
            <div class="text-slate-900 min-w-[150px]">
               <div class="flex items-center gap-1 mb-1 text-purple-600">
                  <span class="text-[10px] font-bold uppercase tracking-wider">Discovered</span>
               </div>
               <h3 class="font-bold text-sm border-b border-slate-200 pb-1 mb-1">${place.name}</h3>
               <p class="text-xs text-slate-600">${place.description}</p>
            </div>
          `);
          marker.openPopup();
          discoveredMarkersRef.current.push(marker);
       });
    }
  }, [discoveredPlaces]);

  const handleStartEditing = () => {
    if (data) {
      setEditedItinerary([...data.itinerary]);
      setIsEditing(true);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedItinerary([]);
  };

  const handleSaveEdits = () => {
    if (data) {
      const updatedData = { ...data, itinerary: editedItinerary };
      setData(updatedData);
      setIsEditing(false);
      // If already saved, update the saved record
      if (isSaved && onUpdate) {
        onUpdate(updatedData);
      }
    }
  };

  const handleItineraryChange = (index: number, value: string) => {
    const newItinerary = [...editedItinerary];
    newItinerary[index] = { ...newItinerary[index], activity: value };
    setEditedItinerary(newItinerary);
  };

  const handleAddDay = () => {
    const nextDay = editedItinerary.length + 1;
    setEditedItinerary([...editedItinerary, { day: nextDay, activity: "Explore the city at your leisure." }]);
  };

  const handleRemoveDay = (index: number) => {
    const newItinerary = editedItinerary.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      day: i + 1 // Re-index days
    }));
    setEditedItinerary(newItinerary);
  };

  const handleZoomToPlace = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16, {
        duration: 1.5
      });
    }
  };
  
  const handleRecenter = () => {
    if (mapInstanceRef.current && data) {
      const { lat, lng } = data.coordinates;
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.5 });
    }
  };

  const handleSearchNearby = async () => {
    if (mapInstanceRef.current && data) {
      setIsSearchingNearby(true);
      const center = mapInstanceRef.current.getCenter();
      const places = await getNearbyPlaces(center.lat, center.lng, data.city);
      setDiscoveredPlaces(places);
      setIsSearchingNearby(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Planning your trip to {city}...</h2>
          <p className="text-slate-400">Consulting travel experts & calculating costs</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Destination Not Found</h2>
        <p className="text-slate-300 mb-8">We couldn't generate a package for "{city}". Please try another destination.</p>
        <button onClick={onBack} className="px-6 py-3 bg-emerald-500 rounded-full font-bold hover:bg-emerald-600 transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <button 
          onClick={() => data && onSave(data)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
            isSaved 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Heart size={18} className={isSaved ? 'fill-current' : ''} />
          {isSaved ? 'Saved to Planner' : 'Save to Planner'}
        </button>
      </div>

      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
        <img 
          src={`https://picsum.photos/seed/${city}/1200/400`} 
          alt={city}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <div className="flex gap-2 mb-2">
                {data.themes.map((theme) => (
                  <span key={theme} className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
                    {theme}
                  </span>
                ))}
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-2">{data.city}</h1>
              <p className="text-xl md:text-2xl text-slate-200 font-light flex items-center gap-2">
                <MapPin className="text-red-500" /> {data.country}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-right">
              <p className="text-sm text-slate-300 uppercase tracking-widest">Estimated Cost</p>
              <p className="text-3xl font-bold text-emerald-400">{data.cost}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
              <Star className="text-yellow-400 fill-current" /> About the Trip
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">{data.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-xl">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Duration</p>
                  <p className="text-lg font-semibold text-white">{data.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-xl">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Best Time to Visit</p>
                  <p className="text-lg font-semibold text-white">{data.bestTime}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive Map Section */}
          <div className="bg-slate-800/50 p-1 rounded-2xl border border-white/5 h-[400px] relative z-0 group/map">
             <div ref={mapRef} className="w-full h-full rounded-xl z-0" />
             
             {/* Map Controls Overlay Top Right */}
             <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 items-end">
                <div className="bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
                    <MapIcon size={12} className="text-emerald-400" /> Interactive Map
                </div>
                <button 
                  onClick={handleSearchNearby}
                  disabled={isSearchingNearby}
                  className="bg-purple-600/90 hover:bg-purple-500 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSearchingNearby ? (
                      <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Radar size={14} />
                    )}
                    {isSearchingNearby ? 'Scanning...' : 'Scan Area'}
                </button>
             </div>

             {/* Map Controls Overlay Bottom Right - Zoom and Recenter */}
             <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2 items-center">
                <div className="bg-slate-900/90 backdrop-blur p-2 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg" title="Current Zoom Level">
                    {currentZoom}
                </div>
                <button
                    onClick={handleRecenter}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
                    title="Recenter Map"
                >
                    <Crosshair size={20} className="group-active:rotate-45 transition-transform" />
                </button>
             </div>
             
             {discoveredPlaces.length > 0 && (
               <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-white/10 shadow-xl max-w-xs animate-fade-in-up">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Discovered Gems</h4>
                    <button onClick={() => setDiscoveredPlaces([])} className="text-slate-400 hover:text-white"><X size={12} /></button>
                  </div>
                  <div className="space-y-1">
                    {discoveredPlaces.map((p, i) => (
                      <div key={i} className="text-xs text-slate-300 truncate cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleZoomToPlace(p.coordinates.lat, p.coordinates.lng)}>
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {p.name}
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>

          <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                  <MapPin size={24} />
                </div>
                Daily Itinerary
              </h2>
              
              {!isEditing ? (
                <button 
                  onClick={handleStartEditing}
                  className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-full transition-colors"
                >
                  <Pencil size={16} /> Customize
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleCancelEditing}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white bg-slate-700 px-3 py-2 rounded-full transition-colors"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button 
                    onClick={handleSaveEdits}
                    className="flex items-center gap-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full transition-colors"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-500 via-slate-700 to-slate-800/0" />
              
              <div className="space-y-8">
                {(isEditing ? editedItinerary : data.itinerary).map((item, idx) => (
                  <div key={idx} className="relative pl-16 group">
                    {/* Timeline Node */}
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-slate-900 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400 group-hover:scale-110 group-hover:shadow-emerald-500/30 transition-all z-10">
                      {getDayIcon(item.activity, item.day)}
                    </div>

                    {/* Content Card */}
                    <div className={`p-6 rounded-2xl border transition-all ${isEditing ? 'bg-slate-800 border-emerald-500/30' : 'bg-slate-700/30 hover:bg-slate-700/50 border-white/5 hover:border-emerald-500/20 hover:translate-x-1 group-hover:shadow-xl'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          Day {item.day}
                        </span>
                        {isEditing && (
                          <button 
                            onClick={() => handleRemoveDay(idx)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Day"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <textarea
                          value={item.activity}
                          onChange={(e) => handleItineraryChange(idx, e.target.value)}
                          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[80px] text-lg leading-relaxed"
                        />
                      ) : (
                        <p className="text-slate-200 leading-relaxed text-lg">{item.activity}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <div className="relative pl-16">
                    <button 
                      onClick={handleAddDay}
                      className="w-full h-24 border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group/add"
                    >
                      <Plus size={32} className="mb-2 group-hover/add:scale-110 transition-transform" />
                      <span className="font-semibold">Add Another Day</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Places */}
        <div className="space-y-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <MapPin className="text-red-500" /> Key Attractions
            </h2>
            <div className="space-y-4">
              {data.places.map((place, idx) => (
                <div 
                  key={idx} 
                  className="group relative overflow-hidden rounded-xl h-32 cursor-pointer"
                  onClick={() => handleZoomToPlace(place.coordinates.lat, place.coordinates.lng)}
                >
                  <img 
                    src={`https://picsum.photos/seed/${place.name.replace(/\s/g, '')}/400/200`}
                    alt={place.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="flex items-center gap-2 mb-1">
                       <CheckCircle size={14} className="text-emerald-400" />
                       <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Covered</span>
                    </div>
                    <p className="text-white font-semibold leading-tight">{place.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-1">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95">
              Book This Package
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">Professional Agency Fees Apply</p>
          </div>
        </div>
      </div>
    </div>
  );
};