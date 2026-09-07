import fs from "node:fs/promises";
import path from "node:path";

const DATA_FILE = path.resolve("./data.json");

const SEED_DATA = {
    subdivisions: [
        { id: "shahdara", name: "Shahdara Sub-Div", staffCount: 3, dailyCapacityPerOfficer: 25, pendingCaste: 580, pendingIncome: 240, pendingDomicile: 110 },
        { id: "north", name: "North Delhi Sub-Div", staffCount: 4, dailyCapacityPerOfficer: 25, pendingCaste: 390, pendingIncome: 180, pendingDomicile: 95 },
        { id: "central", name: "Central Delhi Sub-Div", staffCount: 7, dailyCapacityPerOfficer: 25, pendingCaste: 120, pendingIncome: 80, pendingDomicile: 45 },
        { id: "south", name: "South Delhi Sub-Div", staffCount: 9, dailyCapacityPerOfficer: 25, pendingCaste: 85, pendingIncome: 50, pendingDomicile: 30 }
    ],
    auditLogs: []
};

export async function loadData() {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        await saveData(SEED_DATA);
        return SEED_DATA;
    }
}

export async function saveData(data) {
  // Pretty-print JSON for easy debugging & inspection
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}
