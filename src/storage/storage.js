import { error } from "node:console";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_FILE = path.join(import.meta.dirname, "./storage/data.json");

export async function loadData() {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch (error) {
        throw error;
    }
}

