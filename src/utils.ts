
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

async function createWebtoken( client_email: string, private_key: string, scope: string ) {

    const now = Math.floor( Date.now() / 1e3 );

    const payload = btoa( JSON.stringify({
        iss: client_email,
        scope: scope,
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

    const encoder = new TextEncoder();
    const keyBuffer = ptob( private_key );
    const key = await crypto.subtle.importKey( "pkcs8", keyBuffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"] );
    const toSign = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${ base64UrlEncode( payload ) }`;
    const signature = await crypto.subtle.sign( "RSASSA-PKCS1-v1_5", key, encoder.encode( toSign ) );
    const signatureBase64 = btoa( String.fromCharCode( ...new Uint8Array( signature ) ) ).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
    return `${ toSign }.${ signatureBase64 }`;
}

export async function getAccessToken( client_email: string, private_key: string, scope: string ) {
    const assertion = await createWebtoken( client_email, private_key, scope );
    const response = await fetch( "https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            assertion, grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        })
    });
    const data = await response.json();
    if ( data && typeof data.access_token == "string" ) {
        return data.access_token as string;
    }
    return undefined
}
