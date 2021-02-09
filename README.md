# Doconv
Document converting service with simple HTTP API packed in Docker image.  Powered by LibreOffice and unoconv.  

## Libraries

Check this packages for easy using the Doconv service.

* [Doconv](https://npmjs.com/doconv) - Javascript API client for node.js and browsers.

## Run service

```sh
docker run -p 3000:3000 ghcr.io/alexxnb/doconv
```

## Quick test

Point your browser to `http://localhost:3000` and you will see the form where you can upload any document and download converted file of choosen format.

## Simple client example

You may create a form which will send a file to the service and download generated  PDF-file.

```html
<form action="http://localhost:3000/convert/pdf" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" />
    <button type="submit">Convert</button>
</form>
```

## API

> POST requests are sending using `multipart/form-data`. 

> Each request will be responsed with file attachment, JSON or plain text.

> If Hook-url is specified, it will recieve POST request with `multipart/form-data` body.


### GET: `/formats`
**Returns:** application/json

Returns JSON list with all supported formats. Each element of list has this shape:

```js
{
    "doctype": "document",  //group of format
    "format": "docx", // Format identifier
    "description": "Microsoft Office Open XML", // Text description
    "ext": "docx", // extension of the files of this format
    "mime": "application/msword", //mime type for this format
}
```

> Not all formats may be converted to each other.

### POST: `/convert/<format>`
**Returns:** converted file or plain/text(if hook specified)

**Params:**
* `<format>` - target format for file conversion. May be one from the list returned by `/formats` request.

**Form fields:**
* `file` - file to convert
* `hook` - will send result to specified hook-url instead returning converting file.
* `context` - any serializable JS-object which will be send to hook-url along with converted file.

**Form fields sending to hook:**
* `file` - converted file
* `meta` - some info about input and output file.
* `context` - JS-object from the request. If provided.


