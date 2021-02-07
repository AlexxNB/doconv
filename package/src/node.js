import multiparty from 'multiparty';
import fs from 'fs/promises';
import path from 'path';
import api from './lib/node/api'

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
                    return buffer();
                }

                const save = async (dir,filename)=>{
                    await fs.copyFile(file.path,path.join(dir,filename || file.originalFilename));
                    remove();
                }

                result.file = {
                    filename: file.originalFilename,
                    size: file.size,
                    tmp: file.path,
                    read,
                    save
                }   
            }

            resolve(result);
        });
    });
    
}

export function doconv(apiURL){

    async function convert(options){

        if(!options.file) throw new Error('File was not specified');

        options = {
            format: 'pdf',
            hook: false,
            context: false,
            ...options
        }

        let data = {file: typeof options.file == 'string' ? fs.createReadStream(options.file) : options.file};
        if(options.hook) data.hook = options.hook;
        if(options.context) data.context = JSON.stringify(options.context);

        const result = await api.post('/convert/'+options.format,data);

        if(!options.hook &&  options.download && result.download) result.download();

        return options.hook ? `Result will be sent to ${hook}` : result;
    }

    return {
        convert
    }
}

