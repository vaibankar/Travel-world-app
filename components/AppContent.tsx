import React, { useState } from 'react';
import { BackgroundSlider } from './BackgroundSlider';
import { AnimatedLogo } from './AnimatedLogo';
import { User, AppView, TravelPackage } from '../types';
import { CityDetails } from './CityDetails';
import { Featured } from './Featured';
import { TripPlanner } from './TripPlanner';
import { Search, User as UserIcon, LogOut, Calendar } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.REGISTER);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  // Planner State
  const [savedTrips, setSavedTrips] = useState<TravelPackage[]>([]);
  const [plannerData, setPlannerData] = useState<TravelPackage | undefined>(undefined);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: formData.name || 'Traveler', email: formData.email });
    setView(AppView.HOME);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCity(searchQuery);
      setPlannerData(undefined); // Clear pre-loaded data for fresh search
      setView(AppView.DETAILS);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.LOGIN);
    setSelectedCity('');
  };

  // Planner Handlers
  const handleSaveTrip = (pkg: TravelPackage) => {
    if (savedTrips.some(t => t.city === pkg.city)) {
      setSavedTrips(savedTrips.filter(t => t.city !== pkg.city));
    } else {
      setSavedTrips([...savedTrips, pkg]);
    }
  };

  const handleUpdateTrip = (pkg: TravelPackage) => {
    setSavedTrips(prev => prev.map(t => t.city === pkg.city ? pkg : t));
  };

  const handleRemoveTrip = (cityName: string) => {
    setSavedTrips(savedTrips.filter(t => t.city !== cityName));
  };

  const handleViewSavedTrip = (trip: TravelPackage) => {
    setSelectedCity(trip.city);
    setPlannerData(trip); // Use saved data
    setView(AppView.DETAILS);
  };

  // Auth Layout (Register/Login)
  if (view === AppView.REGISTER || view === AppView.LOGIN) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <BackgroundSlider />
        <div className="relative z-20 w-full max-w-md">
          <div className="glass-panel p-8 rounded-3xl shadow-2xl animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <AnimatedLogo size="lg" />
            </div>
            
            <h2 className="text-2xl font-bold text-center text-white mb-2">
              {view === AppView.REGISTER ? 'Start Your Journey' : 'Welcome Back'}
            </h2>
            <p className="text-center text-slate-300 mb-8 text-sm">
              {view === AppView.REGISTER 
                ? 'Join thousands of luxury travelers exploring the world.' 
                : 'Sign in to access your curated itineraries.'}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              {view === AppView.REGISTER && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-slate-500"
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-slate-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 mt-6"
              >
                {view === AppView.REGISTER ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {view === AppView.REGISTER ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button 
                  onClick={() => setView(view === AppView.REGISTER ? AppView.LOGIN : AppView.REGISTER)}
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  {view === AppView.REGISTER ? 'Sign In' : 'Register'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App Layout (Home / Details / Planner)
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div onClick={() => { setView(AppView.HOME); setSelectedCity(''); }} className="cursor-pointer">
              <AnimatedLogo />
            </div>
            
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              {view !== AppView.DETAILS && (
                <form onSubmit={handleSearch} className="relative w-full group">
                  <input
                    type="text"
                    placeholder="Where do you want to travel?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all group-hover:bg-slate-700"
                  />
                  <Search className="absolute left-4 top-2.5 text-slate-400" size={18} />
                </form>
              )}
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setView(AppView.PLANNER)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${view === AppView.PLANNER ? 'text-emerald-400' : 'text-slate-300 hover:text-white'}`}
              >
                <Calendar size={18} />
                <span className="hidden sm:inline">My Trips</span>
                {savedTrips.length > 0 && (
                  <span className="bg-emerald-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">{savedTrips.length}</span>
                )}
              </button>
              
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                  {user?.name.charAt(0)}
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Areas */}
      {view === AppView.HOME && (
        <main className="pt-20">
          <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
             <BackgroundSlider position="absolute" overlayClassName="bg-slate-900/60" />
             
             <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
               <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                 Discover Your Next <br />
                 <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Great Adventure</span>
               </h1>
               <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                 Experience the world's most breathtaking destinations with professional itineraries curated just for you.
               </p>
               
               <div className="md:hidden max-w-md mx-auto">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 pl-12 pr-4 text-white placeholder-slate-300 focus:outline-none focus:border-emerald-500 focus:bg-slate-900/80 transition-all shadow-lg"
                  />
                  <Search className="absolute left-4 top-4 text-emerald-400" size={20} />
                </form>
               </div>
             </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Featured 
              onSelectCity={(city) => {
                setSelectedCity(city);
                setPlannerData(undefined);
                setView(AppView.DETAILS);
              }} 
            />
          </div>
          
          <footer className="bg-slate-950 border-t border-white/5 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <AnimatedLogo size="sm" />
              <p className="text-slate-500 text-sm mt-4">© 2024 Travel World Agency. All rights reserved.</p>
            </div>
          </footer>
        </main>
      )}

      {view === AppView.DETAILS && (
        <CityDetails 
          city={selectedCity} 
          initialData={plannerData}
          onBack={() => { 
            // If coming from planner, go back to planner, otherwise home
            if (plannerData) {
              setView(AppView.PLANNER);
            } else {
              setView(AppView.HOME);
            }
            setSelectedCity('');
            setPlannerData(undefined);
          }} 
          onSave={handleSaveTrip}
          onUpdate={handleUpdateTrip}
          isSaved={savedTrips.some(t => t.city === selectedCity)}
        />
      )}

      {view === AppView.PLANNER && (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          <TripPlanner 
            savedTrips={savedTrips}
            onViewTrip={handleViewSavedTrip}
            onRemoveTrip={handleRemoveTrip}
          />
        </div>
      )}
    </div>
  );
};