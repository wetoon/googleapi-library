
import { type GoogleAuth } from ".";

export function GoogleDrive( this: GoogleAuth, parents: string[] ) {

    /**
     * GoogleDrive create file
     * @return `string` File id 
     */
    const create = async ( file: File ): Promise<string> => {
        const body = new FormData();
        body.append( "metadata", new Blob([
            JSON.stringify({
                parents, name: file.name, mimeType: file.type
            })
        ], { type: "application/json" } ));
        body.append( "file", file );
        const token = await this.findAccessToken();
        const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
            body, method: "POST", headers: { "Authorization": `Bearer ${ token }` }
        });
        const { id } = await response.json() as { id: string };
        return id;
    }

    /**
     * GoogleDrive remove file by `id`
     * @return `true` File deleted
     * @return `false` File not found
     */
    const remove = async ( fileId: string ): Promise< true | false > => {
        const token = await this.findAccessToken();
        try {
            await fetch( `https://www.googleapis.com/drive/v3/files/${ fileId }`, {
                method: "DELETE", headers: { "Authorization": `Bearer ${ token }` }
            });
            return true
        } catch {
            return false
        }
    }

    /**
     * GoogleDrive list all files
     * @return `{ id: string, name: string }[]`
     */
    const findAll = async () => {
        const token = await this.findAccessToken();
        try {
            const response = await fetch( `https://www.googleapis.com/drive/v3/files?q='me' in owners&fields=files(id, name)`, {
                method: "GET", headers: { "Authorization": `Bearer ${ token }` }
            });
            const data = await response.json();
            return data.files as { id: string, name: string }[]
        } catch {
            return []
        }
    }

    return { create, remove, findAll }

}
