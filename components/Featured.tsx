import React, { useState } from 'react';
import { MapPin, Camera, X, ChevronLeft, ChevronRight, Play, Images } from 'lucide-react';

interface Destination {
  name: string;
  image: string;
  gallery: string[];
}

const INDIA_DESTINATIONS: Destination[] = [
  { 
    name: 'Jaipur', 
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop', // Hawa Mahal
      'https://images.unsplash.com/photo-1603262110263-fb011277db1e?q=80&w=2000&auto=format&fit=crop', // Amer Fort
      'https://images.unsplash.com/photo-1598555981673-a26245353846?q=80&w=2000&auto=format&fit=crop', // Jal Mahal
      'https://images.unsplash.com/photo-1592639296346-60c2921501e6?q=80&w=2000&auto=format&fit=crop'  // City Palace
    ]
  },
  { 
    name: 'Goa', 
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1541256996841-325db08525b6?q=80&w=2000&auto=format&fit=crop', // Beach
      'https://images.unsplash.com/photo-1590453503159-4ae5b835941c?q=80&w=2000&auto=format&fit=crop', // Church
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2000&auto=format&fit=crop', // Palm roads
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop'  // Sunset
    ]
  },
  { 
    name: 'Kerala', 
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1593693396885-5b589cd5ea32?q=80&w=2000&auto=format&fit=crop', // Backwaters
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2000&auto=format&fit=crop', // Tea gardens
      'https://images.unsplash.com/photo-1583144866386-8d5f3074094e?q=80&w=2000&auto=format&fit=crop', // Houseboat
      'https://images.unsplash.com/photo-1514552525791-0329ac83a6de?q=80&w=2000&auto=format&fit=crop'  // Kathakali
    ]
  },
  { 
    name: 'Ladakh', 
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2000&auto=format&fit=crop', // Pangong Lake
      'https://images.unsplash.com/photo-1566323145887-17b1897d81a9?q=80&w=2000&auto=format&fit=crop', // Monastery
      'https://images.unsplash.com/photo-1579618171128-44c546413d33?q=80&w=2000&auto=format&fit=crop', // Roads
      'https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=2000&auto=format&fit=crop'  // Mountains
    ]
  }
];

const WORLD_DESTINATIONS: Destination[] = [
  { 
    name: 'Paris', 
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?q=80&w=2000&auto=format&fit=crop', // Eiffel View
      'https://images.unsplash.com/photo-1550340499-a6c6088e6679?q=80&w=2000&auto=format&fit=crop', // Louvre
      'https://images.unsplash.com/photo-1509299349698-dd22323b5963?q=80&w=2000&auto=format&fit=crop', // Street
      'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?q=80&w=2000&auto=format&fit=crop'  // Arc de Triomphe
    ]
  },
  { 
    name: 'Tokyo', 
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2036&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop', // Neon streets
      'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?q=80&w=2000&auto=format&fit=crop', // Temple
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000&auto=format&fit=crop', // Shibuya
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop'  // Mt Fuji view
    ]
  },
  { 
    name: 'New York', 
    image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=2000&auto=format&fit=crop', // Times Square
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2000&auto=format&fit=crop', // Skyline
      'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?q=80&w=2000&auto=format&fit=crop', // Central Park
      'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2000&auto=format&fit=crop'  // Brooklyn Bridge
    ]
  },
  { 
    name: 'Santorini', 
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613395877344-13d4c2ce5d4d?q=80&w=2000&auto=format&fit=crop', // Blue Domes
      'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed92?q=80&w=2000&auto=format&fit=crop', // White houses
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop', // Sunset
      'https://images.unsplash.com/photo-1505567745926-ba89000d2c5a?q=80&w=2000&auto=format&fit=crop'  // Sea view
    ]
  }
];

interface FeaturedProps {
  onSelectCity: (city: string) => void;
}

interface GalleryModalProps {
  city: string;
  images: string[];
  onClose: () => void;
  onExplore: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ city, images, onClose, onExplore }) => {
  const [index, setIndex] = useState(0);

  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % images.length); };
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + images.length) % images.length); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-7xl bg-slate-900/50 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row h-[85vh]" onClick={e => e.stopPropagation()}>
        
        {/* Main Image Area */}
        <div className="relative flex-1 bg-black/40 flex items-center justify-center min-h-[300px]">
           <img src={images[index]} className="max-w-full max-h-full object-contain shadow-2xl" alt={`${city} view ${index + 1}`} />
           
           <button onClick={prev} className="absolute left-4 p-4 bg-black/50 hover:bg-emerald-500 text-white rounded-full transition-all backdrop-blur-sm group border border-white/10 hover:border-emerald-400">
              <ChevronLeft size={28} className="group-active:-translate-x-1 transition-transform" />
           </button>
           <button onClick={next} className="absolute right-4 p-4 bg-black/50 hover:bg-emerald-500 text-white rounded-full transition-all backdrop-blur-sm group border border-white/10 hover:border-emerald-400">
              <ChevronRight size={28} className="group-active:translate-x-1 transition-transform" />
           </button>

           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/10">
             {index + 1} / {images.length}
           </div>
        </div>

        {/* Sidebar / Info */}
        <div className="w-full md:w-96 bg-slate-900 border-l border-white/10 p-8 flex flex-col">
           <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-4xl font-black text-white mb-2">{city}</h3>
                <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                   <MapPin size={16} /> Destination Gallery
                </p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
           </div>

           <div className="flex-1 overflow-y-auto mb-8 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="grid grid-cols-2 gap-3">
                 {images.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setIndex(i)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 relative h-24 transition-all ${index === i ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                    >
                       <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                       {index === i && <div className="absolute inset-0 bg-emerald-500/10" />}
                    </div>
                 ))}
              </div>
           </div>

           <button 
             onClick={onExplore}
             className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 group hover:shadow-emerald-500/40"
           >
             <span>Plan This Trip</span>
             <Play size={20} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

      </div>
    </div>
  );
};

