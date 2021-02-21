import fs from 'fs/promises';
import path from 'path';
import marked from 'marked';
import {customAlphabet} from 'nanoid';
import unoconv from '$lib/unoconv';
import { parseURL } from '$lib/utils';
import  sendHook  from '$lib/hook';

const MARKUPS = {
    html: {ext:'html',mime:'text/html'},
    markdown: {ext:'md',mime:'text/markdown'}
}

const nanoid = customAlphabet('1234567890abcdef', 32);

export default function( app ){
    app.post('/:format',async (req,res,next)=>{
        

        const format = req.params.format;
        const meta = unoconv.getFormat(format);
        
        const data = {
            body: '',
            markup: 'html',
            name: 'Document',
            pageWidth: 210,
            pageHeight: 297,
            marginTop: 15,
            marginRight: 15,
            marginBottom: 15,
            marginLeft: 15,
            hook: null,
            context: null,
            pageBreak: '<!--PAGEBREAK-->',
            ...(req.body || {})
        };

        if(!MARKUPS[data.markup]) return res.error(`Unsupported markup. Allowed are: ${Object.keys(MARKUPS).join(', ')}`);
        if(!meta) return res.error(`Unknown format`);

        const url = data.hook && parseURL(data.hook,'hook');
        if(data.hook && !url) return res.error('Invalid hook URL');

        data.body = data.body.replace(new RegExp(data.pageBreak, "g"),'<p style="margin: 0; line-height: 1%; page-break-before: always"></p>\n');

        if(data.markup === 'markdown') data.body = marked(data.body);

        data.body = `
        <style>
            @page { 
                size: ${data.pageWidth}mm ${data.pageHeight}mm; 
                margin-top: ${data.marginTop}mm;
                margin-bottom: ${data.marginBottom}mm;
                margin-left: ${data.marginLeft}mm;
                margin-right: ${data.marginRight}mm;
            }
        </style>
        `+data.body;

        const tmpfile = path.join('/tmp',`${nanoid()}.html`);

        await fs.writeFile(tmpfile,data.body);

        unoconv.convert(tmpfile,format).then( async result => {
            const filename = `${data.name}.${meta.ext}`;
            console.log('Markup: '+data.markup,'->',filename);

            const body = await result.output.read();
            result.input.clear();

            return data.hook 
                ? sendHook.file(url,body,getMeta(data,result),data.context)
                : res.sendFile(body,filename,result.output.meta.mime)
        })
        .catch( err => {            
            return data.hook 
                ? sendHook.error(url,err.message,getMeta(data),data.context)
                : res.error(err.message)
        })

        return data.hook && res.end(`Generated file will be send to ${data.hook}`);
    });
}

function getMeta(data,result){
    let markup = MARKUPS[data.markup];
    let meta = {
        input:{
            filename: `${data.name}.${markup.ext}`,
            mime: markup.mime,
            size: data.body.length,
        }
    }

    if(result){
        meta.output = {
            filename: `${data.name}.${result.output.meta.ext}`,
            format: result.output.meta.format,
            mime: result.output.meta.mime
        };
    }

    return meta;
}