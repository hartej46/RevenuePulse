import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import fs from "node:fs/promises";
import path from "node:path";
import { generateResumeMarkdown } from "../engine.js";

export default function ResumeExportScreen({ appData }) {
    const [status, setStatus] = useState("IDLE");
    const [outputPath, setOutputPath] = useState("");

    const candidate = appData.candidate;
    const latestAssessment = appData.assessmentResults?.[0];
    const targetRole = appData.roles?.find((r) => r.roleId === candidate?.targetRoleId);

    const resumeContent = generateResumeMarkdown(candidate, latestAssessment, targetRole);

    useInput(async (input, key) => {
        if (key.return && status !== "SAVING") {
            setStatus("SAVING");
            try {
                const destination = path.join(process.cwd(), "resume.md");
                await fs.writeFile(destination, resumeContent, "utf-8");
                setOutputPath(destination);
                setStatus("SUCCESS");
            } catch (err) {
                setStatus("ERROR");
            }
        }
    });

    return (
        <Box flexDirection="column" paddingX={1}>
            <Box borderStyle="single" borderColor="cyan" paddingX={1} marginBottom={1}>
                <Text bold color="cyanBright">
                    AUTOMATED RESUME WIZARD & EXPORTER
                </Text>
            </Box>

            <Box flexDirection="column" marginBottom={1}>
                <Text bold color="white">
                    Candidate: <Text color="yellow">{candidate?.name || "Unknown"}</Text>
                </Text>
                <Text bold color="white">
                    Target Role: <Text color="green">{targetRole?.title || "Unassigned"}</Text>
                </Text>
                <Text bold color="white">
                    Badges Earned: <Text color="magenta">{candidate?.badges?.length || 0}</Text>
                </Text>
            </Box>

            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="gray"
                padding={1}
                marginBottom={1}
            >
                <Text bold underline color="yellow">
                    Document Preview (resume.md):
                </Text>
                <Box marginY={0.5}>
                    <Text dimColor>{resumeContent}</Text>
                </Box>
            </Box>

            {status === "IDLE" && (
                <Text bold color="greenBright">
                    Press [Enter] to generate and export resume.md to project root.
                </Text>
            )}
            {status === "SAVING" && <Text color="yellow">Writing file to disk...</Text>}
            {status === "SUCCESS" && (
                <Box flexDirection="column">
                    <Text bold color="greenBright">
                        ✔ Resume exported successfully!
                    </Text>
                    <Text dimColor>Location: {outputPath}</Text>
                </Box>
            )}
            {status === "ERROR" && (
                <Text bold color="red">
                    ✖ Failed to write resume file to disk. Check directory permissions.
                </Text>
            )}

            <Box marginTop={1}>
                <Text dimColor>Press [ESC] to return to the Main Menu.</Text>
            </Box>
        </Box>
    );
}
