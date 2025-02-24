
import { GoogleDrive } from "./drive";
import { getAccessToken } from "./utils";
import { GoogleDatabase } from "./database";
import type { KVNamespace } from "@cloudflare/workers-types";

export type GoogleAuthCredential = { client_email: string, private_key: string } | { [ key:string ]: string };

export class GoogleAuth {

    private credential: GoogleAuthCredential = {};
    private storage: Map<string,string|number> | KVNamespace;

    public constructor( initialize: { credential: GoogleAuthCredential, storage?: Map<any,any> | KVNamespace } ) {
        this.credential = initialize.credential;
        this.storage = initialize.storage ?? new Map();
    }

    protected async findAccessToken() {
        
        if ( this.storage instanceof Map ) {
            
            const expireAt = this.storage.get("expire_at") as number;

            if ( Date.now() > ( expireAt || 0 ) ) {
                this.storage.set("token", await getAccessToken( this.credential ) as string );
                this.storage.set("expire_at", Date.now() + 359e4 );
            }

            return this.storage.get("token") as string

        }

        const kv = this.storage as KVNamespace;
        const _access = await kv.get("access_token","json") as { expiresAt: number, token: string };
        
        if ( _access && Date.now() < _access.expiresAt ) {
            return _access.token;
        } else {
            const expiresAt = Date.now() + 359e4;
            const token = await getAccessToken( this.credential ) as string;
            await this.storage.put("access_token", JSON.stringify({ token, expiresAt }));
            return token;
        }

    }

    public drive = GoogleDrive;
    public database = GoogleDatabase;

}
