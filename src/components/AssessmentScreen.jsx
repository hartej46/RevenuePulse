import React, { useState } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { calculateAssessmentOutcome } from "../engine.js";
import { saveData } from "../storage/storage.js";


export default function AssessmentScreen({ appData, onComplete, onCancel }) {
    const questions = appData.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [summary, setSummary] = useState(null);

    if (questions.length === 0) {
        return (
            <Box flexDirection="column" padding={1}>
                <Text color="red">No assessment questions found in data.json.</Text>
                <Text dimColor>Press [ESC] to return to the Main Menu.</Text>
            </Box>
        );
    }

    const currentQ = questions[currentIndex];

    const choices = currentQ.options.map((opt, idx) => ({
        label: `${String.fromCharCode(65 + idx)}) ${opt}`,
        value: idx,
    }));

    const handleSelectAnswer = async (selected) => {
        const updatedAnswers = [
            ...answers,
            { questionId: currentQ.id, selectedIndex: selected.value },
        ];
        setAnswers(updatedAnswers);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            const { scores, newBadges } = calculateAssessmentOutcome(questions, updatedAnswers);

            const newAttempt = {
                attemptId: `att_${Date.now()}`,
                completedAt: new Date().toISOString(),
                scores,
                identifiedGaps: [],
            };

            const existingBadgeIds = new Set((appData.candidate?.badges || []).map((b) => b.badgeId));
            const freshBadges = newBadges.filter((b) => !existingBadgeIds.has(b.badgeId));
            const updatedBadgeList = [...(appData.candidate?.badges || []), ...freshBadges];

            const updatedData = {
                ...appData,
                candidate: {
                    ...appData.candidate,
                    badges: updatedBadgeList,
                },
                assessmentResults: [newAttempt, ...(appData.assessmentResults || [])],
            };

            await saveData(updatedData);

            setSummary({ scores, freshBadges });
            setIsFinished(true);
            if (onComplete) onComplete(updatedData);
        }
    };

    if (isFinished && summary) {
        return (
            <Box flexDirection="column" padding={1} borderStyle="double" borderColor="green">
                <Text bold color="greenBright">
                    ✔ COMPETENCY DIAGNOSTIC COMPLETED
                </Text>
                <Text dimColor>Scores verified and persistent in data.json</Text>

                <Box flexDirection="column" marginY={1}>
                    <Text bold underline>
                        Domain Performance Breakdown:
                    </Text>
                    {Object.entries(summary.scores).map(([domain, score]) => (
                        <Box key={domain} justifyContent="space-between" width={40}>
                            <Text color="cyan">{domain.toUpperCase()}:</Text>
                            <Text bold color={score >= 70 ? "green" : score >= 40 ? "yellow" : "red"}>
                                {score} / 100
                            </Text>
                        </Box>
                    ))}
                </Box>

                <Box flexDirection="column" marginY={1}>
                    <Text bold underline color="yellow">
                        Verified Badges Earned:
                    </Text>
                    {summary.freshBadges.length > 0 ? (
                        summary.freshBadges.map((badge) => (
                            <Text key={badge.badgeId} color="yellowBright">
                                ★ [VERIFIED] {badge.title} (Score: {badge.score}%)
                            </Text>
                        ))
                    ) : (
                        <Text dimColor>No new badges unlocked (75% domain threshold required).</Text>
                    )}
                </Box>

                <Text dimColor>Press [ESC] to return to the Main Menu.</Text>
            </Box>
        );
    }

    return (
        <Box flexDirection="column">
            <Box justifyContent="space-between" marginBottom={1}>
                <Text color="yellowBright" bold>
                    Question {currentIndex + 1} of {questions.length}
                </Text>
                <Text color="magenta">
                    Domain: [{currentQ.domain.toUpperCase()}] • Weight: {currentQ.skillWeight} pts
                </Text>
            </Box>

            <Box marginY={1} paddingX={1} borderStyle="round" borderColor="gray">
                <Text bold color="white">
                    {currentQ.prompt}
                </Text>
            </Box>

            <Box flexDirection="column" marginTop={1}>
                <SelectInput items={choices} onSelect={handleSelectAnswer} />
            </Box>
        </Box>
    );
}
