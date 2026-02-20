import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, Plus, Trash2, Save, Image as ImageIcon, X, LogOut,
    Copy, Check, MapPin, Settings, Globe, Layout, Github,
    CloudUpload, AlertCircle, Loader2, MessageSquare, Upload, Trash
} from 'lucide-react';
import { initialProperties, Property } from '../data/properties';
import { siteConfig as initialSiteConfig } from '../data/siteConfig';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const AdminPage = () => {
    // --- AUTH ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // --- DATA ---
    const [activeTab, setActiveTab] = useState<'properties' | 'site' | 'github'>('properties');
    const [properties, setProperties] = useState<Property[]>([]);
    const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

    // --- GITHUB SYNC ---
    const [githubConfig, setGithubConfig] = useState({
        token: '',
        owner: 'arstate',
        repo: 'tiarpropertyweb',
        branch: 'main'
    });
    const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [syncMessage, setSyncMessage] = useState('');

    const [isCopying, setIsCopying] = useState(false);

    useEffect(() => {
        // Load properties from localStorage for session persistence
        const savedProps = localStorage.getItem('tiar_properties');
        if (savedProps) setProperties(JSON.parse(savedProps));
        else setProperties(initialProperties);

        // Load siteConfig from localStorage
        const savedConfig = localStorage.getItem('tiar_site_config');
        if (savedConfig) setSiteConfig(JSON.parse(savedConfig));

        // Load GitHub config
        const savedGithub = localStorage.getItem('tiar_github_config');
        if (savedGithub) setGithubConfig(JSON.parse(savedGithub));
    }, []);

    // --- HANDLERS ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '1509') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Password salah! Coba lagi.');
        }
    };

    const saveToLocal = (props: Property[], config: any) => {
        setProperties(props);
        setSiteConfig(config);
        localStorage.setItem('tiar_properties', JSON.stringify(props));
        localStorage.setItem('tiar_site_config', JSON.stringify(config));
    };

    const handleGithubConfigChange = (field: string, value: string) => {
        const newConfig = { ...githubConfig, [field]: value };
        setGithubConfig(newConfig);
        localStorage.setItem('tiar_github_config', JSON.stringify(newConfig));
    };

    // --- GITHUB API REAL-TIME SYNC ---
    const pushToGithub = async () => {
        if (!githubConfig.token) {
            setSyncStatus('error');
            setSyncMessage('Silakan atur GitHub Token di tab Settings terlebih dahulu.');
            return;
        }

        setSyncStatus('loading');
        setSyncMessage('Memulai proses sinkronisasi...');

        try {
            const filesToUpdate = [
                {
                    path: 'data/properties.ts',
                    content: `export interface Property {\n  id: number;\n  title: string;\n  location: string;\n  developer: string;\n  priceRange: number;\n  priceDisplay: string;\n  beds: number;\n  baths: number;\n  image: string;\n  tag: string;\n  type: string;\n  landSize?: string;\n  buildingSize?: string;\n  description?: string;\n  features?: string[];\n  gallery?: string[];\n}\n\nexport const initialProperties: Property[] = ${JSON.stringify(properties, null, 2)};`
                },
                {
                    path: 'data/siteConfig.ts',
                    content: `export const siteConfig = ${JSON.stringify(siteConfig, null, 2)};`
                }
            ];

            for (const file of filesToUpdate) {
                setSyncMessage(`Mengunggah ${file.path}...`);

                // 1. Get current file data to get SHA
                const getRes = await fetch(`https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${file.path}?ref=${githubConfig.branch}`, {
                    headers: { 'Authorization': `token ${githubConfig.token}` }
                });

                let sha = '';
                if (getRes.ok) {
                    const data = await getRes.json();
                    sha = data.sha;
                }

                // 2. Update/Create file
                const putRes = await fetch(`https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${file.path}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${githubConfig.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Admin Update: ${new Date().toLocaleString()}`,
                        content: btoa(unescape(encodeURIComponent(file.content))),
                        sha: sha || undefined,
                        branch: githubConfig.branch
                    })
                });

                if (!putRes.ok) {
                    const errorData = await putRes.json();
                    throw new Error(`Gagal mengunggah ${file.path}: ${errorData.message}`);
                }
            }

            setSyncStatus('success');
            setSyncMessage('Website Berhasil Diperbarui Online! Tunggu 1-2 menit untuk GitHub Build.');
            setTimeout(() => setSyncStatus('idle'), 5000);

        } catch (err: any) {
            setSyncStatus('error');
            setSyncMessage(err.message || 'Terjadi kesalahan saat push ke GitHub.');
        }
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
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Secure Password"
                            className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-center tracking-[0.5em] text-xl"
                        />
                        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                        <button type="submit" className="w-full py-4 bg-luxury-gold text-luxury-green rounded-xl font-bold hover:bg-white hover:text-black transition-all shadow-lg shadow-luxury-gold/20">
                            Authorize Access
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9f8] flex">

            {/* Sidebar Navigation */}
            <div className="w-24 md:w-64 bg-luxury-green text-white h-screen sticky top-0 flex flex-col p-4 md:p-6 transition-all border-r border-white/5 shadow-2xl z-50">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-luxury-yellow rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="font-serif font-bold text-luxury-green text-xl">T</span>
                    </div>
                    <div className="hidden md:block">
                        <p className="font-serif font-bold text-lg leading-none">Admin</p>
                        <p className="text-[10px] text-luxury-yellow/60 uppercase tracking-widest mt-1">Dashboard v2.0</p>
                    </div>
                </div>

                <div className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'properties' ? 'bg-white/10 text-luxury-yellow' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <Layout size={24} />
                        <span className="hidden md:block font-bold text-sm">Properties</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('site')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'site' ? 'bg-white/10 text-luxury-yellow' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <Globe size={24} />
                        <span className="hidden md:block font-bold text-sm">Site Design</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('github')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'github' ? 'bg-white/10 text-luxury-yellow' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <Github size={24} />
                        <span className="hidden md:block font-bold text-sm">Sync Online</span>
                    </button>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
                    >
                        <LogOut size={24} />
                        <span className="hidden md:block">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto">

                {/* Status Bar */}
                <AnimatePresence>
                    {syncStatus !== 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-8 p-4 rounded-2xl flex items-center gap-4 border shadow-sm ${syncStatus === 'loading' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                syncStatus === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
                                    'bg-red-50 border-red-100 text-red-700'
                                }`}
                        >
                            {syncStatus === 'loading' ? <Loader2 className="animate-spin" size={20} /> :
                                syncStatus === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                            <p className="font-bold text-sm">{syncMessage}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeTab === 'properties' && (
                    <div className="max-w-5xl">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="font-serif text-4xl text-luxury-green">Portfolio Items</h2>
                            <button
                                onClick={() => {
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
                                        tag: "New",
                                        type: "Modern"
                                    });
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-luxury-green text-white rounded-2xl font-bold shadow-xl shadow-luxury-green/10 hover:bg-black transition-all"
                            >
                                <Plus size={20} /> Add Property
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {properties.map(prop => (
                                <div key={prop.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                        <img src={prop.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-luxury-green">{prop.title}</h3>
                                        <p className="text-xs text-gray-400">{prop.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-luxury-green">{prop.priceDisplay}</p>
                                        <p className="text-[10px] text-gray-400">{prop.beds} Beds • {prop.baths} Baths</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingProperty(prop)} className="p-2 text-luxury-green hover:bg-gray-50 rounded-lg transition-all"><ImageIcon size={20} /></button>
                                        <button onClick={() => {
                                            if (window.confirm('Delete?')) {
                                                const updated = properties.filter(n => n.id !== prop.id);
                                                saveToLocal(updated, siteConfig);
                                            }
                                        }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={20} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'site' && (
                    <div className="max-w-4xl">
                        <h2 className="font-serif text-4xl text-luxury-green mb-10">Website Configuration</h2>
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">

                            {/* Logo Settings */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-gold mb-6 flex items-center gap-2">
                                    <Layout size={18} /> Logo & Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Brand Name (If no image)</label>
                                            <input
                                                value={siteConfig.logo.text}
                                                onChange={e => saveToLocal(properties, { ...siteConfig, logo: { ...siteConfig.logo, text: e.target.value } })}
                                                className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Sub-Text / Dot</label>
                                            <input
                                                value={siteConfig.logo.subtext}
                                                onChange={e => saveToLocal(properties, { ...siteConfig, logo: { ...siteConfig.logo, subtext: e.target.value } })}
                                                className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Logo Image Upload (Optional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const base64 = await fileToBase64(e.target.files[0]);
                                                    saveToLocal(properties, { ...siteConfig, logo: { ...siteConfig.logo, image: base64 } });
                                                }
                                            }}
                                            className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-luxury-gold file:text-white hover:file:bg-black transition-all cursor-pointer"
                                        />
                                        {siteConfig.logo.image && (
                                            <div className="relative inline-block mt-4 bg-gray-100 p-4 rounded-2xl">
                                                <img src={siteConfig.logo.image} className="h-12 object-contain" alt="Logo preview" />
                                                <button
                                                    onClick={() => saveToLocal(properties, { ...siteConfig, logo: { ...siteConfig.logo, image: "" } })}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-transform shadow-md"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Developer Partners */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-gold mb-6 flex items-center gap-2">
                                    <Layout size={18} /> Developer Partners
                                </h3>
                                <div className="space-y-4">
                                    {siteConfig.developerLogos?.map((dev, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl">
                                            <img src={dev.image} className="w-16 h-16 object-contain bg-white rounded-xl border border-gray-100 p-2 shadow-sm shrink-0" alt="" />
                                            <input
                                                value={dev.name}
                                                onChange={e => {
                                                    const newDevs = [...siteConfig.developerLogos];
                                                    newDevs[idx].name = e.target.value;
                                                    saveToLocal(properties, { ...siteConfig, developerLogos: newDevs });
                                                }}
                                                className="flex-1 w-full md:w-auto bg-white border-none px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-luxury-gold/20"
                                                placeholder="Developer Name"
                                            />
                                            <div className="flex w-full md:w-auto gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id={`dev-upload-${idx}`}
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const base64 = await fileToBase64(e.target.files[0]);
                                                            const newDevs = [...siteConfig.developerLogos];
                                                            newDevs[idx].image = base64;
                                                            saveToLocal(properties, { ...siteConfig, developerLogos: newDevs });
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`dev-upload-${idx}`} className="flex-1 flex justify-center cursor-pointer p-3 bg-luxury-gold/10 text-luxury-gold rounded-xl hover:bg-luxury-gold hover:text-white transition-colors">
                                                    <Upload size={20} />
                                                </label>
                                                <button
                                                    onClick={() => {
                                                        const newDevs = [...siteConfig.developerLogos];
                                                        newDevs.splice(idx, 1);
                                                        saveToLocal(properties, { ...siteConfig, developerLogos: newDevs });
                                                    }}
                                                    className="flex-1 flex justify-center p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => saveToLocal(properties, {
                                            ...siteConfig,
                                            developerLogos: [...(siteConfig.developerLogos || []), { name: "New Developer", image: "https://picsum.photos/400/400" }]
                                        })}
                                        className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl flex justify-center items-center gap-2 hover:border-luxury-gold hover:text-luxury-gold hover:bg-luxury-gold/5 transition-colors font-bold"
                                    >
                                        <Plus size={20} /> Add Partner
                                    </button>
                                </div>
                            </section>

                            {/* Hero Section */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-gold mb-6 flex items-center gap-2">
                                    <Globe size={18} /> Hero Homepage
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Main Heading</label>
                                        <textarea
                                            rows={2}
                                            value={siteConfig.hero.title}
                                            onChange={e => saveToLocal(properties, { ...siteConfig, hero: { ...siteConfig.hero, title: e.target.value } })}
                                            className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Short Description</label>
                                        <textarea
                                            rows={3}
                                            value={siteConfig.hero.subtitle}
                                            onChange={e => saveToLocal(properties, { ...siteConfig, hero: { ...siteConfig.hero, subtitle: e.target.value } })}
                                            className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Contact Info */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-gold mb-6 flex items-center gap-2">
                                    <MessageSquare size={18} /> Official Contact
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 px-1">WhatsApp (62...)</label>
                                        <input
                                            value={siteConfig.contact.whatsapp}
                                            onChange={e => saveToLocal(properties, { ...siteConfig, contact: { ...siteConfig.contact, whatsapp: e.target.value } })}
                                            className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 px-1">Official Email</label>
                                        <input
                                            value={siteConfig.contact.email}
                                            onChange={e => saveToLocal(properties, { ...siteConfig, contact: { ...siteConfig.contact, email: e.target.value } })}
                                            className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-luxury-gold/20"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeTab === 'github' && (
                    <div className="max-w-4xl text-center md:text-left">
                        <h2 className="font-serif text-4xl text-luxury-green mb-4">Sync Online</h2>
                        <p className="text-gray-500 mb-10 max-w-2xl">Atur koneksi GitHub untuk menyimpan semua perubahan secara otomatis ke website online.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                                <h3 className="text-lg font-bold text-luxury-green mb-4 flex items-center gap-2">
                                    <Github size={20} /> Connection Settings
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Personal Access Token (PAT)</label>
                                        <input
                                            type="password"
                                            value={githubConfig.token}
                                            onChange={e => handleGithubConfigChange('token', e.target.value)}
                                            placeholder="ghp_xxxxxxxxxxxx"
                                            className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-luxury-gold/20"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Username</label>
                                            <input
                                                value={githubConfig.owner}
                                                onChange={e => handleGithubConfigChange('owner', e.target.value)}
                                                className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-luxury-gold/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Repo Name</label>
                                            <input
                                                value={githubConfig.repo}
                                                onChange={e => handleGithubConfigChange('repo', e.target.value)}
                                                className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-luxury-gold/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                    <p className="text-[11px] text-yellow-700 leading-relaxed italic">
                                        <AlertCircle size={14} className="inline mr-1" />
                                        Token Anda disimpan secara aman hanya di browser ini. Pastikan Token memiliki izin "repo access".
                                    </p>
                                </div>
                            </div>

                            <div className="bg-luxury-green rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="text-2xl font-serif mb-4">Mulai Sinkronisasi</h3>
                                        <p className="text-white/60 text-sm mb-8">
                                            Semua foto produk, teks website, dan pengaturan lainnya akan langsung diperbarui di repository GitHub dan dipublikasikan otomatis.
                                        </p>
                                    </div>
                                    <button
                                        onClick={pushToGithub}
                                        disabled={syncStatus === 'loading'}
                                        className="w-full py-5 bg-luxury-gold text-luxury-green rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-luxury-gold/20 disabled:opacity-50"
                                    >
                                        {syncStatus === 'loading' ? <Loader2 className="animate-spin" size={24} /> : <CloudUpload size={24} />}
                                        PUSH KE ONLINE LIVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Editor Modal for Properties */}
            <AnimatePresence>
                {editingProperty && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingProperty(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="font-serif text-3xl text-luxury-green">Property Detailed</h2>
                                <button onClick={() => setEditingProperty(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"><X /></button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Property Name</label>
                                    <input value={editingProperty.title} onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Tag Line (e.g. Hot Deal)</label>
                                    <input value={editingProperty.tag} onChange={e => setEditingProperty({ ...editingProperty, tag: e.target.value })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Location</label>
                                    <input value={editingProperty.location} onChange={e => setEditingProperty({ ...editingProperty, location: e.target.value })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Developer</label>
                                    <input value={editingProperty.developer} onChange={e => setEditingProperty({ ...editingProperty, developer: e.target.value })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Price display (e.g. Start 500jt-an)</label>
                                    <input value={editingProperty.priceDisplay} onChange={e => setEditingProperty({ ...editingProperty, priceDisplay: e.target.value })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Price Range (Millions)</label>
                                    <input type="number" value={editingProperty.priceRange} onChange={e => setEditingProperty({ ...editingProperty, priceRange: parseInt(e.target.value) || 0 })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Design Type</label>
                                    <input value={editingProperty.type} onChange={e => setEditingProperty({ ...editingProperty, type: e.target.value })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Beds</label>
                                        <input type="number" value={editingProperty.beds} onChange={e => setEditingProperty({ ...editingProperty, beds: parseInt(e.target.value) || 0 })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Baths</label>
                                        <input type="number" value={editingProperty.baths} onChange={e => setEditingProperty({ ...editingProperty, baths: parseInt(e.target.value) || 0 })} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl" />
                                    </div>
                                </div>
                                <div className="col-span-1 sm:col-span-2 space-y-2 border-t border-gray-100 pt-6 mt-4">
                                    <label className="text-xs uppercase font-bold text-luxury-gold">Main Image Upload</label>
                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                        {editingProperty.image ? (
                                            <img src={editingProperty.image} className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200" alt="Preview" />
                                        ) : (
                                            <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400"><ImageIcon /></div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const base64 = await fileToBase64(e.target.files[0]);
                                                    setEditingProperty({ ...editingProperty, image: base64 });
                                                }
                                            }}
                                            className="flex-1 bg-white border border-gray-100 px-4 py-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-luxury-green file:text-white cursor-pointer hover:shadow-sm transition-shadow"
                                        />
                                    </div>
                                    <div className="mt-2 text-right">
                                        <button
                                            onClick={() => {
                                                const url = prompt("Atau masukkan URL gambar secara manual:");
                                                if (url) setEditingProperty({ ...editingProperty, image: url });
                                            }}
                                            className="text-[10px] text-gray-400 hover:text-luxury-green uppercase tracking-widest font-bold underline cursor-pointer"
                                        >
                                            Input Manual URL
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-1 sm:col-span-2 space-y-2">
                                    <label className="text-xs uppercase font-bold text-luxury-gold flex items-center gap-2">
                                        Gallery Photos Upload <span className="text-[10px] text-gray-400 font-normal border px-2 py-0.5 rounded-full">Bisa pilih lebih dari satu</span>
                                    </label>
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={async (e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const files = Array.from(e.target.files as FileList);
                                                    const base64Promises = files.map(file => fileToBase64(file));
                                                    const base64Strings = await Promise.all(base64Promises);
                                                    setEditingProperty({
                                                        ...editingProperty,
                                                        gallery: [...(editingProperty.gallery || []), ...base64Strings]
                                                    });
                                                }
                                            }}
                                            className="w-full bg-white border border-gray-100 px-4 py-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-luxury-gold file:text-white hover:file:bg-black transition-all cursor-pointer"
                                        />

                                        {/* Gallery Preview Grid */}
                                        {editingProperty.gallery && editingProperty.gallery.length > 0 && (
                                            <div className="flex gap-4 flex-wrap mt-6">
                                                {editingProperty.gallery.map((imgUrl, i) => (
                                                    <div key={i} className="relative group shadow-md rounded-xl overflow-hidden border border-gray-200 bg-white p-1">
                                                        <img src={imgUrl} className="w-20 h-20 object-cover rounded-lg" alt="Gallery preview" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                            <button
                                                                onClick={() => {
                                                                    const newGallery = [...editingProperty.gallery!];
                                                                    newGallery.splice(i, 1);
                                                                    setEditingProperty({ ...editingProperty, gallery: newGallery });
                                                                }}
                                                                className="bg-red-500 text-white rounded-full p-2 hover:scale-110 active:scale-95 transition-transform"
                                                            >
                                                                <Trash size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div className="mt-10 flex gap-4">
                                <button onClick={() => setEditingProperty(null)} className="flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all">Discard</button>
                                <button onClick={() => {
                                    const exists = properties.find(p => p.id === editingProperty.id);
                                    const updated = exists ? properties.map(p => p.id === editingProperty.id ? editingProperty : p) : [...properties, editingProperty];
                                    saveToLocal(updated, siteConfig);
                                    setEditingProperty(null);
                                }} className="flex-1 py-4 bg-luxury-green text-white rounded-2xl font-bold hover:bg-black transition-all">Simpan Item</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};
