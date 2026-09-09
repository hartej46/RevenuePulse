import { SCREENS } from "../utils/Constants";
import { Box, Text, useInput } from "ink";

function Layout({ children, currentScreen, onBack }) {
    useInput((input, key) => {
        if (key.escape && currentScreen !== SCREENS.MENU) {
            onBack();
        }
    });

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
            <Box marginBottom={1} justifyContent="space-between">
                <Text bold color="cyanBright">
                    ◈ SMART COMPETENCY DIAGNOSTIC CLI
                </Text>
                <Text dimColor>PSDM Portal</Text>
            </Box>

            <Box flexDirection="column" marginY={1}>
                {children}
            </Box>

            <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
                <Text dimColor>
                    {currentScreen === SCREENS.MENU
                        ? "Use [↑/↓] to navigate, [Enter] to select"
                        : "Press [ESC] to return to Main Menu"}
                </Text>
            </Box>
        </Box>
    );
}

export default Layout;