from sentence_transformers import SentenceTransformer, util
from typing import List, Dict
import re

# ---------------- Load Model Once ----------------
model = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------- Helpers ----------------
def normalize_score(score, max_score=100):
    return round(min(score, max_score), 2)


def source_trust_boost(source: str) -> float:
    boosts = {
        "github": 1.0,
        "devpost": 0.9,
        "research": 1.15,
        "orcid": 1.2,
        "mock": 0.7
    }
    return boosts.get(source.lower(), 1.0)


def clean_text(text: str) -> str:
    return re.sub(r"[^a-zA-Z0-9 ]", " ", text.lower())


# ---------------- Core AI ----------------
def recommend(user_intent: str, profiles: List[Dict]) -> List[Dict]:

    intent_embedding = model.encode(user_intent, convert_to_tensor=True)
    intent_clean = clean_text(user_intent)

    # -------- Batch profile text creation --------
    profile_texts = [
        f"{p.get('role', '')} {p.get('skills', '')} {p.get('industry', '')}"
        for p in profiles
    ]

    profile_embeddings = model.encode(
        profile_texts,
        convert_to_tensor=True
    )

    results = []

    for idx, p in enumerate(profiles):

        # -------- Semantic relevance --------
        relevance = util.cos_sim(
            intent_embedding,
            profile_embeddings[idx]
        ).item()

        relevance_score = round(relevance * 100, 2)

        # -------- Timing score --------
        timing_score = p.get("recent_activity_score", 50)

        # -------- Source trust --------
        source = p.get("source", "github")
        trust = source_trust_boost(source)

        # -------- Opportunity score --------
        raw_score = (
            (0.7 * relevance_score) +
            (0.3 * timing_score)
        ) * trust

        opportunity_score = normalize_score(raw_score)

        # ==================================================
        #                 WHY NOW
        # ==================================================
        if timing_score >= 85 and opportunity_score >= 60:
            why_now = "🚀 Actively relevant right now"
        elif timing_score >= 70:
            why_now = "🔥 Recently active — good time to connect"
        elif timing_score >= 50:
            why_now = "⏱️ Moderately active — timing is reasonable"
        else:
            why_now = "📌 Relevant background — explore when ready"

        # ==================================================
        #              SKILL MATCHING (IMPROVED)
        # ==================================================
        raw_skills = p.get("skills", "")
        skills = [s.strip() for s in raw_skills.split(",") if s.strip()]

        matched_skills = [
            s for s in skills
            if clean_text(s) in intent_clean
        ]

        role = p.get("role", "professional")

        # ==================================================
        #              CONTEXTUAL TRIGGERS
        # ==================================================
        contextual_triggers = []

        if matched_skills:
            contextual_triggers.append(
                f"Overlapping interests in {matched_skills[0]}"
            )

        if timing_score >= 70:
            contextual_triggers.append("Recent professional activity")

        if role.lower() in intent_clean:
            contextual_triggers.append("Aligned professional goals")

        if source:
            contextual_triggers.append(f"Active on {source}")

        contextual_triggers = contextual_triggers[:2]

        # ==================================================
        #              EXPLAINABILITY
        # ==================================================
        reasons = []

        if matched_skills:
            reasons.append(
                f"shared expertise in {', '.join(matched_skills)}"
            )

        reasons.append(f"their role as a {role}")

        if timing_score >= 85:
            reasons.append("very high recent professional activity")
        elif timing_score >= 70:
            reasons.append("high recent professional activity")
        elif timing_score >= 50:
            reasons.append("moderate recent professional activity")
        else:
            reasons.append("relevant background")

        if source:
            reasons.append(f"credible data from {source}")

        if opportunity_score >= 75:
            reasons.append("a strong overall match at this time")
        elif opportunity_score >= 55:
            reasons.append("good alignment with your current intent")
        else:
            reasons.append("a potential match worth exploring")

        why_reason = (
            "This profile is recommended because of "
            + ", ".join(reasons)
            + "."
        )

        # -------- Conversation starter --------
        starter = (
            f"Hi {p.get('name')}, I came across your work as a {role} "
            f"and thought it would be great to connect."
        )

        # -------- Result --------
        results.append({
            "name": p.get("name"),
            "role": role,
            "opportunity_score": opportunity_score,
            "why": why_reason,
            "why_now": why_now,
            "contextual_triggers": contextual_triggers,
            "starter": starter,
            "profile_url": p.get("profile_url", ""),
            "source": source
        })

    return sorted(results, key=lambda x: x["opportunity_score"], reverse=True)
