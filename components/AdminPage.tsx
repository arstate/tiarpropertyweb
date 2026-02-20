import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Plus, Trash2, Save, Image as ImageIcon, X, LogOut, Download, Copy, Check, MapPin } from 'lucide-react';
import { initialProperties, Property } from '../data/properties';

export const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [properties, setProperties] = useState<Property[]>([]);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [isCopying, setIsCopying] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('tiar_properties');
        if (saved) {
            setProperties(JSON.parse(saved));
        } else {
            setProperties(initialProperties);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '1509') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Password salah! Coba lagi.');
        }
    };

    const handleSaveToLocalStorage = () => {
        localStorage.setItem('tiar_properties', JSON.stringify(properties));
        alert('Data tersimpan sementara di browser ini!');
    };

    const deleteProperty = (id: number) => {
        if (window.confirm('Yakin ingin menghapus properti ini?')) {
            const updated = properties.filter((p: Property) => p.id !== id);
            setProperties(updated);
        }
    };

    const startEdit = (property: Property) => {
        setEditingProperty({ ...property });
    };

    const startAdd = () => {
        setEditingProperty({
            id: Date.now(),
            title: "",
            location: "",
            developer: "",
            priceRange: 0,
            priceDisplay: "",
            beds: 0,
            baths: 0,
            image: "",
            tag: "",
            type: ""
        });
    };

    const saveEdit = () => {
        if (!editingProperty) return;

        if (properties.find((p: Property) => p.id === editingProperty.id)) {
            setProperties(properties.map((p: Property) => p.id === editingProperty.id ? editingProperty : p));
        } else {
            setProperties([...properties, editingProperty]);
        }
        setEditingProperty(null);
    };

    const copyJson = () => {
        const jsonString = `export const initialProperties = ${JSON.stringify(properties, null, 2)};`;
        navigator.clipboard.writeText(jsonString);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0f140f] flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxury-gold rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl w-full max-w-md text-center relative z-10"
                >
                    <div className="w-20 h-20 bg-luxury-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-luxury-gold/30">
                        <Lock className="text-luxury-gold" size={32} />
                    </div>
                    <h1 className="font-serif text-3xl text-white mb-2 tracking-tight">Access Control</h1>
                    <p className="text-gray-400 mb-8 text-sm">Enter the secure key to manage your assets</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Secure Password"
                                className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-center tracking-[0.5em] text-xl"
                            />
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-4 bg-luxury-gold text-luxury-green rounded-xl font-bold hover:bg-white hover:text-black transition-all shadow-lg shadow-luxury-gold/20"
                        >
                            Authorize Access
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9f8] pt-32 pb-24 px-6">
            <div className="max-w-6xl mx-auto">

                {/* Header Dashboard */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-4xl text-luxury-green mb-2">Portfolio Manager</h1>
                        <p className="text-luxury-slate">Manage your properties and showcase items.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={copyJson}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-luxury-green rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                            {isCopying ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {isCopying ? 'Copied to Code!' : 'Copy Code for Dev'}
                        </button>
                        <button
                            onClick={startAdd}
                            className="flex items-center gap-2 px-6 py-3 bg-luxury-green text-white rounded-full text-sm font-bold shadow-lg shadow-luxury-green/20 hover:bg-black transition-all active:scale-95"
                        >
                            <Plus size={18} /> Add New Property
                        </button>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="p-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 gap-6">
                    {properties.map((prop) => (
                        <motion.div
                            layoutId={prop.id.toString()}
                            key={prop.id}
                            className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-xl hover:border-luxury-gold/20 transition-all duration-300"
                        >
                            <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                <img src={prop.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-luxury-gold text-white text-[10px] font-bold rounded-md">{prop.tag}</div>
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{prop.type}</span>
                                    <span className="text-[10px] text-gray-300">•</span>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">{prop.developer}</span>
                                </div>
                                <h3 className="font-serif text-xl text-luxury-green">{prop.title}</h3>
                                <p className="text-sm text-gray-400 flex items-center gap-1 justify-center sm:justify-start"><MapPin size={12} /> {prop.location}</p>
                            </div>

                            <div className="text-center sm:text-right">
                                <p className="text-lg font-bold text-luxury-green mb-1">{prop.priceDisplay}</p>
                                <div className="flex gap-4 text-xs text-gray-400 justify-center sm:justify-end">
                                    <span>{prop.beds} Beds</span>
                                    <span>{prop.baths} Baths</span>
                                </div>
                            </div>

                            <div className="flex gap-2 sm:ml-4">
                                <button
                                    onClick={() => startEdit(prop)}
                                    className="p-3 text-luxury-green hover:bg-luxury-gold/10 hover:text-luxury-gold rounded-2xl transition-all"
                                    title="Edit"
                                >
                                    <ImageIcon size={20} />
                                </button>
                                <button
                                    onClick={() => deleteProperty(prop.id)}
                                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-12 p-8 bg-luxury-green text-white rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-serif mb-3 flex items-center gap-2">
                            <Save size={20} className="text-luxury-gold" />
                            How to Permanent Update?
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                            Since this is a static project on GitHub Pages, changes here are temporary to your browser.
                            To make them permanent: <strong>Edit</strong> your properties, click <strong>"Copy Code for Dev"</strong>,
                            then paste that content into your <code>data/properties.ts</code> file in the repository.
                        </p>
                    </div>
                </div>
            </div>

            {/* Editor Modal */}
            <AnimatePresence>
                {editingProperty && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setEditingProperty(null)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] p-4 sm:p-10 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-serif text-3xl text-luxury-green">Property Detailed</h2>
                                <button onClick={() => setEditingProperty(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                                    <X />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Project Name</label>
                                    <input
                                        type="text"
                                        value={editingProperty.title}
                                        onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })}
                                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Tag Line</label>
                                    <input
                                        type="text"
                                        value={editingProperty.tag}
                                        onChange={e => setEditingProperty({ ...editingProperty, tag: e.target.value })}
                                        placeholder="e.g. Hot Deal"
                                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Location</label>
                                    <input
                                        type="text"
                                        value={editingProperty.location}
                                        onChange={e => setEditingProperty({ ...editingProperty, location: e.target.value })}
                                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Developer</label>
                                    <input
                                        type="text"
                                        value={editingProperty.developer}
                                        onChange={e => setEditingProperty({ ...editingProperty, developer: e.target.value })}
                                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Price Label</label>
                                    <input
                                        type="text"
                                        value={editingProperty.priceDisplay}
                                        onChange={e => setEditingProperty({ ...editingProperty, priceDisplay: e.target.value })}
                                        placeholder="e.g. Start 500jt-an"
                                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Price Range (Millions)</label>
                                    <input
                                        type="number"
                                        value={editingProperty.priceRange}
                                        onChange={e => setEditingProperty({ ...editingProperty, priceRange: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Design Type</label>
                                    <input
                                        type="text"
                                        value={editingProperty.type}
                                        onChange={e => setEditingProperty({ ...editingProperty, type: e.target.value })}
                                        placeholder="e.g. Modern Minimalist"
                                        className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Beds</label>
                                        <input
                                            type="number"
                                            value={editingProperty.beds}
                                            onChange={e => setEditingProperty({ ...editingProperty, beds: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Baths</label>
                                        <input
                                            type="number"
                                            value={editingProperty.baths}
                                            onChange={e => setEditingProperty({ ...editingProperty, baths: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-2">Image URL</label>
                                <input
                                    type="text"
                                    value={editingProperty.image}
                                    onChange={e => setEditingProperty({ ...editingProperty, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                />
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    onClick={() => setEditingProperty(null)}
                                    className="flex-1 py-4 border border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    onClick={saveEdit}
                                    className="flex-1 py-4 bg-luxury-green text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-luxury-green/10"
                                >
                                    Apply & Save
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
