
import { type GoogleAuth } from ".";

export function GoogleDatabase( this: GoogleAuth, databaseURL: string ) {

    const database = new URL( databaseURL ).origin;

    /**
     * Google Firebase Realtime Database. Find all data
     */
    const findAll = async < T = any >( path: `/${ string }` ): Promise< T | null > => {
        const token = await this.findAccessToken();
        const response = await fetch(`${ database }${ path }.json`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok ? await response.json() : null;
    }

    /**
     * Google Firebase Realtime Database. Set data
     */
    const create = async < T = any >( path: `/${ string }`, data: T ): Promise< T | null > => {
        const token = await this.findAccessToken();
        const response = await fetch(`${ database }${ path }.json`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.ok ? data : null;
    }

    /**
     * Google Firebase Realtime Database. Remove data
     */
    const remove = async ( path: `/${ string }` ): Promise< boolean > => {
        const token = await this.findAccessToken();
        const response = await fetch(`${ database }${ path }.json`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok;
    }

    /**
     * Google Firebase Realtime Database. Query data
     */
    const query = async < T = any >( path: `/${ string }`, queryParams: Record< "orderBy" | "equalTo", any > ): Promise< T | null > => {
        const token = await this.findAccessToken();
        const queryString = new URLSearchParams( queryParams ).toString();
        const response = await fetch(`${ database }${ path }.json?${ queryString }`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok ? await response.json() : null;
    }

    /**
     * Google Firebase Realtime Database. Transaction update data
     */
    const transaction = async < T = any >( path: `/${ string }`, updateFn: ( currentData: T ) => T ): Promise< T | null > => {
        try {
            const token = await this.findAccessToken();
            const url = `${ database }${ path }.json`;
            
            const response = await fetch( url, {
                method: "GET", headers: { Authorization: `Bearer ${token}` },
            });
            if ( !response.ok ) throw new Error(`Error fetching data: ${ response.statusText }`);
            const currentData = await response.json();
            
            const newData = updateFn( currentData );
            
            const updateResponse = await fetch( url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });
            
            if ( !updateResponse.ok ) throw new Error(`Error updating data: ${ updateResponse.statusText }`);
            return await updateResponse.json();
        } catch ( error ) {
            console.error("Transaction failed:", error);
            return null;
        }
    }

    return { findAll, create, remove, query, transaction }

}