import requests
from bs4 import BeautifulSoup

BASE_URL = "https://devpost.com"

def fetch_devpost_profiles(query, limit=5):
    search_url = f"{BASE_URL}/search?query={query}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    resp = requests.get(search_url, headers=headers, timeout=10)
    if resp.status_code != 200:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    users = soup.select("a.user-link")[:limit]

    profiles = []

    for u in users:
        name = u.text.strip()
        profile_url = BASE_URL + u["href"]

        profiles.append({
            "name": name,
            "role": "Hackathon Developer",
            "industry": "Hackathons",
            "skills": "Project Development",
            "recent_activity_score": 70,
            "profile_url": profile_url
        })

    return profiles
