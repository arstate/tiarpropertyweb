import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Filter, Bed, Bath, ChevronDown, Check, Building2 } from 'lucide-react';
import { initialProperties } from '../data/properties';



// Reusable Custom Dropdown Component
interface CustomDropdownProps {
    icon: React.ReactNode;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    labelMap?: (value: string) => string;
    placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ icon, value, options, onChange, labelMap, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayLabel = labelMap ? labelMap(value) : value;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-gray-50 border ${isOpen ? 'border-luxury-gold/50 ring-4 ring-luxury-gold/5 bg-white' : 'border-transparent'} hover:bg-white hover:border-luxury-gold/30 rounded-2xl py-3 pl-12 pr-10 text-left cursor-pointer text-luxury-green font-medium transition-all duration-200 flex items-center h-[52px] shadow-sm`}
            >
                <div className="absolute left-4 text-gray-400">
                    {icon}
                </div>
                <span className="truncate">{displayLabel || placeholder}</span>
                <div className={`absolute right-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-luxury-gold' : ''}`}>
                    <ChevronDown size={18} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 py-2 max-h-60 overflow-y-auto"
                    >
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${value === option ? 'bg-luxury-gold/10 text-luxury-green font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-luxury-green'}`}
                            >
                                <span>{labelMap ? labelMap(option) : option}</span>
                                {value === option && <Check size={16} className="text-luxury-gold" />}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const SearchPage: React.FC = () => {
    const [properties, setProperties] = useState(initialProperties);
    const [keyword, setKeyword] = useState("");
    const [locationFilter, setLocationFilter] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");
    const [developerFilter, setDeveloperFilter] = useState("All");

    useEffect(() => {
        const savedProps = localStorage.getItem('tiar_properties');
        if (savedProps) {
            try {
                setProperties(JSON.parse(savedProps));
            } catch (e) {
                console.error("Failed to parse local properties");
            }
        }
    }, []);

    // Automatically scroll to top when component mounts
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    const locations = ["All", ...Array.from(new Set(properties.map(p => p.location)))];
    const developers = ["All", ...Array.from(new Set(properties.map(p => p.developer)))];
    const priceOptions = ["All", "< 500 Juta", "500 - 900 Juta", "> 900 Juta"];

    const handleDeveloperChange = (val: string) => {
        setDeveloperFilter(val);
        if (val !== "All") {
            setLocationFilter("All");
        }
    };

    const handleLocationChange = (val: string) => {
        setLocationFilter(val);
        if (val !== "All") {
            setDeveloperFilter("All");
        }
    };

    const filteredProperties = properties.filter(prop => {
        const matchKeyword = prop.title.toLowerCase().includes(keyword.toLowerCase()) ||
            prop.location.toLowerCase().includes(keyword.toLowerCase());
        const matchLocation = locationFilter === "All" || prop.location === locationFilter;
        const matchDeveloper = developerFilter === "All" || prop.developer === developerFilter;

        let matchPrice = true;
        if (priceFilter === "< 500 Juta") matchPrice = prop.priceRange < 500;
        if (priceFilter === "500 - 900 Juta") matchPrice = prop.priceRange >= 500 && prop.priceRange <= 900;
        if (priceFilter === "> 900 Juta") matchPrice = prop.priceRange > 900;

        return matchKeyword && matchLocation && matchDeveloper && matchPrice;
    });

    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-4xl md:text-5xl text-luxury-green mb-4">
                        Katalog <span className="text-luxury-gold italic">Hunian Impian</span>
                    </h1>
                    <p className="text-luxury-slate max-w-2xl mx-auto">
                        Temukan rumah yang cocok dengan gaya hidup dan budget Anda. Gunakan fitur pencarian di bawah ini.
                    </p>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 mb-12 sticky top-24 z-30"
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Keyword Input */}
                        <div className="md:col-span-3 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-luxury-gold transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama project atau area..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full h-[52px] bg-gray-50 border border-transparent focus:border-luxury-gold/30 focus:bg-white focus:ring-4 focus:ring-luxury-gold/10 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400 text-luxury-green shadow-sm"
                            />
                        </div>

                        {/* Custom Developer Dropdown */}
                        <div className="md:col-span-3">
                            <CustomDropdown
                                icon={<Building2 size={20} />}
                                value={developerFilter}
                                options={developers}
                                onChange={handleDeveloperChange}
                                labelMap={(val: string) => val === "All" ? "Semua Developer" : val}
                            />
                        </div>

                        {/* Custom Location Dropdown */}
                        <div className="md:col-span-3">
                            <CustomDropdown
                                icon={<MapPin size={20} />}
                                value={locationFilter}
                                options={locations}
                                onChange={handleLocationChange}
                                labelMap={(val: string) => val === "All" ? "Semua Lokasi" : val}
                            />
                        </div>

                        {/* Custom Price Dropdown */}
                        <div className="md:col-span-3">
                            <CustomDropdown
                                icon={<DollarSign size={20} />}
                                value={priceFilter}
                                options={priceOptions}
                                onChange={setPriceFilter}
                                labelMap={(val: string) => val === "All" ? "Semua Harga" : val}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((prop, i) => (
                            <motion.div
                                key={prop.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-luxury-gold/10 border border-gray-100 transition-all duration-300 cursor-pointer"
                                onClick={() => window.location.hash = `#/properti/${prop.id}`}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-luxury-green uppercase tracking-wide shadow-sm">
                                        {prop.tag}
                                    </div>
                                    <img
                                        src={prop.image}
                                        alt={prop.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="font-bold text-xl drop-shadow-md">{prop.priceDisplay}</p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs text-luxury-gold font-bold uppercase tracking-wider mb-1">{prop.type}</p>
                                            <h3 className="font-serif text-2xl text-luxury-green group-hover:text-luxury-gold transition-colors">{prop.title}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-luxury-slate text-sm mb-6">
                                        <MapPin size={14} />
                                        {prop.location}
                                    </div>

                                    <div className="flex gap-4 border-t border-gray-100 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Bed size={18} className="text-luxury-gold" />
                                            <span className="font-medium">{prop.beds} Beds</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Bath size={18} className="text-luxury-gold" />
                                            <span className="font-medium">{prop.baths} Baths</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.hash = `#/properti/${prop.id}`;
                                            }}
                                            className="w-full py-3 rounded-xl border border-luxury-green text-luxury-green font-bold hover:bg-luxury-green hover:text-white transition-all text-sm uppercase tracking-wide cursor-pointer"
                                        >
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <Filter size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Tidak ada properti yang cocok dengan filter Anda.</p>
                            <button
                                onClick={() => { setKeyword(""); setPriceFilter("All"); setLocationFilter("All"); setDeveloperFilter("All") }}
                                className="mt-4 text-luxury-gold hover:underline"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};