import FormData from 'form-data';

export default {
    file: sendFile,
    error: sendError,
}

function sendFile(url,file,meta,context){
    const form = new FormData();
    form.append('file', file, { 
        filename : meta.output.filename, 
        contentType : meta.output.mime, 
    });
    form.append('meta', JSON.stringify(meta));
    if(context) form.append('context', JSON.stringify(context));
    form.submit(url,(err,res)=>res.resume());
}

function sendError(url,message,meta,context){
    const form = new FormData();
    form.append('error', message);
    form.append('meta', JSON.stringify(meta));
    if(context) form.append('context', JSON.stringify(context));
    form.submit(url,(err,res)=>res.resume());
}