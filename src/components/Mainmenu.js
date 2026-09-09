import { SCREENS } from "../utils/Constants";
import SelectInput from "ink-select-input";
import { Box, Text } from "ink";

function MainMenu({ onSelect }) {
    const menuItems = [
        { label: "1. Run Competency Diagnostic (Test)", value: SCREENS.ASSESSMENT },
        { label: "2. View Skill Gap Report & Recommendations", value: SCREENS.GAP_REPORT },
        { label: "3. Explore Job Market Trends & Insights", value: SCREENS.MARKET_DASHBOARD },
        { label: "4. Build & Export Verified Resume", value: SCREENS.RESUME_EXPORT },
        { label: "5. Exit Application", value: "EXIT" },
    ];

    return (
        <Box flexDirection="column">
            <Text bold underline color="yellow">
                Main Dashboard
            </Text>
            <Box marginY={1}>
                <SelectInput items={menuItems} onSelect={onSelect} />
            </Box>
        </Box>
    );
}

export default MainMenu;