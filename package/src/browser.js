import createApi from './lib/browser/api';

export default function(apiURL){

    const api = createApi(apiURL ? apiURL.replace(/\/+$/,'') : '');

    async function formats(){
        const result = await api.get('/formats');
        return result;
    }

    async function convert(options){

        if(!options.file) throw new Error('File was not specified');

        options = {
            download: false,
            format: 'pdf',
            hook: false,
            context: false,
            ...options
        }

        let data = {file: options.file};
        if(options.hook) data.hook = options.hook;
        if(options.context) data.context = JSON.stringify(options.context);

        const result = await api.post.multipart('/convert/'+options.format,data);

        if(!options.hook &&  options.download && result.download) result.download();

        return result;
    }

    async function markup(options){

        let data = {
            body: '',
            download: false,
            markup: 'html',
            format: 'pdf',
            ...options
        };

        let download = data.download; delete data.download;
        let format = data.format; delete data.format;
        
        const result = await api.post.json('/markup/'+format,data);

        if(!data.hook &&  download && result.download) result.download();

        return result;
    }


    return {
        formats,
        convert,
        markup
    }
}

