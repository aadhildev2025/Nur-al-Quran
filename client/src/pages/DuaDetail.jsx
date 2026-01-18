import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Star, Share2, Copy, Check } from 'lucide-react';
import { allDuas } from '../data/duas';

const DuaDetail = () => {
    const { category } = useParams();
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [language, setLanguage] = useState('English');

    const filteredDuas = allDuas.filter(dua => dua.category === category);

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div className="pt-28 pb-20 px-4 min-h-screen bg-spiritual-50/20">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <Link to="/duas" className="p-2 hover:bg-white rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-spiritual-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-spiritual-900">{category}</h1>
                    </div>

                    <div className="flex p-1 bg-white rounded-2xl border border-spiritual-100 shadow-sm">
                        <button
                            onClick={() => setLanguage('English')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === 'English' ? 'bg-spiritual-800 text-white shadow-md' : 'text-spiritual-400 hover:bg-spiritual-50'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('Tamil')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === 'Tamil' ? 'bg-spiritual-800 text-white shadow-md' : 'text-spiritual-400 hover:bg-spiritual-50'}`}
                        >
                            தமிழ்
                        </button>
                    </div>
                </div>

                {filteredDuas.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-spiritual-100">
                        <Star className="mx-auto mb-4 text-spiritual-200" size={48} />
                        <h2 className="text-2xl font-bold text-spiritual-800">Coming Soon</h2>
                        <p className="text-spiritual-500 mt-2">We are adding more authentic supplications to this category.</p>
                        <Link to="/duas" className="mt-8 inline-block bg-spiritual-800 text-white px-8 py-3 rounded-xl font-bold">
                            Back to Categories
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredDuas.map((dua, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-spiritual-50 relative overflow-hidden group hover:border-spiritual-200 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => copyToClipboard(`${dua.arabic}\n\n${language === 'English' ? dua.translation : dua.translation_ta}`, idx)}
                                        className="p-3 bg-spiritual-50 rounded-2xl text-spiritual-600 hover:bg-spiritual-100 transition-colors"
                                    >
                                        {copiedIdx === idx ? <Check size={18} className="text-accent-emerald" /> : <Copy size={18} />}
                                    </button>
                                    <button className="p-3 bg-spiritual-50 rounded-2xl text-spiritual-600 hover:bg-spiritual-100 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-spiritual-800 mb-2">{dua.title}</h3>
                                    <div className="h-1 w-12 bg-accent-gold rounded-full" />
                                </div>

                                <p className="text-4xl md:text-5xl font-arabic text-spiritual-950 text-right leading-[2] mb-10 select-none">
                                    {dua.arabic}
                                </p>

                                <div className="space-y-6">
                                    <div className="p-6 bg-spiritual-50 rounded-3xl border border-spiritual-100">
                                        <p className="text-lg text-spiritual-700 font-light italic leading-relaxed">
                                            "{language === 'English' ? dua.translation : dua.translation_ta}"
                                        </p>
                                    </div>

                                    {dua.benefit && (
                                        <div className="flex gap-4 items-start px-4">
                                            <Star className="text-accent-gold shrink-0 mt-1" size={20} fill="currentColor" />
                                            <p className="text-sm text-spiritual-500 font-medium italic">
                                                <span className="text-spiritual-900 font-bold not-italic">Benefit:</span> {dua.benefit}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DuaDetail;
