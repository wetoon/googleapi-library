
import { GoogleDrive } from "./drive";
import { GoogleDatabase } from "./database";
import { getAccessToken } from "./utils";

export type GoogleAuthCredential = { client_email: string, private_key: string } | { [ key:string ]: string };

export class GoogleAuth {

    private credential: GoogleAuthCredential = {};
    private storage: any;

    public constructor( initialize: { credential: GoogleAuthCredential, storage?: Map< string, string > | any } ) {
        this.credential = initialize.credential;
        this.storage = initialize.storage ?? new Map();
    }

    private async findAccessToken() {
        
        if ( this.storage instanceof Map ) {
            
            const expireAt: number | undefined = this.storage.get("expire_at");

            if ( Date.now() > ( expireAt as number || 0 ) ) {
                this.storage.set("token", await getAccessToken( this.credential ) );
                this.storage.set("expire_at", Date.now() + 359e4 );
            }

            return this.storage.get("token") as string

        }

        
        
    }

}

new GoogleAuth({
    credential: 
})
