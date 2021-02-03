export default [
    sendFile,
    errors,
    json
]

function sendFile(req,res,next){

    res.sendFile = (buffer,filename,mime)=>{
        res.writeHead(200, {
            "Content-Type": mime || "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + encodeURI(filename)
        });
        res.end(buffer);
    }

    next();
}

function errors(req,res,next){

    res.error = (message,code)=>{
        res.writeHead(code || 500, {
            "Content-Type":"text/plain"
        });
        res.end(message);
    }

    next();
}

function json(req,res,next){

    res.json = (obj)=>{
        res.writeHead(200, {
            "Content-Type":"application/json"
        });
        res.end(JSON.stringify(obj));
    }

    next();
}