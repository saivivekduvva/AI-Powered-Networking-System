import requests

OPENALEX_URL = "https://api.openalex.org/authors"

def fetch_scholar_profiles(query, limit=5):
    """
    Fetches researcher profiles using OpenAlex
    (Google Scholar–equivalent, official API).
    """
    params = {
        "search": query,
        "per-page": limit
    }

    resp = requests.get(OPENALEX_URL, params=params, timeout=10)
    if resp.status_code != 200:
        return []

    data = resp.json().get("results", [])
    profiles = []

    for author in data:
        topics = author.get("x_concepts", [])[:3]
        skills = [t["display_name"] for t in topics if "display_name" in t]

        profiles.append({
            "name": author.get("display_name"),
            "role": "Researcher",
            "industry": "Academia / Research",
            "skills": ", ".join(skills) or "Research",
            "recent_activity_score": min(
                100,
                int(author.get("works_count", 0) / 2)
            ),
            "profile_url": author.get("id")
        })

    return profiles
