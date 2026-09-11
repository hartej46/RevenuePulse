import fs from "node:fs/promises";
import path from "node:path";

const DATA_FILE = path.join(import.meta.dirname, "../db/data.json");

export async function loadData() {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch (error) {
        throw error;
    }
}

export async function saveData(data) {
    const tempFile = `${DATA_FILE}.tmp`;
    const serialized = JSON.stringify(data, null, 2);
    
    await fs.writeFile(tempFile, serialized, "utf-8");
    await fs.rename(tempFile, DATA_FILE);
}
