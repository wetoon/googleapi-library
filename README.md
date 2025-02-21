# GoogleAPI Library

This project provides a simple interface for interacting with Google Drive and Firebase Realtime Database using only `fetch` requests, without setting up an HTTP server.

## Engines
- [NodeJS](https://nodejs.org/en) version >= 18

## Installation

```sh
npm install googleapi-library
```

## Usage

### Authentication

To use this library, you need to provide Google service account credentials.

```typescript
import { GoogleAuth } from "googleapi-library";

const credentials = {
  client_email: "your-service-account@your-project.iam.gserviceaccount.com",
  private_key: "your-private-key"
};

const googleAuth = new GoogleAuth(credentials);
```

### Google Drive

#### Initialize Google Drive
```typescript
const drive = googleAuth.drive("your-folder-id");
```

#### Upload a File
```typescript
const fileId = await drive.create(myFile);
console.log("Uploaded file ID:", fileId);
```

#### Delete a File
```typescript
const success = await drive.remove("file-id");
console.log("File deleted:", success);
```

#### List Files
```typescript
const files = await drive.filter();
console.log("Files:", files);
```

### Firebase Realtime Database

#### Initialize Database
```typescript
const database = googleAuth.database("https://your-database.firebaseio.com");
```

#### Retrieve Data
```typescript
const data = await database.findAll("/path");
console.log("Data:", data);
```

#### Insert or Update Data
```typescript
await database.create("/path", { key: "value" });
```

#### Delete Data
```typescript
await database.remove("/path");
```

#### Query Data
```typescript
const result = await database.query("/users", { orderBy: "name", equalTo: "John" });
console.log("Query Result:", result);
```

## License

This project is licensed under the MIT License.
