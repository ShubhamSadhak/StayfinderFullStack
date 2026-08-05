import React, { useState } from 'react';
import { MapPin, ArrowRight, Building2, GraduationCap, CheckCircle2 } from 'lucide-react';

interface ExpandingAcrossIndiaProps {
  onSelectCity?: (city: string) => void;
}

interface CityHubInfo {
  name: string;
  cityKey: string;
  pgCount: number;
  popularHubs: string[];
  educationCenters: string[];
}

export const ExpandingAcrossIndia: React.FC<ExpandingAcrossIndiaProps> = ({ onSelectCity }) => {
  const cityData: CityHubInfo[] = [
    {
      name: 'Bangalore',
      cityKey: 'Bengaluru',
      pgCount: 450,
      popularHubs: ['Indiranagar', 'Koramangala', 'Whitefield', 'Electronic City', 'HSR Layout'],
      educationCenters: ['IISC', 'PES University', 'Christ University', 'Jain University'],
    },
    {
      name: 'New Delhi',
      cityKey: 'Delhi',
      pgCount: 390,
      popularHubs: ['Saket', 'Connaught Place', 'South Extension', 'Hauz Khas', 'Lajpat Nagar'],
      educationCenters: ['Delhi University', 'IIT Delhi', 'JNU', 'Jamia Millia'],
    },
    {
      name: 'Pune',
      cityKey: 'Pune',
      pgCount: 280,
      popularHubs: ['Hinjewadi', 'Viman Nagar', 'Kothrud', 'Baner', 'Aundh'],
      educationCenters: ['Pune University', 'Symbiosis', 'COEP', 'MIT World Peace'],
    },
    {
      name: 'Hyderabad',
      cityKey: 'Hyderabad',
      pgCount: 320,
      popularHubs: ['HITEC City', 'Gachibowli', 'Madhapur', 'Kondapur', 'Jubilee Hills'],
      educationCenters: ['IIT Hyderabad', 'ISB', 'University of Hyderabad', 'IIIT Hyderabad'],
    },
  ];

  const [activeCity, setActiveCity] = useState<CityHubInfo>(cityData[0]);

  const handleCityClick = (city: CityHubInfo) => {
    setActiveCity(city);
    if (onSelectCity) {
      onSelectCity(city.cityKey);
    }
  };

  return (
    <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Subtitle */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="font-serif-display text-4xl sm:text-5xl font-extrabold text-black tracking-tight">
          Expanding Across India
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
          Active in all major educational and corporate hubs.
        </p>
      </div>

      {/* Map Card Wrapper */}
      <div className="relative bg-white border border-zinc-200/90 rounded-[32px] overflow-hidden shadow-xl card-shadow min-h-[420px] flex flex-col justify-between p-6 sm:p-10">
        
        {/* Background Light Map Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center mix-blend-multiply"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Subtle Map Overlay Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

        {/* Floating Pill Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-auto py-8">
          {cityData.map((city) => {
            const isActive = activeCity.name === city.name;
            return (
              <button
                key={city.name}
                onClick={() => handleCityClick(city)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2.5 shadow-md ${
                  isActive
                    ? 'bg-black text-white scale-105 ring-2 ring-black/20 shadow-lg'
                    : 'bg-white/90 backdrop-blur-md text-zinc-800 border border-zinc-200 hover:bg-white hover:border-zinc-300'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'
                  }`}
                />
                <span>{city.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active City Details Card */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-lg max-w-3xl mx-auto w-full grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-black" />
                <h3 className="font-serif-display text-xl font-bold text-black">
                  {activeCity.name}
                </h3>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                {activeCity.pgCount}+ Verified Listings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-700">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Key Corporate Hubs</span>
                </div>
                <p className="text-zinc-600 line-clamp-2">
                  {activeCity.popularHubs.join(', ')}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-700">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Educational Campuses</span>
                </div>
                <p className="text-zinc-600 line-clamp-2">
                  {activeCity.educationCenters.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-4 flex items-center justify-start sm:justify-end">
            <button
              onClick={() => handleCityClick(activeCity)}
              className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span>Explore {activeCity.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
