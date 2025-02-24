# GoogleAPI Library

&#x20;

Google APIs project for Realtime Database and Drive v3 using `fetch`.

## Features

- Google Drive API v3 support
- Google Realtime Database support
- Uses `fetch` for HTTP requests
- Supports Cloudflare Workers KV for caching access tokens

## Installation

Install via npm:

```sh
npm install googleapi-library
```

or using Bun:

```sh
bun add googleapi-library
```

## Usage

### Import the Library

```ts
import { GoogleAuth } from "googleapi-library";
```

or with CommonJS:

```js
const { GoogleAuth } = require("googleapi-library");
```

### Initialize API

```ts
const auth = new GoogleAuth({
  credential: {
    client_email: "YOUR_CLIENT_EMAIL",
    private_key: "YOUR_PRIVATE_KEY",
  },
  storage: new Map(), // or use KVNamespace in Cloudflare Workers
});
```

## Google Drive API

### Create a File

```ts
const drive = auth.drive();
const file = new File(["Hello World"], "hello.txt", { type: "text/plain" });
const response = await drive.create(file);
console.log(response);
```

### Remove a File

```ts
await drive.remove("FILE_ID");
console.log("File removed successfully");
```

### Find All Files

```ts
const files = await drive.findAll();
console.log(files);
```

## Google Realtime Database API

### Create Data

```ts
const database = auth.database();
await database.create("path/to/data", { key: "value" });
console.log("Data created successfully");
```

### Remove Data

```ts
await database.remove("path/to/data");
console.log("Data removed successfully");
```

### Find All Data

```ts
const allData = await database.findAll("path/to/data");
console.log(allData);
```

### Query Data

```ts
const queryResult = await database.query("path/to/data", { orderBy: "key", equalTo: "value" });
console.log(queryResult);
```

### Transaction

```ts
await database.transaction("path/to/data", (currentData) => {
  return { ...currentData, updatedKey: "newValue" };
});
console.log("Transaction completed successfully");
```

## Configuration

| Option       | Type                   | Description                    |                      |
| ------------ | ---------------------- | ------------------------------ | -------------------- |
| `credential` | `GoogleAuthCredential` | Google service account details |                      |
| `storage`    | \`Map\<any, any>       | KVNamespace\`                  | Token storage option |

## Repository

[GitHub Repository](https://github.com/wetoon/googleapi-library)

## License

This project is licensed under the [MIT License](LICENSE).

