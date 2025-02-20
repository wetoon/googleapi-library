import { GoogleDrive } from "./drive";
import { GoogleDatabase } from "./database";
export class GoogleAuth {
    credential = {};
    constructor(credential) {
        this.credential = credential;
    }
    drive(folderID) {
        return new GoogleDrive(this.credential, folderID);
    }
    database(databaseURL) {
        return new GoogleDatabase(this.credential, databaseURL);
    }
}
