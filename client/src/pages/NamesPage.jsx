import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Search, ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import namesSong from '../assets/Asma ul Husna by Sheikh Mishary Rashid.mp3';

const NamesPage = () => {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [playingName, setPlayingName] = useState(null);
    const [isPlayAll, setIsPlayAll] = useState(false);
    const audioRef = useRef(new Audio());

    const playAudio = async (number) => {
        try {
            const audio = audioRef.current;
            audio.pause();
            setIsPlayAll(false);

            audio.src = `https://raw.githubusercontent.com/soachishti/Asma-ul-Husna/master/audio/${number}.mp3`;
            audio.load();

            setPlayingName(number);
            await audio.play();
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Audio playback error:", err);
            }
        }
    };

    useEffect(() => {
        fetch('https://api.aladhan.com/v1/asmaAlHusna')
            .then(res => res.json())
            .then(data => {
                setNames(data.data);
                setLoading(false);
            })
            .catch(err => console.error(err));

        const audio = audioRef.current;
        return () => {
            audio.pause();
            audio.src = '';
            audio.onended = null;
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        audio.onended = () => {
            setPlayingName(null);
            setIsPlayAll(false);
        };
    }, []);

    const toggleAudio = (number) => {
        if (playingName === number) {
            audioRef.current.pause();
            setPlayingName(null);
        } else {
            playAudio(number);
        }
    };

    const handlePlayAll = () => {
        const audio = audioRef.current;
        if (isPlayAll) {
            audio.pause();
            setIsPlayAll(false);
        } else {
            audio.pause();
            setPlayingName(null);
            audio.src = namesSong;
            audio.load();
            setIsPlayAll(true);
            audio.play().catch(err => console.error("Play All error:", err));
        }
    };

    const filteredNames = names.filter(n =>
        n.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.name.includes(searchQuery) ||
        n.en.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pt-28 pb-20 px-4 min-h-screen bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-accent-emerald font-bold uppercase tracking-[0.2em] text-xs mb-4">
                            <Sparkles size={16} /> Learning Resources
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-spiritual-950">
                                99 Names of Allah
                            </h1>
                            <button
                                onClick={handlePlayAll}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg ${isPlayAll ? 'bg-accent-gold text-white' : 'bg-white text-accent-emerald border border-accent-emerald/20 hover:bg-spiritual-50'}`}
                            >
                                {isPlayAll ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                {isPlayAll ? 'Stop Play All' : 'Play All Names'}
                            </button>
                        </div>
                        <p className="text-spiritual-600 text-lg">
                            Explore the beautiful and divine names (Asma ul-Husna) and their profound meanings.
                        </p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or meaning..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-spiritual-100 shadow-sm focus:ring-2 focus:ring-spiritual-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-48 bg-white rounded-[40px] animate-pulse border border-spiritual-50" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredNames.map((name, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (idx % 4) * 0.1 }}
                                whileHover={{ y: -8, shadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
                                className={`group p-8 rounded-[40px] bg-white border shadow-sm transition-all text-center relative overflow-hidden ${playingName === name.number ? 'border-accent-gold ring-2 ring-accent-gold/20' : 'border-spiritual-50'}`}
                            >
                                <div className={`absolute top-0 left-0 w-full h-1.5 bg-accent-gold transition-transform origin-left ${playingName === name.number ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />

                                <div className="flex items-center justify-between mb-4">
                                    <div className={`font-bold text-sm transition-colors ${playingName === name.number ? 'text-accent-gold' : 'text-spiritual-200 group-hover:text-accent-gold'}`}>
                                        {name.number.toString().padStart(2, '0')}
                                    </div>
                                    {playingName === name.number && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            <Volume2 size={16} className="text-accent-gold" />
                                        </motion.div>
                                    )}
                                </div>

                                <div className={`text-4xl font-arabic text-spiritual-950 mb-6 transition-transform ${playingName === name.number ? 'scale-110 text-accent-emerald' : 'group-hover:scale-110'}`}>
                                    {name.name}
                                </div>
                                <h3 className="text-xl font-bold text-spiritual-800 mb-2">
                                    {name.transliteration}
                                </h3>
                                <p className="text-spiritual-500 text-sm leading-relaxed mb-4 italic">
                                    "{name.en.meaning}"
                                </p>

                                <div className="pt-4 border-t border-spiritual-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                                    <button
                                        onClick={() => toggleAudio(name.number)}
                                        className={`p-3 rounded-2xl transition-all shadow-sm ${playingName === name.number ? 'bg-accent-gold text-white' : 'bg-spiritual-50 text-accent-emerald hover:bg-accent-emerald hover:text-white'}`}
                                        title={playingName === name.number ? 'Pause' : 'Play Audio'}
                                    >
                                        {playingName === name.number ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                    </button>
                                    <Link to={`/names/${name.number}`} className="text-accent-emerald font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        Learn More <ArrowLeft className="rotate-180" size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NamesPage;
