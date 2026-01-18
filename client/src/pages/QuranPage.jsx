import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ChevronRight, Play } from 'lucide-react';

const QuranPage = () => {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('https://api.alquran.cloud/v1/surah')
            .then(res => res.json())
            .then(data => {
                setSurahs(data.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredSurahs = surahs.filter(s =>
        s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.includes(searchQuery)
    );

    return (
        <div className="pt-28 pb-20 px-4 min-h-screen bg-spiritual-50/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-spiritual-900 mb-4">The Holy Quran</h1>
                        <p className="text-spiritual-600">Read and explore the 114 Surahs of the Divine Revelation.</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search Surah (e.g. Al-Fatiha)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-spiritual-100 shadow-sm focus:ring-2 focus:ring-spiritual-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-spiritual-50" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSurahs.map((surah) => (
                            <Link key={surah.number} to={`/quran/${surah.number}`}>
                                <motion.div
                                    whileHover={{ y: -5, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    className="group p-6 h-full rounded-3xl bg-white border border-spiritual-50 shadow-sm hover:border-spiritual-200 transition-all cursor-pointer flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-spiritual-100 text-spiritual-800 flex items-center justify-center font-bold text-lg group-hover:bg-spiritual-800 group-hover:text-white transition-colors">
                                            {surah.number}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-spiritual-900">{surah.englishName}</h3>
                                            <p className="text-sm text-spiritual-500">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold font-arabic text-spiritual-800 mb-1">{surah.name}</div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-accent-emerald uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                            Read <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranPage;
