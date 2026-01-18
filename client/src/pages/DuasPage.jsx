import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Star, Moon, Sun, Shield, BookOpen, Search, Sparkles, Copy, Check } from 'lucide-react';
import { duaCategories, allDuas } from '../data/duas';

const DuasPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [duaOfTheDay, setDuaOfTheDay] = useState(null);
    const [copied, setCopied] = useState(false);
    const [language, setLanguage] = useState('English');

    useEffect(() => {
        // Pick a random dua on mount
        const randomDua = allDuas[Math.floor(Math.random() * allDuas.length)];
        setDuaOfTheDay(randomDua);
    }, []);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const iconMap = { Sun, Shield, Heart, Moon, Star, BookOpen };

    const filteredCategories = duaCategories.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pt-28 pb-20 px-4 min-h-screen bg-spiritual-50/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-spiritual-900 mb-4">Duas & Azkar</h1>
                        <p className="text-spiritual-600">Connect with your Creator through authentic supplications.</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search major categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-spiritual-100 shadow-sm focus:ring-2 focus:ring-spiritual-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                    {filteredCategories.map((cat, idx) => {
                        const Icon = iconMap[cat.icon];
                        return (
                            <Link key={cat.title} to={`/duas/${cat.title}`}>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="p-8 h-full rounded-[32px] bg-white border border-spiritual-50 shadow-sm flex flex-col items-center text-center group cursor-pointer"
                                >
                                    <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-2xl`}>
                                        <Icon className={cat.color} />
                                    </div>
                                    <h3 className="text-xl font-bold text-spiritual-900 mb-2">{cat.title}</h3>
                                    <p className="text-spiritual-500 text-sm font-bold uppercase tracking-wider">{cat.count}</p>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {duaOfTheDay && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="spiritual-gradient rounded-[48px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-20 -mt-20" />
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-accent-gold fill-accent-gold" size={24} />
                                    <span className="text-accent-gold font-bold tracking-widest uppercase text-sm">Dua of the Day</span>
                                </div>
                                <div className="flex p-1 bg-white/10 rounded-2xl border border-white/20">
                                    <button
                                        onClick={() => setLanguage('English')}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === 'English' ? 'bg-white text-spiritual-900 shadow-md' : 'text-white hover:bg-white/10'}`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => setLanguage('Tamil')}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === 'Tamil' ? 'bg-white text-spiritual-900 shadow-md' : 'text-white hover:bg-white/10'}`}
                                    >
                                        தமிழ்
                                    </button>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold mb-8">{duaOfTheDay.title}</h2>
                            <p className="text-4xl md:text-5xl font-arabic leading-relaxed text-right mb-10 leading-[1.8] drop-shadow-sm select-none">
                                {duaOfTheDay.arabic}
                            </p>
                            <div className="p-8 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 mb-8 italic text-lg md:text-xl font-light leading-relaxed">
                                "{language === 'English' ? duaOfTheDay.translation : duaOfTheDay.translation_ta}"
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="text-sm font-medium text-spiritual-200">
                                    <span className="text-accent-gold font-bold uppercase tracking-wider text-xs block mb-1">Benefit</span>
                                    {duaOfTheDay.benefit}
                                </div>
                                <button
                                    onClick={() => handleCopy(duaOfTheDay.arabic)}
                                    className="flex items-center gap-3 bg-white text-spiritual-900 px-8 py-4 rounded-2xl font-bold hover:bg-spiritual-50 transition-all active:scale-95 shrink-0"
                                >
                                    {copied ? <Check className="text-green-600" /> : <Copy size={20} />}
                                    {copied ? 'Copied!' : 'Copy Arabic'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DuasPage;
