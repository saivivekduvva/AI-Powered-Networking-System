import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Download, 
  Filter, 
  History, 
  CheckCircle2,
  Share2,
  MoreHorizontal
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/recommendations";

export default function App() {
  const [intent, setIntent] = useState("");
  const [results, setResults] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  
  // New State for Advanced Features
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'high-score', 'researcher'
  const [searchHistory, setSearchHistory] = useState([]);

  const fetchConnections = async (searchTerm = intent) => {
    const term = searchTerm.trim();
    if (!term) return;

    setIntent(term); // Sync input if clicked from history
    setLoading(true);
    setError("");
    setResults([]);
    setSources([]);
    setSearched(true);

    // Add to history if unique
    if (!searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev].slice(0, 4));
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: term }),
      });
      const data = await res.json();
      setResults(data.recommendations || []);
      setSources(data.data_sources || []);
    } catch (err) {
      setError("Unable to retrieve intelligence.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchConnections();
  };

  // --- FILTER LOGIC ---
  const filteredResults = useMemo(() => {
    if (filterMode === "high-score") {
      return results.filter(r => r.opportunity_score > 30);
    }
    if (filterMode === "researcher") {
      return results.filter(r => r.role.toLowerCase().includes("research"));
    }
    return results;
  }, [results, filterMode]);

  // --- EXPORT FUNCTION ---
  const handleExport = () => {
    if (results.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Role,Score,Why"].join(",") + "\n" 
      + results.map(r => `"${r.name}","${r.role}",${r.opportunity_score},"${r.why}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "connectiq_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- MODERN HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5 shadow-lg shadow-indigo-500/30">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Connect<span className="text-indigo-600">IQ</span>
            </span>
          </div>
          
          {/* Stats / Status (Visual Only) */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> System Active</span>
          </div>
        </div>
      </header>

      {/* --- HERO & SEARCH --- */}
      <div className="bg-white border-b border-slate-200 pb-12 pt-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Signal</span> in the Noise
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
            AI-driven networking intelligence to discover high-value professional connections.
          </p>

          {/* INPUT FIELD */}
          <div className="relative max-w-2xl mx-auto group z-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-30 group-focus-within:opacity-100 blur transition duration-500"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl">
              <Search className="ml-4 text-slate-400" size={22} />
              <input
                className="flex-1 px-4 py-4 text-lg bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="E.g., 'Machine Learning in Healthcare'"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={() => fetchConnections()}
                disabled={loading || !intent}
                className="mr-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
              >
                {loading ? "Analyzing..." : "Search"}
              </button>
            </div>
          </div>

          {/* RECENT HISTORY CHIPS */}
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
                    className="text-xs px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full transition-colors border border-transparent hover:border-indigo-100"
                  >
                    {term}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- CONTROL BAR (Filters & Export) --- */}
      {searched && !loading && !error && (
        <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur border-b border-slate-200 py-3">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500 mr-2">Filter by:</span>
              {[
                { id: 'all', label: 'All Results' },
                { id: 'high-score', label: 'Top Opportunities (30+)' },
                { id: 'researcher', label: 'Researchers Only' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterMode === f.id 
                      ? "bg-indigo-100 text-indigo-700 shadow-sm ring-1 ring-indigo-200" 
                      : "text-slate-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                Found {filteredResults.length} connections
              </span>
              <button 
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-24 bg-slate-100 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredResults.map((p, i) => (
              <TechCard key={p.name + i} profile={p} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {!loading && searched && filteredResults.length === 0 && !error && (
          <div className="text-center py-20 text-slate-400">
             <Filter size={48} className="mx-auto mb-4 text-slate-300" />
             <p>No results match your filters.</p>
             <button onClick={() => setFilterMode('all')} className="text-indigo-600 text-sm font-medium mt-2 hover:underline">Clear Filters</button>
          </div>
        )}
      </main>
    </div>
  );
}

// --- MODERN CARD COMPONENT ---
function TechCard({ profile, index }) {
  // Score color logic
  const scoreColor = profile.opportunity_score > 30 
    ? "text-emerald-600 bg-emerald-50 ring-emerald-500/20" 
    : "text-amber-600 bg-amber-50 ring-amber-500/20";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
    >
      {/* Decorative Gradient Blob on Hover */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {profile.name}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">{profile.role}</p>
        </div>
        <div className={`flex flex-col items-center justify-center px-2.5 py-1 rounded-lg ring-1 ${scoreColor}`}>
          <span className="text-xs font-bold">{profile.opportunity_score}</span>
          <span className="text-[9px] uppercase font-semibold opacity-70">Score</span>
        </div>
      </div>

      {/* Why Now Badge */}
      {profile.why_now && (
        <div className="mb-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Sparkles size={11} className="text-blue-500" /> {profile.why_now}
          </span>
        </div>
      )}

      {/* Body */}
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">
        {profile.why}
      </p>

      {/* Context Tags */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {profile.contextual_triggers?.slice(0, 3).map((t, idx) => (
          <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded border border-slate-100">
            {t}
          </span>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto relative z-10">
        <div className="flex gap-2">
           <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Save">
              <CheckCircle2 size={18} />
           </button>
           <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Share">
              <Share2 size={18} />
           </button>
        </div>

        <a
          href={profile.profile_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors"
        >
          View <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}