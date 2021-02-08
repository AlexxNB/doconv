# Doconv

Doconv API client for browser and nodejs.

## Doconv

[Doconv](https://github.com/AlexxNB/doconv) is a document converting service with simple HTTP API packed in Docker image. This package is the simplest way to interact with this API.

## Install 

```sh
npm install doconv
```

## Using in Browser

```js
// May need full path 'doconv/dist/browser/doconv.esm.js'
import doconv from 'doconv';


// Use URL where is Doconv container started
const dc = doconv('http://localhost:3000'); 

// Load list of all possible formats
const formats = await dc.formats();
console.log("Supported formats:",formats);

// Somewhere on the page: 
//    <input type="file" id="myFile" />
//    <button onclick="convertFile">Convert</button>

async function convertFile(){
    // Send file to the service and waiting responce
    const result = await dc.convert({
        file: document.getElementById('myFile').files[0],
        format: 'pdf'
    });

    // When converted file ready, let user to download it
    result.download();
}
```

## Using in Node

```js
const {doconv} = require('doconv');

// Use URL where is Doconv container started
const dc = doconv('http://localhost:3000');

// Send file to the service and waiting responce
const result = await dc.convert({
    file: '/home/user/document.docx',
    format: 'pdf'
});

// Save converted document on specified path
result.save('/home/user/converted.pdf');
```
