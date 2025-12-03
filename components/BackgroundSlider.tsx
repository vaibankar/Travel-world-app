import React, { useState, useEffect } from 'react';

const IMAGES = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", // Switzerland
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2066&auto=format&fit=crop", // Venice
  "https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=80&w=2070&auto=format&fit=crop", // Dubai
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2076&auto=format&fit=crop", // Bali
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop"  // Taj Mahal
];

interface BackgroundSliderProps {
  position?: 'fixed' | 'absolute';
  overlayClassName?: string;
}

export const BackgroundSlider: React.FC<BackgroundSliderProps> = ({ 
  position = 'fixed', 
  overlayClassName = 'bg-black/40 backdrop-blur-[2px]' 
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${position} inset-0 z-0 overflow-hidden`}>
      {IMAGES.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <div className={`absolute inset-0 z-10 ${overlayClassName}`} />
    </div>
  );
};