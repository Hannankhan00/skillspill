from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load once at module level — not per request
model = SentenceTransformer('all-MiniLM-L6-v2')
print('[Matching Service] Model loaded. Ready on port 5001')


def build_bounty_text(bounty: dict) -> str:
    parts = []
    if bounty.get('title'):        parts.append(bounty['title'])
    if bounty.get('description'):  parts.append(bounty['description'])
    if bounty.get('requirements'): parts.append(bounty['requirements'])
    if bounty.get('skills'):       parts.append(' '.join(bounty['skills']))
    return ' '.join(parts)


def build_talent_text(talent: dict) -> str:
    parts = []
    if talent.get('bio'):    parts.append(talent['bio'])
    if talent.get('skills'): parts.append(' '.join(talent['skills']))
    if talent.get('experience'):
        for exp in talent['experience']:
            if exp.get('role'):        parts.append(exp['role'])
            if exp.get('description'): parts.append(exp['description'])
    return ' '.join(parts)


def compute_skill_overlap(bounty_skills: list, talent_skills: list) -> float:
    if not bounty_skills:
        return 50.0  # neutral if no skills required

    bounty_normalized = [s.lower().strip() for s in bounty_skills]
    talent_normalized = [s.lower().strip() for s in talent_skills]

    matches = sum(1 for s in bounty_normalized if s in talent_normalized)
    overlap = matches / len(bounty_normalized)
    return round(overlap * 100, 2)


def compute_bonus_score(talent: dict, bounty: dict) -> float:
    score = 40.0  # start neutral

    # GitHub score bonus (max +25)
    github_score = talent.get('githubScore', 0) or 0
    score += (github_score / 100) * 25

    # Availability bonus (+15)
    if talent.get('isAvailable'):
        score += 15

    # Experience level match (+20)
    bounty_text = (
        bounty.get('description', '') + ' ' +
        bounty.get('requirements', '')
    ).lower()
    exp_level = (talent.get('experienceLevel') or '').lower()

    level_keywords = {
        'junior': ['junior', 'entry', 'graduate', 'intern', 'beginner'],
        'mid':    ['mid', 'intermediate', '2 year', '3 year', 'experienced'],
        'senior': ['senior', 'lead', 'principal', 'expert', '5 year', '7 year'],
        'staff':  ['staff', 'architect', 'director', 'head of', 'principal'],
    }

    if exp_level in level_keywords:
        keywords = level_keywords[exp_level]
        if any(kw in bounty_text for kw in keywords):
            score += 20

    return round(min(score, 100), 2)


def match_talent_to_bounty(bounty: dict, talents: list) -> list:
    bounty_text = build_bounty_text(bounty)
    bounty_embedding = model.encode([bounty_text])

    results = []

    for talent in talents:
        talent_text = build_talent_text(talent)

        # Skip talents with no meaningful text
        if len(talent_text.strip()) < 10:
            continue

        talent_embedding = model.encode([talent_text])

        # Cosine similarity → 0 to 1 → convert to 0-100
        similarity = cosine_similarity(bounty_embedding, talent_embedding)[0][0]
        semantic_score = round(float(similarity) * 100, 2)

        skill_overlap = compute_skill_overlap(
            bounty.get('skills', []),
            talent.get('skills', [])
        )

        bonus_score = compute_bonus_score(talent, bounty)

        # Final weighted composite score
        match_score = round(
            (skill_overlap  * 0.35) +
            (semantic_score * 0.50) +
            (bonus_score    * 0.15),
            2
        )

        results.append({
            'talentProfileId':  talent['id'],
            'matchScore':        match_score,
            'skillOverlapScore': skill_overlap,
            'semanticScore':     semantic_score,
            'bonusScore':        bonus_score,
        })

    # Sort by matchScore descending
    results.sort(key=lambda x: x['matchScore'], reverse=True)
    return results
