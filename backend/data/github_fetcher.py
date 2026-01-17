import requests

def fetch_github_profiles(query, limit=5):
    search_url = f"https://api.github.com/search/users?q={query}&per_page={limit}"
    users = requests.get(search_url).json().get("items", [])

    profiles = []

    for u in users:
        user = requests.get(u["url"]).json()
        repos = requests.get(user["repos_url"]).json()

        languages = set()
        for r in repos[:5]:
            if r.get("language"):
                languages.add(r["language"])

        profiles.append({
            "name": user.get("name") or user["login"],
            "role": user.get("bio") or "Software Professional",
            "industry": "Technology",
            "skills": ", ".join(languages) or "Programming",
            "recent_activity_score": min(100, user.get("public_repos", 0) * 5),
            "profile_url": user["html_url"]
        })


    return profiles
