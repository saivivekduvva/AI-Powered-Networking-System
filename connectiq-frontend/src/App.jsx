import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ArrowRight, Sparkles, Download, Filter, 
  History, Share2, Sun, Moon, Bookmark, Heart,
  Lock, Mail, LogOut
} from "lucide-react";

// --- IMPORT YOUR LOGIC FILES ---
import { login, signup } from "./auth";
import { getToken, saveToken, logout } from "./token";
import { apiRequest } from "./api";

// --- AUTHENTICATION SCREEN COMPONENT ---
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const res = await login(email, password);
        // Your auth.js returns the whole JSON. We assume access_token is inside.
        if (res.access_token) {
          saveToken(res.access_token);
          onLogin(); // Update parent state to show Dashboard
        } else {
            throw new Error("No token received");
        }
      } else {
        // --- SIGNUP LOGIC ---
        // Your signup function only takes email & password
        await signup(email, password);
        setSuccessMsg("Account created successfully! Please login.");
        setIsLogin(true); // Switch to login view
        setPassword(""); // Clear password for security
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-800">
        
        {/* Left Side - Visuals */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-2 rounded-xl backdrop-blur-sm mb-6">
              <Sparkles className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">ConnectIQ</h1>
            <p className="text-indigo-100 text-lg">
              Unlock the power of AI-driven networking intelligence. Find the signal in the noise.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-sm text-indigo-100 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Live Opportunity Scoring</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span>Contextual Triggers</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isLogin ? "Enter your credentials to access the intelligence hub." : "Get started with your free account."}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Sign Up"} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccessMsg("");
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = ({ onLogout }) => {
  // --- STATE MANAGEMENT ---
  const [intent, setIntent] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  
  // Advanced Features
  const [filterMode, setFilterMode] = useState("all"); 
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Theme & Persistence
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);

  // --- EFFECTS ---
  useEffect(() => {
    const saved = localStorage.getItem("connectiq_saved");
    const history = localStorage.getItem("connectiq_history");
    const theme = localStorage.getItem("connectiq_theme");
    
    if (saved) setSavedProfiles(JSON.parse(saved));
    if (history) setSearchHistory(JSON.parse(history));
    if (theme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("connectiq_saved", JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  useEffect(() => {
    localStorage.setItem("connectiq_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem("connectiq_theme", isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- ACTIONS ---
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const toggleSaveProfile = (profile) => {
    const isAlreadySaved = savedProfiles.some(p => p.name === profile.name);
    if (isAlreadySaved) {
      setSavedProfiles(prev => prev.filter(p => p.name !== profile.name));
    } else {
      setSavedProfiles(prev => [...prev, profile]);
    }
  };

  const fetchConnections = async (searchTerm = intent) => {
    const term = searchTerm.trim();
    if (!term) return;

    setIntent(term);
    setLoading(true);
    setError("");
    setResults([]);
    setSearched(true);
    setFilterMode("all"); 

    if (!searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev].slice(0, 4));
    }

    try {
      // --- UPDATED: USE apiRequest HERE ---
      // We use your apiRequest helper which automatically handles errors
      // and can inject the token if you modify apiRequest to accept it or read from storage.
      // Based on your api.js, we need to pass the token manually.
      
      const token = getToken();
      
      const data = await apiRequest(
          "/recommendations", 
          "POST", 
          { intent: term }, 
          token
      );

      setResults(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to retrieve intelligence.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchConnections();
  };

  // --- FILTER LOGIC ---
  const filteredResults = useMemo(() => {
    if (filterMode === "saved") return savedProfiles;
    let data = results;
    if (filterMode === "high-score") {
      return data.filter(r => r.opportunity_score > 30);
    }
    return data;
  }, [results, savedProfiles, filterMode]);

  const handleExport = () => {
    if (filteredResults.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Role,Score,Why"].join(",") + "\n" 
      + filteredResults.map(r => `"${r.name}","${r.role}",${r.opportunity_score},"${r.why}"`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "connectiq_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
        
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterMode('all')}>
              <div className="bg-indigo-600 rounded-lg p-1.5 shadow-lg shadow-indigo-500/30">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Connect<span className="text-indigo-600 dark:text-indigo-400">IQ</span>
              </span>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* --- HERO SECTION --- */}
        <div className="bg-white border-b border-slate-200 pb-12 pt-10 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Signal</span> in the Noise
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              AI-driven networking intelligence. Discover high-value connections hidden in public data.
            </p>

            {/* SEARCH BAR */}
            <div className="relative max-w-2xl mx-auto group z-20">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-30 group-focus-within:opacity-100 blur transition duration-500"></div>
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl transition-colors duration-300">
                <Search className="ml-4 text-slate-400 dark:text-slate-500" size={22} />
                <input
                  className="flex-1 px-4 py-4 text-lg bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="E.g., 'Generative AI Researchers'"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => fetchConnections()}
                  disabled={loading || !intent}
                  className="mr-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                >
                  {loading ? "Scanning..." : "Search"}
                </button>
              </div>
            </div>

            {/* HISTORY CHIPS */}
            <AnimatePresence>
              {searchHistory.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mt-4 flex-wrap"
                >
                  <span className="text-xs text-slate-400 flex items-center gap-1"><History size={12}/> Recent:</span>
                  {searchHistory.map((term, i) => (
                    <button 
                      key={i}
                      onClick={() => fetchConnections(term)}
                      className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- CONTROL BAR --- */}
        {(searched || savedProfiles.length > 0) && (
          <div className="sticky top-16 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 py-3 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
              
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Results', icon: Filter },
                  { id: 'high-score', label: 'Top Opportunities', icon: Sparkles },
                  { id: 'saved', label: `Saved (${savedProfiles.length})`, icon: Bookmark }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterMode(f.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      filterMode === f.id 
                        ? "bg-indigo-100 text-indigo-700 shadow-sm ring-1 ring-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:ring-indigo-700" 
                        : "text-slate-600 hover:bg-white hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <f.icon size={14} />
                    {f.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleExport}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 transition-all"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
        )}

        {/* --- MAIN GRID --- */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse dark:bg-slate-800"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse dark:bg-slate-800"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse dark:bg-slate-800"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-slate-100 rounded w-full animate-pulse dark:bg-slate-800"></div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResults.map((p, i) => (
                <TechCard 
                  key={p.name} 
                  profile={p} 
                  index={i} 
                  isSaved={savedProfiles.some(sp => sp.name === p.name)}
                  onToggleSave={() => toggleSaveProfile(p)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* EMPTY STATES */}
          {!loading && filteredResults.length === 0 && (
            <div className="text-center py-20 text-slate-400 dark:text-slate-600">
               {filterMode === 'saved' ? (
                 <>
                   <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                   <p>No saved profiles yet.</p>
                   <button onClick={() => setFilterMode('all')} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mt-2 hover:underline">Browse connections</button>
                 </>
               ) : searched ? (
                 <>
                   <Filter size={48} className="mx-auto mb-4 opacity-50" />
                   <p>No results match your filters.</p>
                   <button onClick={() => setFilterMode('all')} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mt-2 hover:underline">Clear Filters</button>
                 </>
               ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- APP ORCHESTRATOR ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // --- UPDATED: USE REAL TOKEN CHECK HERE ---
    const token = getToken();
    if (token) {
        setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // --- UPDATED: REMOVE TOKEN ON LOGOUT ---
    logout();
    setIsAuthenticated(false);
  };

  if (checkingAuth) return null; // Avoid flicker

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <Dashboard onLogout={handleLogout} />
        </motion.div>
      ) : (
        <motion.div 
          key="auth"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <AuthScreen onLogin={handleLogin} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- CARD COMPONENT (UNCHANGED) ---
function TechCard({ profile, index, isSaved, onToggleSave }) {
  const scoreColor = profile.opportunity_score > 30 
    ? "text-emerald-600 bg-emerald-50 ring-emerald-500/20 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-500/40" 
    : "text-amber-600 bg-amber-50 ring-amber-500/20 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-500/40";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.90 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {profile.name}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{profile.role}</p>
        </div>
        <div className={`flex flex-col items-center justify-center px-2.5 py-1 rounded-lg ring-1 ${scoreColor}`}>
          <span className="text-xs font-bold">{profile.opportunity_score}</span>
          <span className="text-[9px] uppercase font-semibold opacity-70">Score</span>
        </div>
      </div>

      {profile.why_now && (
        <div className="mb-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
            <Sparkles size={11} className="text-blue-500 dark:text-blue-400" /> {profile.why_now}
          </span>
        </div>
      )}

      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-grow relative z-10">
        {profile.why}
      </p>

      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {profile.contextual_triggers?.slice(0, 3).map((t, idx) => (
          <span key={idx} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded border border-slate-100 dark:border-slate-700">
            {t}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto relative z-10">
        <div className="flex gap-2">
           <motion.button 
             whileTap={{ scale: 0.8 }}
             onClick={onToggleSave}
             className={`p-2 rounded-full transition-colors ${
               isSaved 
                 ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                 : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30"
             }`} 
             title={isSaved ? "Remove from Saved" : "Save Profile"}
           >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
           </motion.button>
           
           <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-full transition-colors">
              <Share2 size={18} />
           </button>
        </div>

        <a
          href={profile.profile_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        >
          View <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}