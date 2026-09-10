import React, { useState } from "react";
import { Box, Text, useApp} from "ink";
import { SCREENS } from "./utils/Constants.js";
import Layout from './components/Layout.jsx';
import MainMenu from "./components/Mainmenu.jsx";

function AssessmentScreen() {
    return <Text color="green">Diagnostic Engine running... (Placeholder)</Text>;
}

function GapReportScreen() {
    return <Text color="magenta">Gap Analysis & Course Roadmap... (Placeholder)</Text>;
}

function MarketDashboardScreen() {
    return <Text color="blue">Live Job Market Analytics... (Placeholder)</Text>;
}

function ResumeExportScreen() {
    return <Text color="white">Resume Wizard & Export Engine... (Placeholder)</Text>;
}

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(SCREENS.MENU);
    const { exit } = useApp();

    const handleMenuSelect = (item) => {
        if (item.value === "EXIT") {
            exit();
            return;
        }
        setCurrentScreen(item.value);
    };

    const navigateToMenu = () => setCurrentScreen(SCREENS.MENU);

    return (
        <Layout currentScreen={currentScreen} onBack={navigateToMenu}>
            {currentScreen === SCREENS.MENU && <MainMenu onSelect={handleMenuSelect} />}
            {currentScreen === SCREENS.ASSESSMENT && <AssessmentScreen />}
            {currentScreen === SCREENS.GAP_REPORT && <GapReportScreen />}
            {currentScreen === SCREENS.MARKET_DASHBOARD && <MarketDashboardScreen />}
            {currentScreen === SCREENS.RESUME_EXPORT && <ResumeExportScreen />}
        </Layout>
    );
}
