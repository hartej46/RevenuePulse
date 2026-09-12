import React from "react";
import { Box, Text } from "ink";
import { calculateSkillGaps } from "../engine.js";

function ProgressBar({ score, required }) {
    const totalSlots = 10;
    const filledSlots = Math.min(totalSlots, Math.round((score / 100) * totalSlots));
    const emptySlots = Math.max(0, totalSlots - filledSlots);
    const bar = "█".repeat(filledSlots) + "░".repeat(emptySlots);

    return (
        <Text>
            [{bar}] <Text bold>{score}%</Text> (Target: {required}%)
        </Text>
    );
}

export default function GapReportScreen({ appData }) {
    const latestAssessment = appData.assessmentResults?.[0];
    const targetRoleId = appData.candidate?.targetRoleId;
    const targetRole = appData.roles?.find((r) => r.roleId === targetRoleId);
    const courses = appData.courses || [];

    if (!latestAssessment || !latestAssessment.scores) {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
                <Text bold color="yellow">
                    ⚠ No Assessment Record Found
                </Text>
                <Text>Please complete the Competency Diagnostic test first to view your gap report.</Text>
                <Box marginTop={1}>
                    <Text dimColor>Press [ESC] to return to the Main Menu.</Text>
                </Box>
            </Box>
        );
    }

    if (!targetRole) {
        return (
            <Box flexDirection="column" padding={1}>
                <Text color="red">Assigned target role could not be located in database.</Text>
                <Text dimColor>Press [ESC] to return to the Main Menu.</Text>
            </Box>
        );
    }

    const { overallMatch, skillBreakdown, recommendedCourses } = calculateSkillGaps(
        latestAssessment.scores,
        targetRole,
        courses
    );

    return (
        <Box flexDirection="column" paddingX={1}>
            <Box
                flexDirection="column"
                borderStyle="single"
                borderColor="cyan"
                paddingX={1}
                marginBottom={1}
            >
                <Box justifyContent="space-between">
                    <Text bold color="cyanBright">
                        TARGET ROLE: {targetRole.title.toUpperCase()}
                    </Text>
                    <Text dimColor>Candidate: {appData.candidate?.name}</Text>
                </Box>
                <Box marginTop={1}>
                    <Text>Role Competency Alignment: </Text>
                    <Text bold color={overallMatch >= 75 ? "green" : overallMatch >= 50 ? "yellow" : "red"}>
                        {overallMatch}% Match
                    </Text>
                </Box>
            </Box>

            <Box flexDirection="column" marginBottom={1}>
                <Text bold underline color="white">
                    SKILL DEFICIT ANALYSIS
                </Text>

                <Box marginTop={1} flexDirection="column">
                    {skillBreakdown.map((item) => (
                        <Box key={item.skill} flexDirection="column" marginY={0.5}>
                            <Box justifyContent="space-between" width={55}>
                                <Text bold color="yellow">
                                    {item.skill.toUpperCase()}
                                </Text>
                                {item.delta > 0 ? (
                                    <Text color="red" bold>
                                        Deficit: -{item.delta}%
                                    </Text>
                                ) : (
                                    <Text color="green" bold>
                                        ✔ Requirement Met
                                    </Text>
                                )}
                            </Box>
                            <ProgressBar score={item.candidateScore} required={item.requiredScore} />
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box flexDirection="column" borderStyle="round" borderColor="magenta" paddingX={1}>
                <Text bold color="magentaBright">
                    RECOMMENDED BRIDGE COURSES
                </Text>

                {recommendedCourses.length === 0 ? (
                    <Box marginY={0.5}>
                        <Text color="green">Great job! No skill gaps detected for this role.</Text>
                    </Box>
                ) : (
                    recommendedCourses.map((course, idx) => (
                        <Box key={course.courseId} flexDirection="column" marginY={0.5}>
                            <Text bold color="white">
                                {idx + 1}. {course.title}
                            </Text>
                            <Text dimColor>
                                Skill: [{course.targetSkill}] • Type: {course.type} • Duration: {course.duration} (By {course.provider})
                            </Text>
                        </Box>
                    ))
                )}
            </Box>

            <Box marginTop={1}>
                <Text dimColor>Press [ESC] to return to the Main Menu.</Text>
            </Box>
        </Box>
    );
}
