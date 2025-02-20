import { type GoogleAuthCredential } from "./index";
export declare class GoogleDatabase {
    private databaseURL;
    private credential;
    private accessToken;
    private tokenExpiry;
    constructor(credential: GoogleAuthCredential, databaseURL: string);
    private getToken;
    findAll<T = any>(path: string): Promise<T | null>;
    create<T = any>(path: string, data: T): Promise<T | null>;
    remove(path: string): Promise<boolean>;
    query<T = any>(path: string, queryParams: Record<"orderBy" | "equalTo", string>): Promise<T | null>;
    transaction<T = any>(path: string, updateFn: (currentData: T) => T): Promise<T | null>;
}
