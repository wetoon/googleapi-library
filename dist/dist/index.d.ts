import { GoogleDrive } from "./drive";
import { GoogleDatabase } from "./database";
export type GoogleAuthCredential = {
    client_email: string;
    private_key: string;
} | {
    [key: string]: string;
};
export declare class GoogleAuth {
    private credential;
    constructor(credential: GoogleAuthCredential);
    drive(folderID: string): GoogleDrive;
    database(databaseURL: string): GoogleDatabase;
}
