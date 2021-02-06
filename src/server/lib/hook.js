import FormData from 'form-data';

export default {
    file: sendFile,
    error: sendError,
}

function sendFile(url,file,filename,mime,context){
    const form = new FormData();
    form.append('file', file, { 
        filename : filename, 
        contentType : mime, 
    });
    if(context) form.append('context', JSON.stringify(context));
    form.submit(url);
}

function sendError(url,message,context){
    const form = new FormData();
    form.append('error', message);
    if(context) form.append('context', JSON.stringify(context));
    form.submit(url);
}