export const Featured: React.FC<FeaturedProps> = ({ onSelectCity }) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const allDestinations = [...INDIA_DESTINATIONS, ...WORLD_DESTINATIONS];

  const handleCardClick = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const handleExplore = () => {
    if (selectedCity) {
      onSelectCity(selectedCity);
      setSelectedCity(null);
    }
  };

  const getDestination = (cityName: string) => {
    return allDestinations.find(d => d.name === cityName);
  };

  const renderCard = (place: Destination) => {
    // Use the actual gallery images for previews if available, otherwise fallback to main image
    const thumb1 = place.gallery[0] || place.image;
    const thumb2 = place.gallery[1] || place.image;

    return (
      <div 
        key={place.name} 
        onClick={() => handleCardClick(place.name)}
        className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-2 transition-all duration-500 border border-white/10 bg-slate-800"
      >
        <div className="absolute inset-0 flex">
          {/* Main Image Section - 65% width */}
          <div className="w-[65%] relative h-full border-r border-white/10 overflow-hidden">
            <img 
              src={place.image} 
              alt={place.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
          </div>
          
          {/* Side Images Section - 35% width */}
          <div className="w-[35%] flex flex-col h-full bg-slate-900">
            <div className="h-1/2 relative border-b border-white/10 overflow-hidden group/thumb">
               <img src={thumb1} alt={`${place.name} preview 1`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
               <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
            </div>
            <div className="h-1/2 relative overflow-hidden group/thumb">
               <img src={thumb2} alt={`${place.name} preview 2`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
               
               {/* "View Gallery" Overlay on the last image */}
               <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px] group-hover:bg-black/40 transition-colors">
                 <div className="flex flex-col items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="bg-white/10 p-2 rounded-full border border-white/20 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-colors duration-300">
                        <Images size={16} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                        +{place.gallery.length} Photos
                    </span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 p-6 w-[65%]">
          <div className="transform transition-transform duration-300 group-hover:translate-x-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-[10px] font-bold text-emerald-300 uppercase tracking-wider backdrop-blur-md">
                Featured
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-1 leading-none shadow-black drop-shadow-lg">{place.name}</h3>
            <div className="h-1 w-12 bg-emerald-500 rounded-full group-hover:w-full transition-all duration-500 ease-out mt-3" />
          </div>
        </div>
      </div>
    );
  };

  const selectedDestination = selectedCity ? getDestination(selectedCity) : null;

  return (
    <>
      <div className="space-y-20">
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Incredible <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400">India</span></h2>
                <p className="text-slate-400 max-w-lg">Experience the vibrant culture and timeless heritage of India's most iconic destinations.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition group border border-slate-700 px-4 py-2 rounded-full hover:border-slate-500 hover:bg-slate-800">
                View All Destinations <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {INDIA_DESTINATIONS.map(renderCard)}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-10">
             <div className="space-y-1">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">World <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Wonders</span></h2>
                <p className="text-slate-400 max-w-lg">Embark on a journey to the globe's most breathtaking cities and landscapes.</p>
             </div>
             <button className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition group border border-slate-700 px-4 py-2 rounded-full hover:border-slate-500 hover:bg-slate-800">
                View All Destinations <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORLD_DESTINATIONS.map(renderCard)}
          </div>
        </section>

        <section className="animate-fade-in-up bg-slate-800/30 rounded-3xl p-8 border border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 text-pink-500">
                    <Camera size={32} />
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Travel <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Gallery</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Curated shots from our community of travelers.</p>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
              {allDestinations.map((place, index) => (
                  <div 
                      key={`gallery-${place.name}`}
                      onClick={() => handleCardClick(place.name)}
                      className={`relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 ${
                          // Masonry layout
                          (index === 0 || index === 5) ? 'md:col-span-2 md:row-span-2' : ''
                      }`}
                  >
                      <img 
                          src={place.gallery[index % place.gallery.length] || place.image}
                          alt={`Photo of ${place.name}`}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                      
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
                        <Images size={16} />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                          <p className="text-white font-bold text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              {place.name}
                          </p>
                          <p className="text-pink-400 text-xs font-bold uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                              Open Gallery
                          </p>
                      </div>
                  </div>
              ))}
          </div>
        </section>
      </div>

      {selectedDestination && (
        <GalleryModal 
          city={selectedDestination.name} 
          images={[selectedDestination.image, ...selectedDestination.gallery]}
          onClose={() => setSelectedCity(null)}
          onExplore={handleExplore}
        />
      )}
    </>
  );
};