from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def recommend(user_intent, profiles):
    intent_embedding = model.encode(user_intent, convert_to_tensor=True)
    results = []

    user_intent_lower = user_intent.lower()

    for p in profiles:
        profile_text = f"{p['role']} {p['skills']} {p['industry']}"
        profile_embedding = model.encode(profile_text, convert_to_tensor=True)

        # Semantic relevance
        relevance = util.cos_sim(intent_embedding, profile_embedding).item()
        relevance_score = round(relevance * 100, 2)

        # Timing score
        timing_score = p["recent_activity_score"]

        # Final opportunity score
        opportunity_score = round(
            (0.7 * relevance_score) + (0.3 * timing_score), 2
        )

        # -------- Explainability AI --------
        matched_skills = [
            skill for skill in p["skills"]
            if skill.lower() in user_intent_lower
        ]

        if matched_skills:
            why_reason = (
                f"This profile matches your intent due to shared skills in "
                f"{', '.join(matched_skills)} and their role as a {p['role']}."
            )
        else:
            why_reason = (
                f"This profile aligns with your intent based on their role as a "
                f"{p['role']} in the {p['industry']} industry."
            )

        # Personalized conversation starter
        starter = (
            f"Hi {p['name']}, I came across your work as a {p['role']} in "
            f"{p['industry']} and thought it would be great to connect."
        )

        results.append({
            "name": p["name"],
            "role": p["role"],
            "opportunity_score": opportunity_score,
            "why": why_reason,
            "starter": starter,
            "profile_url": p.get("profile_url", "")
        })

    return sorted(results, key=lambda x: x["opportunity_score"], reverse=True)
