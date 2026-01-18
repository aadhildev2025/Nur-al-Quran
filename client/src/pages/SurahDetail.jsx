import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Play, Pause, Download, Settings, Share2, Languages, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SurahDetail = () => {
    const { id } = useParams();
    const [surah, setSurah] = useState(null);
    const [translation, setTranslation] = useState(null);
    const [transliteration, setTransliteration] = useState(null);
    const [editions, setEditions] = useState([]);
    const [selectedEdition, setSelectedEdition] = useState('en.asad');
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [shared, setShared] = useState(false);
    const { isAuthenticated, toggleBookmark, isBookmarked } = useAuth();
    const [audio] = useState(new Audio());

    useEffect(() => {
        const fetchEditions = async () => {
            try {
                const res = await fetch('https://api.alquran.cloud/v1/edition?format=text&type=translation');
                const data = await res.json();
                const sortedEditions = data.data.sort((a, b) => a.language.localeCompare(b.language));
                setEditions(sortedEditions);
            } catch (err) {
                console.error("Failed to fetch editions:", err);
            }
        };
        fetchEditions();
    }, []);

    useEffect(() => {
        const fetchSurahData = async () => {
            setLoading(true);
            try {
                // Fetch Arabic Text
                const resArabic = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
                const dataArabic = await resArabic.json();

                // Fetch Selected Translation
                const resTrans = await fetch(`https://api.alquran.cloud/v1/surah/${id}/${selectedEdition}`);
                const dataTrans = await resTrans.json();

                // Fetch English Transliteration
                const resTl = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.transliteration`);
                const dataTl = await resTl.json();

                if (dataArabic.data && dataTrans.data && dataTl.data) {
                    setSurah(dataArabic.data);
                    setTranslation(dataTrans.data);
                    setTransliteration(dataTl.data);

                    // Update audio source if not already matching the surah
                    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${id}.mp3`;
                    if (audio.src !== audioUrl) {
                        audio.src = audioUrl;
                        audio.load();
                    }
                }

                setPlaying(false);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load surah data:", err);
                setLoading(false);
            }
        };

        fetchSurahData();

        return () => {
            audio.pause();
        };
    }, [id, selectedEdition, audio]);

    const togglePlayback = () => {
        if (playing) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Playback failed:", e));
        }
        setPlaying(!playing);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    audio.onended = () => setPlaying(false);

    if (loading) return (
        <div className="pt-32 flex flex-col items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-spiritual-200 border-t-spiritual-800 rounded-full animate-spin mb-4" />
            <p className="text-spiritual-600 font-medium animate-pulse">Loading Sacred Verses...</p>
        </div>
    );

    return (
        <div className="pt-28 pb-20 px-4 min-h-screen bg-[#fcfdfb]">
            <div className="max-w-4xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-10">
                    <Link to="/quran" className="flex items-center gap-2 text-spiritual-600 hover:text-spiritual-900 transition-colors group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Surahs</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="p-3 bg-white rounded-2xl border border-spiritual-100 shadow-sm hover:shadow-md transition-all relative group"
                        >
                            {shared ? <Check size={20} className="text-accent-emerald" /> : <Share2 size={20} className="text-spiritual-600" />}
                            {shared && (
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-spiritual-800 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap shadow-lg">
                                    Link Copied!
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Surah Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="spiritual-gradient p-10 md:p-16 rounded-[48px] text-white text-center relative overflow-hidden shadow-2xl mb-16"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/20">
                            Surah {surah.number}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold font-arabic mb-4">{surah.name}</h1>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{surah.englishName}</h2>
                        <p className="text-spiritual-100 text-lg opacity-80 mb-10">
                            {surah.englishNameTranslation} • {surah.revelationType} • {surah.numberOfAyahs} Ayahs
                        </p>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                            <button
                                onClick={togglePlayback}
                                className="bg-accent-gold text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:bg-yellow-600 transition-all transform hover:scale-105 w-full md:w-auto justify-center"
                            >
                                {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                                {playing ? 'Pause Recitation' : 'Play Recitation'}
                            </button>

                            <div className="flex p-1 bg-white/10 rounded-2xl border border-white/20 items-center gap-2 px-3">
                                <Languages size={18} className="text-white/60" />
                                <select
                                    value={selectedEdition}
                                    onChange={(e) => setSelectedEdition(e.target.value)}
                                    className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer pr-2 max-w-[150px] md:max-w-[200px]"
                                >
                                    {editions.map((edition) => (
                                        <option key={edition.identifier} value={edition.identifier} className="text-spiritual-900">
                                            {edition.language.toUpperCase()} - {edition.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bismillah */}
                {surah.number !== 1 && surah.number !== 9 && (
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-arabic text-spiritual-900 drop-shadow-sm leading-relaxed">
                            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                        </h3>
                    </div>
                )}

                {/* Verses List */}
                <div className="space-y-12">
                    {surah.ayahs.map((ayah, idx) => (
                        <motion.div
                            key={ayah.number}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="flex flex-col gap-8 pb-12 border-b border-spiritual-100">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-spiritual-50 flex items-center justify-center text-lg font-bold text-spiritual-800 border border-spiritual-100 shadow-sm">
                                            {ayah.numberInSurah}
                                        </div>
                                        {isAuthenticated && (
                                            <button
                                                onClick={() => toggleBookmark(surah.number, ayah.numberInSurah)}
                                                className={`p-3 rounded-2xl transition-all ${isBookmarked(surah.number, ayah.numberInSurah)
                                                    ? 'bg-accent-emerald text-white shadow-lg'
                                                    : 'bg-white text-spiritual-400 border border-spiritual-100 hover:border-accent-emerald hover:text-accent-emerald shadow-sm'}`}
                                            >
                                                {isBookmarked(surah.number, ayah.numberInSurah) ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-4xl md:text-5xl font-arabic text-spiritual-950 text-right leading-[2] drop-shadow-sm select-none">
                                        {surah.number !== 1 && idx === 0
                                            ? ayah.text.replace(/^(بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ|بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ)\s*/, '')
                                            : ayah.text}
                                    </p>
                                </div>
                                <div className="pl-16 space-y-4">
                                    <p className="text-sm md:text-base text-spiritual-500 font-medium italic leading-relaxed">
                                        {surah.number !== 1 && idx === 0
                                            ? transliteration?.ayahs[idx]?.text.replace(/^(Bismillaahir Rahmaanir Raheem\s*|Bismillahir-Rahmanir-Rahim\s*)/i, '')
                                            : transliteration?.ayahs[idx]?.text}
                                    </p>
                                    <p className="text-lg md:text-xl text-spiritual-700 font-light leading-relaxed">
                                        {surah.number !== 1 && idx === 0
                                            ? translation?.ayahs[idx]?.text.replace(/^(In the name of God, the Most Gracious, the Most Merciful:?\s*|In the name of Allah, the Entirely Merciful, the Especially Merciful\.\s*)/i, '')
                                            : translation?.ayahs[idx]?.text}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation Bottom */}
                <div className="mt-20 flex justify-between">
                    {parseInt(id) > 1 && (
                        <Link to={`/quran/${parseInt(id) - 1}`} className="p-6 bg-white border border-spiritual-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <div>
                                <span className="text-xs font-bold text-spiritual-400 uppercase">Previous Surah</span>
                                <div className="text-lg font-bold text-spiritual-800">Surah {parseInt(id) - 1}</div>
                            </div>
                        </Link>
                    )}
                    {parseInt(id) < 114 && (
                        <Link to={`/quran/${parseInt(id) + 1}`} className="p-6 bg-white border border-spiritual-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group ml-auto text-right">
                            <div className="ml-auto">
                                <span className="text-xs font-bold text-spiritual-400 uppercase">Next Surah</span>
                                <div className="text-lg font-bold text-spiritual-800">Surah {parseInt(id) + 1}</div>
                            </div>
                            <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SurahDetail;
