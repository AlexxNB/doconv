import multiparty from 'multiparty';
import fs from 'fs/promises';
import {createReadStream} from 'fs';
import path from 'path';
import createApi from './lib/node/api'
import {isDirectory} from './lib/node/utils'


export function parseHook(request){
    return new Promise((resolve,reject)=>{
        if(!request.headers['x-doconv-hook']) return reject('Not hook request');
        const form =  new multiparty.Form();
        form.parse(request, function(err, fields, files) {
            if(err) return reject(err);

            let result = {};
            if(fields.error) result.error = fields.error[0];
            if(fields.meta) result.meta = JSON.parse(fields.meta[0]);
            if(fields.context) result.context = JSON.parse(fields.context[0]);
            if(files.file) {
                const file = files.file[0];

                const remove = async ()=>await fs.unlink(file.path);

                const read = async () => {
                    const buffer = await fs.readFile(file.path);
                    remove();
                    return buffer;
                }

                const save = async (dir,filename)=>{
                    const filepath = (await isDirectory(dir)) 
                                        ? path.join(dir,filename || file.originalFilename) 
                                        : dir;
                    await fs.copyFile(file.path,filepath);
                    remove();
                    return filepath;
                }

                result.file = {
                    filename: file.originalFilename,
                    size: file.size,
                    tmp: file.path,
                    mime: file.headers['content-type'],
                    read,
                    save
                }   
            }

            resolve(result);
        });
    });
    
}

export function doconv(apiURL){

    const api = createApi(apiURL ? apiURL.replace(/\/+$/,'') : '');

    async function formats(){
        const result = await api.get('/formats');
        return result;
    }

    async function convert(options){

        if(!options.file) throw new Error('File was not specified');

        options = {
            format: 'pdf',
            hook: false,
            context: false,
            ...options
        }

        let data = {file: typeof options.file == 'string' ? createReadStream(options.file) : options.file};
        if(options.hook) data.hook = options.hook;
        if(options.context) data.context = JSON.stringify(options.context);

        const result = await api.post.multipart('/convert/'+options.format,data);

        return options.hook ? `Result will be sent to ${options.hook}` : result;
    }

    async function markup(options){

        let data = {
            body: '',
            download: false,
            markup: 'html',
            format: 'pdf',
            ...options
        };

        const format = data.format; delete data.format;
        const result = await api.post.json('/markup/'+format,data);

        return options.hook ? `Result will be sent to ${options.hook}` : result;
    }

    return {
        convert,
        formats,
        markup
    }
}