/**
 * DataLoader Service
 * Handles fetching JSON data from the /data directory or LocalStorage (if modified by Admin).
 */
export const DataLoader = {
    async load(filename) {
        try {
            // 1. Check for overrides in LocalStorage (Simulating Database)
            const localData = localStorage.getItem(`db_${filename}`);
            if (localData) {
                console.log(`[DataLoader] Loaded ${filename} from storage cache.`);
                return JSON.parse(localData);
            }

            // 2. Fetch default file
            const response = await fetch(`data/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to load ${filename}:`, error);
            throw error;
        }
    }
};
