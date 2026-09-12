import React from "react";
import { Box, Text } from "ink";
import { getMarketSkillInsights, calculateSkillGaps } from "../engine.js";

function getDemandColor(level) {
    switch (level?.toLowerCase()) {
        case "very high":
            return "magentaBright";
        case "high":
            return "greenBright";
        case "moderate":
            return "yellowBright";
        default:
            return "white";
    }
}

export default function MarketDashboardScreen({ appData }) {
    const roles = appData.roles || [];
    const candidateScores = appData.assessmentResults?.[0]?.scores || null;
    const topSkills = getMarketSkillInsights(roles);

    return (
        <Box flexDirection="column" paddingX={1}>
            <Box marginBottom={1} borderStyle="single" borderColor="blue" paddingX={1}>
                <Text bold color="blueBright">
                    REAL-TIME JOB MARKET INSIGHTS & BENCHMARKS
                </Text>
            </Box>

            <Box flexDirection="column" marginBottom={1}>
                <Text bold underline color="cyan">
                    High-Demand Skill Index Across Target Roles:
                </Text>
                <Box marginTop={0.5} flexDirection="row" flexWrap="wrap">
                    {topSkills.map((item) => (
                        <Box key={item.skill} marginRight={2}>
                            <Text bold color="yellow">
                                • {item.skill.toUpperCase()}
                            </Text>
                            <Text dimColor>
                                {" "}
                                (Roles: {item.occurrences} | Avg Bar: {item.avgRequired}%)
                            </Text>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box flexDirection="column">
                <Text bold underline color="white">
                    Active Industry Openings & Candidate Fit:
                </Text>

                <Box marginTop={0.5} flexDirection="column">
                    {roles.map((role) => {
                        const fit = candidateScores
                            ? calculateSkillGaps(candidateScores, role, []).overallMatch
                            : null;

                        return (
                            <Box
                                key={role.roleId}
                                flexDirection="column"
                                borderStyle="round"
                                borderColor="gray"
                                paddingX={1}
                                marginY={0.5}
                            >
                                <Box justifyContent="space-between">
                                    <Text bold color="white">
                                        {role.title} <Text dimColor>({role.department})</Text>
                                    </Text>
                                    <Text bold color={getDemandColor(role.demandLevel)}>
                                        Demand: {role.demandLevel}
                                    </Text>
                                </Box>

                                <Box justifyContent="space-between" marginTop={0.5}>
                                    <Text color="gray">Est. Benchmark: {role.avgSalary}</Text>
                                    {fit !== null ? (
                                        <Text bold color={fit >= 70 ? "green" : fit >= 45 ? "yellow" : "red"}>
                                            Candidate Match: {fit}%
                                        </Text>
                                    ) : (
                                        <Text dimColor>Take test to view qualification match</Text>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            <Box marginTop={1}>
                <Text dimColor>Press [ESC] to return to the Main Menu.</Text>
            </Box>
        </Box>
    );
}
