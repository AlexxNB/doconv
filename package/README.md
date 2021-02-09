# Doconv

Doconv API client for browser and nodejs.

## Doconv

[Doconv](https://github.com/AlexxNB/doconv) is a document converting service with simple HTTP API packed in Docker image. This package is the simplest way to interact with its API.

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

> Also doconv is available on CDNs like [https://unpkg/doconv](https://unpkg/doconv)

## Using in Node

### Client

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

### Hook handler


```js
const {hookParser} = require('doconv');

//Express-like middleware
async function(request,responce,next){
    try{
        const result = await hookParser(request);

        if(result.error) throw new Error('Error during converting: ' + result.error);

        console.log('Recieved file:', result.file.filename);

        await result.file.save('/home/user/myfilestorage');
    }catch(err){
        console.log('Error:' + err.message)
    }

    responce.end();
}

```

## API Browser

Most of methods are asynchronus, use it as a Promise.

---
### Doconv client creator

#### **`doconv([api_url])`**


**Params:**
* `api_url` - URL like `http://domain.tld:port` where is Doconv container started

**Returns:** Doconv client object.

---
---

### Doconv client

#### **`formats()`**

**Returns:** Formats list [object](#formats-list-object)

---
#### **`convert({options})`**

**Options:**
* `file` – [*files*](https://developer.mozilla.org/en-US/docs/Web/API/FileList) property value from the `<input type="file">` element. *(Required)*
* `format` – format of target file. One from formats identifiers list which returns `format()` method. *(Default `pdf`)*;
* `download` – once converted file will be recieved, opens save dialog in browser. Ignoring if `hook` property specified. *(Default `false`)*
* `hook` – URL where is a server which can recieve a converted file(look for Node API below). *(Default `false`)*
* `context` – any [serializable](https://developer.mozilla.org/en-US/docs/Glossary/Serialization) object, will be send to `hook` URL along with file. Place here any data you need in hook  to handle recieved file.*(Default `false`)*


**Returns:** If `hook` property speciefed, will be return text confirmation, that file will be sended to hook's URL. Otherwise result will be an object:
* `body` - converted file body content.
* `filename` – name of file. 
* `mime` – mime type of file
* `download([name])` – call it to save file on device. Optionaly you may specify any `name` for downloading file.

---
---

## API Node
---
### Doconv hook handler

#### **`parseHook(<request>)`**

**Params:**
* `<request>` – Node [http-request](https://nodejs.org/api/http.html#http_class_http_clientrequest) object. 

**Returns:** If request is posted from Doconv service, returns object:
* `error` – returned if there was error during converting 
* `context` – object from client, if provided
* `meta` – some metadata for the input and converted files.
* `file` – converted file object:
    - `filename` – name of the converted file.
    - `mime` – mime type of the file.
    - `size` – size in  bytes.
    - `tmp` – path to temp file. It will be removed after calling `save` or `read` methods.
    - `read()` – returns file's body as a Buffer.
    - `save( <dir>,[filename] | <path> )` – save file in the specified `directory`. Optionaly you may specifiy a different `filename` also. Or you can just specifiy full path to the new file.

---


### Doconv client creator

#### **`doconv([api_url])`**


**Params:**
* `api_url` - URL like `http://domain.tld:port` where is Doconv container started

**Returns:** Doconv client object.

---
---


### Doconv client

#### **`formats()`**

**Returns:** Formats list [object](#formats-list-object)

---
#### **`convert({options})`**

**Options:**
* `file` – [*files*](https://developer.mozilla.org/en-US/docs/Web/API/FileList) property value from the `<input type="file">` element. *(Required)*
* `format` – format of target file. One from formats identifiers list which returns `format()` method. *(Default `pdf`)*;
* `hook` – URL where is a server which can recieve a converted file(look for Node API below). *(Default `false`)*
* `context` – any [serializable](https://developer.mozilla.org/en-US/docs/Glossary/Serialization) object, will be send to `hook` URL along with file. Place here any data you need in hook  to handle recieved file.*(Default `false`)*


**Returns:** If `hook` property speciefed, will be return text confirmation, that file will be sended to hook's URL. Otherwise result will be an object:
* `body` - converted file body content as a Buffer.
* `filename` – name of file. 
* `mime` – mime type of file
* `save( <dir>,[filename] | <path> )` – save file in the specified `directory`. Optionaly you may specifiy a different `filename` also. Or you can just specifiy full path to the new file.

---
---

### Formats list object

Looks like this:

```js
[
    ...,
    {
        // Group of format
        "doctype": "document",  
        // Format identifier
        "format": "docx", 
        // Text description
        "description": "Microsoft Office Open XML", 
        // Extension of the files of this format
        "ext": "docx", 
        // Mime type for this format
        "mime": "application/msword", 
    },
    ...
]
```