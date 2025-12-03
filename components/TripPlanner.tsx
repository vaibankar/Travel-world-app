import React from 'react';
import { TravelPackage } from '../types';
import { MapPin, Calendar, DollarSign, Trash2, ArrowRight } from 'lucide-react';

interface TripPlannerProps {
  savedTrips: TravelPackage[];
  onViewTrip: (trip: TravelPackage) => void;
  onRemoveTrip: (city: string) => void;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({ savedTrips, onViewTrip, onRemoveTrip }) => {
  if (savedTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Calendar size={48} className="text-slate-600" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Your Planner is Empty</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Start exploring destinations and save your favorite itineraries here to build your dream vacation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <Calendar className="text-emerald-400" /> Your Trip Planner
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedTrips.map((trip) => (
          <div key={trip.city} className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group">
            <div className="h-48 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
               <img 
                 src={`https://picsum.photos/seed/${trip.city}/800/400`} 
                 alt={trip.city}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute bottom-4 left-4 z-20">
                 <h3 className="text-2xl font-bold text-white">{trip.city}</h3>
                 <div className="flex items-center gap-1 text-slate-300 text-sm">
                   <MapPin size={12} className="text-emerald-400" /> {trip.country}
                 </div>
               </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Calendar size={14} className="text-emerald-400" />
                  {trip.duration}
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                   <DollarSign size={14} />
                   {trip.cost}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => onViewTrip(trip)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  View Details <ArrowRight size={16} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTrip(trip.city);
                  }}
                  className="w-12 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  title="Remove from Planner"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};