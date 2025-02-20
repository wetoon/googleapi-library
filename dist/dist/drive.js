import { getAccessToken } from "./utils";
export class GoogleDrive {
    parentFolder = "";
    credential = {};
    storage = {};
    constructor(credential, parent) {
        this.credential = credential;
        this.parentFolder = parent;
    }
    async getToken() {
        const currentTime = Date.now();
        if (this.storage.token && currentTime < this.storage.expireAt) {
            return this.storage.token;
        }
        this.storage.token = await getAccessToken(this.credential.client_email, this.credential.private_key, "https://www.googleapis.com/auth/drive");
        this.storage.expireAt = currentTime + 36e5; // Token valid for 1 hour
        return this.storage.token;
    }
    async create(file) {
        const body = new FormData();
        body.append("metadata", new Blob([
            JSON.stringify({
                name: file.name,
                mimeType: file.type,
                parents: this.parentFolder
            })
        ], { type: "application/json" }));
        body.append("file", file);
        const token = await this.getToken();
        const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
            body,
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const { id } = await response.json();
        return id;
    }
    async remove(fileId) {
        const token = await this.getToken();
        try {
            await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
                method: "DELETE", headers: { "Authorization": `Bearer ${token}` }
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async filter() {
        const token = await this.getToken();
        try {
            const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='me' in owners&fields=files(id, name)`, {
                method: "GET", headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (data && Array.isArray(data.files)) {
                return data.files;
            }
            return undefined;
        }
        catch {
            return undefined;
        }
    }
}
