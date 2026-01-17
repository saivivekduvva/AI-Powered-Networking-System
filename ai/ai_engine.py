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
        #                 WHY NOW BADGE (FINAL FIX)
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
        #              EXPLAINABILITY AI (FINAL)
        # ==========================================================

        # ---- Normalize skills safely ----
        raw_skills = p.get("skills", "")
        if isinstance(raw_skills, str):
            skills = [s.strip() for s in raw_skills.split(",") if s.strip()]
        else:
            skills = raw_skills or []

        matched_skills = [
            s for s in skills
            if s.lower() in user_intent_lower
        ]

        reasons = []

        # 1️⃣ Skill-based reasoning
        if matched_skills:
            reasons.append(
                f"shared expertise in {', '.join(matched_skills)}"
            )

        # 2️⃣ Role-based reasoning
        role = p.get("role", "professional")
        reasons.append(f"their role as a {role}")

        # 3️⃣ Timing-based reasoning
        if timing_score >= 85:
            reasons.append("very high recent professional activity")
        elif timing_score >= 70:
            reasons.append("high recent professional activity")
        elif timing_score >= 50:
            reasons.append("moderate recent professional activity")
        else:
            reasons.append("relevant background with lower recent activity")

        # 4️⃣ Source-based reasoning (optional)
        source = p.get("profile_source")
        if source:
            reasons.append(f"public data from {source}")

        # 5️⃣ Relative ranking context
        if opportunity_score >= 75:
            reasons.append("a strong overall match at this time")
        elif opportunity_score >= 55:
            reasons.append("good alignment with your current intent")
        else:
            reasons.append("a potential match worth exploring")

        # ---- Final explanation ----
        why_reason = (
            "This profile is recommended because of "
            + ", ".join(reasons)
            + "."
        )

        # -------- Personalized conversation starter --------
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
            "why_now": why_now,   # ✅ Now visibly different
            "starter": starter,
            "profile_url": p.get("profile_url", "")
        })

    # -------- Return ranked recommendations --------
    return sorted(results, key=lambda x: x["opportunity_score"], reverse=True)
