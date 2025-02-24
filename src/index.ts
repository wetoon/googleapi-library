
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
            
            const token: string | undefined = this.storage.get("token");
            const expireAt: number | undefined = this.storage.get("expire_at");

            if ( expireAt && Date.now() > expireAt ) {
                this.storage.set()
            }

        }

        return await getAccessToken( this.credential );
        
    }

}

new GoogleAuth({
    credential: 
})
