
function ptob( pem: string ): ArrayBuffer {
    const base64Key = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .trim();
    const binaryString = atob( base64Key );
    const uint8Array = new Uint8Array( binaryString.length );
    for ( let i = 0; i < binaryString.length; i++ ) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array.buffer;
}

async function createWebtoken( options: { client_email: string, private_key: string, scope: string }): Promise<string> {
    const now = Math.floor( Date.now() / 1e3 );
    const header = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"; // { alg: "RS256", typ: "JWT" }
    const payload = btoa( JSON.stringify({ scope: options.scope, iss: options.client_email, aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const token = header.concat( ".", payload );
    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        await crypto.subtle.importKey( "pkcs8", ptob( options.private_key ), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"] ),
        new TextEncoder().encode( token )
    );
    const signatureBase64 = btoa( String.fromCharCode( ...new Uint8Array( signature ) ) ).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
    return `${ token }.${ signatureBase64 }`;
}

export async function getAccessToken( client_email: string, private_key: string, scope: string ) {
    const assertion = await createWebtoken({ client_email, private_key, scope });
    return await fetch( "https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            assertion, grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        })
    }).then( e => e.json() ).then( response: { access_token: string, expires_in: 3599, token_type: "Bearer" } => response.access_token );
}
