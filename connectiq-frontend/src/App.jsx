import { useState } from "react"

const API_URL = "http://127.0.0.1:8000/recommendations"

export default function App() {
  const [intent, setIntent] = useState("")
  const [results, setResults] = useState([])
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchConnections = async () => {
    if (!intent.trim()) return

    setLoading(true)
    setError("")
    setResults([])
    setSources([])

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intent: intent.trim() }),
      })

      const data = await res.json()
      setResults(data.recommendations || [])
      setSources(data.data_sources || [])
    } catch (err) {
      setError("Failed to fetch recommendations")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          ConnectIQ
        </h1>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="e.g. machine learning mentor"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
        />

        <button
          className="w-full bg-black text-white p-3 rounded disabled:opacity-50"
          onClick={fetchConnections}
          disabled={loading}
        >
          {loading ? "Finding matches..." : "Find Connections"}
        </button>

        {/* Data sources badge (IMPORTANT) */}
        {sources.length > 0 && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            Using public data from:{" "}
            <span className="font-medium">
              {sources.join(", ")}
            </span>
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 mt-4">
            {error}
          </p>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && intent && !error && (
          <p className="text-center text-sm text-gray-500 mt-6">
            No recommendations found. Try refining your intent.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {results.map((p, i) => (
            <div key={i} className="border p-4 rounded">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.role}</p>

              {/* Score + WHY NOW badge */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    p.opportunity_score > 70
                      ? "bg-green-100 text-green-700"
                      : p.opportunity_score > 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Score: {p.opportunity_score}
                </span>

                {p.why_now && (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {p.why_now}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-700">{p.why}</p>

              <a
                href={p.profile_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                View Profile →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
