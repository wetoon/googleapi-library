
import { GoogleAuth } from "../dist";

const google = new GoogleAuth({});

const drive = google.drive("google_drive_folder_ID");

await drive.create()
await drive.filter()
await drive.remove()
