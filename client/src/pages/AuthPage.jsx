import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                await login({ email: formData.email, password: formData.password });
            } else {
                await register(formData);
            }
            navigate('/quran');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-spiritual-50/20 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-[40px] shadow-2xl border border-spiritual-100 overflow-hidden">
                    <div className="spiritual-gradient p-10 text-white text-center">
                        <h1 className="text-3xl font-black mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Join Nur al-Quran'}
                        </h1>
                        <p className="text-white/70 font-light">
                            {mode === 'login'
                                ? 'Continue your spiritual journey with us.'
                                : 'Start tracking your Quranic progress today.'}
                        </p>
                    </div>

                    <div className="p-10 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 italic">
                                "{error}"
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-spiritual-400 uppercase tracking-widest ml-1">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-300" size={18} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter username"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-spiritual-50 border border-spiritual-100 rounded-2xl focus:ring-2 focus:ring-accent-emerald focus:border-transparent outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-spiritual-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-300" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-spiritual-50 border border-spiritual-100 rounded-2xl focus:ring-2 focus:ring-accent-emerald focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-spiritual-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-spiritual-300" size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-spiritual-50 border border-spiritual-100 rounded-2xl focus:ring-2 focus:ring-accent-emerald focus:border-transparent outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-spiritual-800 text-white py-5 rounded-2xl font-bold shadow-lg hover:bg-spiritual-900 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isLoading ? <Loader className="animate-spin" size={20} /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                                {!isLoading && <ArrowRight size={20} />}
                            </button>
                        </form>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="text-sm font-bold text-spiritual-600 hover:text-spiritual-900 transition-colors"
                            >
                                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
