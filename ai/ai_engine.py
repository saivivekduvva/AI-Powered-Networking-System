from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")


def recommend(user_intent, profiles):
    intent_embedding = model.encode(user_intent, convert_to_tensor=True)
    results = []

    user_intent_lower = user_intent.lower()

    for p in profiles:
        # -------- Build profile text for semantic matching --------
        profile_text = f"{p.get('role', '')} {p.get('skills', '')} {p.get('industry', '')}"
        profile_embedding = model.encode(profile_text, convert_to_tensor=True)

        # -------- Semantic relevance --------
        relevance = util.cos_sim(intent_embedding, profile_embedding).item()
        relevance_score = round(relevance * 100, 2)

        # -------- Timing score --------
        timing_score = p.get("recent_activity_score", 0)

        # -------- Opportunity / Readiness score --------
        opportunity_score = round(
            (0.7 * relevance_score) + (0.3 * timing_score), 2
        )

        # ==========================================================
        #                 WHY NOW BADGE
        # ==========================================================
        if timing_score >= 85 and opportunity_score >= 55:
            why_now = "🚀 Actively relevant right now"
        elif timing_score >= 70:
            why_now = "🔥 Recently active — good time to connect"
        elif timing_score >= 50:
            why_now = "⏱️ Moderately active — timing is reasonable"
        else:
            why_now = "📌 Relevant background — explore when ready"

        # ==========================================================
        #              NORMALIZE SKILLS
        # ==========================================================
        raw_skills = p.get("skills", "")
        if isinstance(raw_skills, str):
            skills = [s.strip() for s in raw_skills.split(",") if s.strip()]
        else:
            skills = raw_skills or []

        matched_skills = [
            s for s in skills
            if s.lower() in user_intent_lower
        ]

        role = p.get("role", "professional")
        source = p.get("profile_source")

        # ==========================================================
        #              CONTEXTUAL TRIGGERS (NEW)
        # ==========================================================
        contextual_triggers = []

        # 1️⃣ Overlapping interests
        if matched_skills:
            contextual_triggers.append(
                f"Overlapping interests in {matched_skills[0]}"
            )

        # 2️⃣ Recent work
        if timing_score >= 70:
            contextual_triggers.append("Recent professional activity")

        # 3️⃣ Aligned goals
        if role.lower() in user_intent_lower:
            contextual_triggers.append("Aligned professional goals")

        # 4️⃣ Shared professional context
        if source:
            contextual_triggers.append(f"Active on {source}")

        # Keep only top 2 triggers
        contextual_triggers = contextual_triggers[:2]

        # ==========================================================
        #              EXPLAINABILITY TEXT
        # ==========================================================
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
            reasons.append("relevant background with lower recent activity")

        if source:
            reasons.append(f"public data from {source}")

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

        # -------- Collect result --------
        results.append({
            "name": p.get("name"),
            "role": role,
            "opportunity_score": opportunity_score,
            "why": why_reason,
            "why_now": why_now,
            "contextual_triggers": contextual_triggers,  # 👈 NEW
            "starter": starter,
            "profile_url": p.get("profile_url", "")
        })

    return sorted(results, key=lambda x: x["opportunity_score"], reverse=True)
