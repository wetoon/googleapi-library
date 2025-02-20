import { type GoogleAuthCredential } from "./index";
export declare class GoogleDrive {
    private parentFolder;
    private credential;
    private storage;
    constructor(credential: GoogleAuthCredential, parent: string);
    private getToken;
    create(file: File): Promise<string>;
    remove(fileId: string): Promise<boolean>;
    filter(): Promise<{
        id: string;
        name: string;
    }[] | undefined>;
}
