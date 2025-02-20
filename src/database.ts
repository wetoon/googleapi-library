import { type GoogleAuthCredential } from "./index"; // service account object
import { getAccessToken } from "./utils"; // function to get Google API token

export class GoogleDatabase {
    
    private databaseURL: string;
    private credential: GoogleAuthCredential;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0; // Expiry timestamp (ms)

    constructor(credential: GoogleAuthCredential, databaseURL: string) {
        this.credential = credential;
        this.databaseURL = databaseURL;
    }

    private async getToken(): Promise<string> {
        const currentTime = Date.now();
        if (this.accessToken && currentTime < this.tokenExpiry) {
            return this.accessToken;
        }
        this.accessToken = await getAccessToken(
            this.credential.client_email,
            this.credential.private_key,
            "https://www.googleapis.com/auth/firebase.database"
        ) as string;
        this.tokenExpiry = currentTime + 3600 * 1000; // Token valid for 1 hour
        return this.accessToken;
    }

    async findAll<T = any>(path: string): Promise<T | null> {
        const token = await this.getToken();
        const response = await fetch(`${this.databaseURL}/${path}.json`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok ? await response.json() : null;
    }

    async create<T = any>(path: string, data: T): Promise<T | null> {
        const token = await this.getToken();
        const response = await fetch(`${this.databaseURL}/${path}.json`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.ok ? data : null;
    }

    async remove(path: string): Promise<boolean> {
        const token = await this.getToken();
        const response = await fetch(`${this.databaseURL}/${path}.json`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok;
    }

    async query<T = any>(path: string, queryParams: Record< "orderBy" | "equalTo", string>): Promise<T | null> {
        const token = await this.getToken();
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await fetch(`${this.databaseURL}/${path}.json?${queryString}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok ? await response.json() : null;
    }

    async transaction<T = any>(path: string, updateFn: (currentData: T) => T): Promise<T | null> {
        try {
            const token = await this.getToken();
            const url = `${this.databaseURL}/${path}.json`;
            
            // Get current data
            const response = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
            const currentData = await response.json();
            
            // Compute new value
            const newData = updateFn(currentData);
            
            // Save updated value
            const updateResponse = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });
            
            if (!updateResponse.ok) throw new Error(`Error updating data: ${updateResponse.statusText}`);
            return await updateResponse.json();
        } catch (error) {
            console.error("Transaction failed:", error);
            return null;
        }
    }
}