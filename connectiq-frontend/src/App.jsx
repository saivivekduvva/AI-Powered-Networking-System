import { useState } from "react"

const API_URL = "http://127.0.0.1:8000/recommend"

export default function App() {
  const [intent, setIntent] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchConnections = async () => {
    if (!intent.trim()) return

    setLoading(true)
    setError("")
    setResults([])

    try {
      const res = await fetch(
        `${API_URL}?intent=${encodeURIComponent(intent)}`
      )
      const data = await res.json()
      setResults(data.recommendations || [])
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
          className="w-full bg-black text-white p-3 rounded"
          onClick={fetchConnections}
        >
          Find Connections
        </button>

        {loading && (
          <p className="text-center mt-4">
            Finding best matches...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 mt-4">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          {results.map((p, i) => (
            <div key={i} className="border p-4 rounded">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.role}</p>

              <p className="mt-2 text-sm">
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
              </p>

              <p className="mt-2 text-sm">{p.why}</p>

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
