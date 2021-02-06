import fs from 'fs/promises';
import unoconv from '$lib/unoconv';
import { replaceExtension } from '$lib/utils';
import  sendHook  from '$lib/hook';

export default function( app ){
    app.post('/:format',async (req,res,next)=>{

        const input = req.files.file[0];
        const format = req.params.format;

        const hook = req.fields.hook ? req.fields.hook[0] : false;
        const context = req.fields.context ? JSON.parse(req.fields.context[0]) : false;

        unoconv.convert(input.path,format).then( async result => {
            const filename = replaceExtension(input.originalFilename,result.meta.ext);
            console.log('Convert: '+input.originalFilename,'->',filename);

            const body = await result.read();
            fs.unlink(input.path);

            return hook 
                ? sendHook.file(hook,body,filename,result.meta.mime,context)
                : res.sendFile(body,filename,result.meta.mime)
        })
        .catch( err => {
            return hook 
                ? sendHook.file(hook,err.message,context)
                : res.error(err.message)
        })

        return hook && res.end(`Converted file will be send to ${hook}`);
    });
}