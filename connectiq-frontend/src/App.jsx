import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ExternalLink, ArrowRight, Zap, Database } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/recommendations";

export default function App() {
  const [intent, setIntent] = useState("");
  const [results, setResults] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const fetchConnections = async () => {
    if (!intent.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setSources([]);
    setSearched(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: intent.trim() }),
      });

      const data = await res.json();
      setResults(data.recommendations || []);
      setSources(data.data_sources || []);
    } catch (err) {
      setError("Failed to fetch recommendations. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchConnections();
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-indigo-100">
      
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200 pb-12 pt-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100"
            >
              <Zap size={14} fill="currentColor" /> AI-Powered Networking
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
              Connect<span className="text-indigo-600">IQ</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Discover high-value professional connections hidden in public data.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-100 p-2">
              <Search className="ml-3 text-slate-400" size={20} />
              <input
                className="flex-1 px-4 py-3 text-base focus:outline-none bg-transparent placeholder:text-slate-400 text-slate-700"
                placeholder="Describe your goal (e.g., 'Find experts in Generative AI for healthcare')"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-xl"
                onClick={fetchConnections}
                disabled={loading || !intent}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>Find <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>

          {/* Sources Indicator */}
          <AnimatePresence>
            {sources.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500"
              >
                <Database size={12} />
                <span>Sourced from public data: <span className="font-semibold text-slate-700">{sources.join(", ")}</span></span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="h-full w-full animate-shimmer"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="bg-slate-50 inline-block p-4 rounded-full mb-4">
               <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-semibold text-lg">No matches found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Try broadening your search terms or checking for spelling errors.</p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {results.map((p, i) => (
              <ResultCard key={i} profile={p} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: Result Card ---
// Extracted for cleaner code and isolated animation logic
function ResultCard({ profile, index }) {
  // Color coding logic based on score
  const getScoreColor = (score) => {
    if (score >= 30) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 20) return "text-indigo-700 bg-indigo-50 border-indigo-200";
    return "text-slate-600 bg-slate-100 border-slate-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {profile.name}
          </h2>
          <p className="text-sm font-medium text-slate-500">{profile.role}</p>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-bold border ${getScoreColor(profile.opportunity_score)}`}>
          {profile.opportunity_score}
        </div>
      </div>

      {/* Why Now Badge */}
      {profile.why_now && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Sparkles size={12} /> {profile.why_now}
          </span>
        </div>
      )}

      {/* Main Reason (Why) */}
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
        {profile.why}
      </p>

      {/* Contextual Triggers (Chips) */}
      {profile.contextual_triggers && profile.contextual_triggers.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Shared Context
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.contextual_triggers.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer / Action */}
      <div className="pt-4 mt-auto border-t border-slate-100">
        <a
          href={profile.profile_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center w-full gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 py-2.5 rounded-lg transition-colors"
        >
          View Profile <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
}