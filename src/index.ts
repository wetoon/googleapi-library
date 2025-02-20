
import { GoogleDrive } from "./drive";
import { GoogleDatabase } from "./database";

export type GoogleAuthCredential = { client_email: string, private_key: string } | { [ key:string ]: string };

export class GoogleAuth {

    private credential: GoogleAuthCredential = {};

    public constructor( credential:GoogleAuthCredential ) {
        this.credential = credential;
    }

    public drive( folderID: string ) {
        return new GoogleDrive( this.credential, folderID )
    }

    public database( databaseURL: string ) {
        return new GoogleDatabase( this.credential, databaseURL )
    }

}
