import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Navigation, Moon, Sun, X, Globe, Search, ChevronDown } from 'lucide-react';

const PrayersPage = () => {
    const [times, setTimes] = useState(null);
    const [city, setCity] = useState('Puttalam');
    const [country, setCountry] = useState('Sri Lanka');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempCity, setTempCity] = useState('Puttalam');
    const [tempCountry, setTempCountry] = useState('Sri Lanka');
    const [countries, setCountries] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchTimes = async (cityName, countryName) => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}&method=2`);
            const data = await res.json();
            if (data.data) {
                setTimes(data.data.timings);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const res = await fetch('https://restcountries.com/v3.1/all?fields=name');
            const data = await res.json();
            const sortedCountries = data
                .map(c => c.name.common)
                .sort((a, b) => a.localeCompare(b));
            setCountries(sortedCountries);
        } catch (err) {
            console.error("Failed to fetch countries", err);
            setCountries(["Sri Lanka", "India", "Pakistan", "United Kingdom", "United States", "Saudi Arabia", "UAE"]);
        }
    };

    useEffect(() => {
        fetchTimes(city, country);
        fetchCountries();
    }, [city, country]);

    const handleLocationSubmit = (e) => {
        e.preventDefault();
        setCity(tempCity);
        setCountry(tempCountry);
        setIsModalOpen(false);
    };

    const prayerIcons = {
        Fajr: <Moon className="text-indigo-600" />,
        Sunrise: <Sun className="text-orange-500" />,
        Dhuhr: <Sun className="text-amber-500" />,
        Asr: <Sun className="text-yellow-600" />,
        Maghrib: <Moon className="text-orange-700" />,
        Isha: <Moon className="text-slate-800" />
    };

    return (
        <div className="pt-28 pb-20 px-4 min-h-screen bg-spiritual-50/30">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-bold text-spiritual-900 mb-4">Prayer Times</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 text-spiritual-600 bg-white px-5 py-2.5 rounded-2xl border border-spiritual-100 shadow-sm hover:shadow-md hover:border-spiritual-200 transition-all group"
                        >
                            <MapPin size={18} className="text-accent-emerald group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-spiritual-800">{city}, {country}</span>
                            <span className="ml-2 px-2 py-0.5 bg-spiritual-50 text-accent-emerald text-[10px] font-bold uppercase tracking-wider rounded-lg">Change</span>
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-5 rounded-[32px] border border-spiritual-100 shadow-sm flex items-center gap-6 min-w-[280px]"
                    >
                        <div className="flex flex-col border-r border-spiritual-50 pr-6">
                            <div className="text-[10px] text-spiritual-400 uppercase tracking-[0.2em] font-black mb-1">Date</div>
                            <div className="text-xl font-black text-spiritual-900 whitespace-nowrap">
                                {currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[10px] text-accent-emerald uppercase tracking-[0.2em] font-black mb-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-accent-emerald rounded-full animate-pulse" />
                                Current Time
                            </div>
                            <div className="text-xl font-black text-spiritual-900 font-mono">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-24 bg-white rounded-[32px] animate-pulse border border-spiritual-50" />
                        ))}
                    </div>
                ) : times && (
                    <div className="grid gap-4">
                        {Object.entries(times)
                            .filter(([name]) => ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(name))
                            .map(([name, time], idx) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ x: 8 }}
                                    className="bg-white p-6 rounded-[32px] border border-spiritual-50 shadow-sm flex items-center justify-between group transition-all hover:bg-spiritual-800 hover:text-white"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-spiritual-50 flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors">
                                            {prayerIcons[name] || <Clock />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{name}</h3>
                                            <p className="text-sm opacity-60 group-hover:opacity-80 font-medium">Beginning Time</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-black tracking-tight">{time}</div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-10 rounded-[48px] bg-accent-gold/5 border border-accent-gold/10 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl -z-10" />
                    <Navigation className="mx-auto mb-4 text-accent-gold" size={40} />
                    <h4 className="text-2xl font-bold text-spiritual-900 mb-2">Qibla Direction</h4>
                    <p className="text-spiritual-600 mb-8 font-light text-lg">Your Qibla direction from <span className="font-bold text-spiritual-900">{city}</span> is approximately 119° SE.</p>
                    <button className="bg-accent-gold text-white px-10 py-4 rounded-2xl font-bold shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:bg-yellow-600 transition-all hover:scale-105">
                        Open Qibla Finder
                    </button>
                </motion.div>
            </div>

            {/* Location Selection Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-spiritual-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="spiritual-gradient p-8 text-white relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <Globe className="mb-4 opacity-80" size={32} />
                                <h2 className="text-2xl font-bold mb-2">Change Location</h2>
                                <p className="text-white/70 text-sm font-light">Get accurate prayer times for any city worldwide.</p>
                            </div>

                            <form onSubmit={handleLocationSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-spiritual-400 uppercase tracking-widest ml-1 mb-2 block">City Name</label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-300" size={18} />
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Colombo, London, Dubai"
                                                value={tempCity}
                                                onChange={(e) => setTempCity(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-spiritual-50 border border-spiritual-100 rounded-2xl focus:ring-2 focus:ring-accent-emerald focus:border-transparent outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-spiritual-400 uppercase tracking-widest ml-1 mb-2 block">Country</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-300 pointer-events-none" size={18} />
                                            <select
                                                required
                                                value={tempCountry}
                                                onChange={(e) => setTempCountry(e.target.value)}
                                                className="w-full pl-12 pr-10 py-4 bg-spiritual-50 border border-spiritual-100 rounded-2xl focus:ring-2 focus:ring-accent-emerald focus:border-transparent outline-none transition-all font-medium appearance-none cursor-pointer"
                                            >
                                                {countries.length > 0 ? (
                                                    countries.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))
                                                ) : (
                                                    <option value="Sri Lanka">Sri Lanka</option>
                                                )}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-spiritual-400 pointer-events-none" size={18} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-spiritual-800 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-spiritual-900 transition-all active:scale-[0.98]"
                                >
                                    Update Location
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PrayersPage;
