export function calculateAssessmentOutcome(questions, answers) {
    const domainTotals = {};
    const domainEarned = {};

    for (const q of questions) {
        const domain = q.domain;
        domainTotals[domain] = (domainTotals[domain] || 0) + q.skillWeight;

        const candidateAnswer = answers.find((a) => a.questionId === q.id);
        const isCorrect = candidateAnswer && candidateAnswer.selectedIndex === q.correctIndex;

        if (!domainEarned[domain]) {
            domainEarned[domain] = 0;
        }

        if (isCorrect) {
            domainEarned[domain] += q.skillWeight;
        }
    }

    const scores = {};
    for (const domain of Object.keys(domainTotals)) {
        const totalWeight = domainTotals[domain];
        const earnedWeight = domainEarned[domain] || 0;
        scores[domain] = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    }

    const newBadges = [];
    const now = new Date().toISOString();

    if (scores.node >= 75) {
        newBadges.push({
            badgeId: "badge_node_adv",
            title: "Node.js Core Practitioner",
            domain: "node",
            score: scores.node,
            earnedAt: now,
        });
    }
    if (scores.database >= 75) {
        newBadges.push({
            badgeId: "badge_db_spec",
            title: "Database Architecture Specialist",
            domain: "database",
            score: scores.database,
            earnedAt: now,
        });
    }
    if (scores.docker >= 75) {
        newBadges.push({
            badgeId: "badge_devops_assoc",
            title: "Container Infrastructure Associate",
            domain: "docker",
            score: scores.docker,
            earnedAt: now,
        });
    }
    if (scores.api_design >= 75) {
        newBadges.push({
            badgeId: "badge_api_prof",
            title: "REST & API Design Professional",
            domain: "api_design",
            score: scores.api_design,
            earnedAt: now,
        });
    }

    return { scores, newBadges };
}

export function calculateSkillGaps(candidateScores, targetRole, courses) {
    if (!targetRole || !candidateScores) {
        return { overallMatch: 0, skillBreakdown: [], recommendedCourses: [] };
    }

    const requiredSkills = targetRole.requiredSkills || {};
    const skillBreakdown = [];
    const recommendedCourses = [];

    let totalRequiredPoints = 0;
    let totalMetPoints = 0;

    for (const [skill, reqScore] of Object.entries(requiredSkills)) {
        const candidateScore = candidateScores[skill] ?? 0;
        const delta = Math.max(0, reqScore - candidateScore);

        totalRequiredPoints += reqScore;
        totalMetPoints += Math.min(candidateScore, reqScore);

        let matchedCourse = null;
        if (delta > 0) {
            matchedCourse = courses.find((c) => c.targetSkill === skill) || null;
            if (matchedCourse) {
                recommendedCourses.push(matchedCourse);
            }
        }

        skillBreakdown.push({
            skill,
            candidateScore,
            requiredScore: reqScore,
            delta,
            status: delta === 0 ? "MET" : "GAP",
            course: matchedCourse,
        });
    }

    const overallMatch =
        totalRequiredPoints > 0
            ? Math.round((totalMetPoints / totalRequiredPoints) * 100)
            : 0;

    return {
        overallMatch,
        skillBreakdown,
        recommendedCourses,
    };
}

export function getMarketSkillInsights(roles = []) {
    const aggregate = {};

    for (const role of roles) {
        for (const [skill, weight] of Object.entries(role.requiredSkills || {})) {
            if (!aggregate[skill]) {
                aggregate[skill] = { occurrences: 0, totalWeight: 0 };
            }
            aggregate[skill].occurrences += 1;
            aggregate[skill].totalWeight += weight;
        }
    }

    return Object.entries(aggregate)
        .map(([skill, data]) => ({
            skill,
            occurrences: data.occurrences,
            avgRequired: Math.round(data.totalWeight / data.occurrences),
        }))
        .sort((a, b) => b.occurrences - a.occurrences || b.avgRequired - a.avgRequired);
}
