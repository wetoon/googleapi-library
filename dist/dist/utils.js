function fnPrivate2Buffer(pem) {
    const base64Key = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .trim();
    const binaryString = atob(base64Key);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array.buffer;
}
async function fnGenarateJWT(client_email, private_key, scope) {
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1e3);
    const payload = {
        iss: client_email,
        scope: scope,
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    };
    const base64UrlEncode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const encoder = new TextEncoder();
    const keyBuffer = fnPrivate2Buffer(private_key);
    const key = await crypto.subtle.importKey("pkcs8", keyBuffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    const toSign = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(toSign));
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    return `${toSign}.${signatureBase64}`;
}
export async function getAccessToken(client_email, private_key, scope) {
    const assertion = await fnGenarateJWT(client_email, private_key, scope);
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            assertion, grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        })
    });
    const data = await response.json();
    if (data && typeof data.access_token == "string") {
        return data.access_token;
    }
    return undefined;
}
