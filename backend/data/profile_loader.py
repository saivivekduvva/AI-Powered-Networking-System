import sys
import os

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
sys.path.insert(0, PROJECT_ROOT)

from backend.data.github_fetcher import fetch_github_profiles
from backend.data.devpost_fetcher import fetch_devpost_profiles
from backend.data.scholar_fetcher import fetch_scholar_profiles
from backend.data.fallback import load_mock_profiles


def load_profiles(intent, limit=5):
    """
    Loads profiles from multiple sources.
    Returns: (profiles, sources)
    """

    profiles = []
    sources = []

    # 1️⃣ GitHub (Primary)
    try:
        github_profiles = fetch_github_profiles(intent, limit)
        if github_profiles:
            profiles.extend(github_profiles)
            sources.append("github")
    except Exception:
        pass

    # 2️⃣ Devpost (Best-effort)
    try:
        devpost_profiles = fetch_devpost_profiles(intent, limit)
        if devpost_profiles:
            profiles.extend(devpost_profiles)
            sources.append("devpost")
    except Exception:
        pass

    # 3️⃣ Research (OpenAlex / Scholar-style)
    try:
        scholar_profiles = fetch_scholar_profiles(intent, limit)
        if scholar_profiles:
            profiles.extend(scholar_profiles)
            sources.append("research")
    except Exception:
        pass

    # 4️⃣ Fallback
    if not profiles:
        return load_mock_profiles(), ["mock"]

    return profiles, sources
