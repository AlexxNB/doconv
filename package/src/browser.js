import createApi from './lib/api';

export default function(apiURL){

    const api = createApi(apiURL ? apiURL.replace(/\/+$/,'') : '');

    async function formats(){
        const result = await api.get('/formats');
        return result;
    }

    async function convert(options){

        if(!options.file) throw new Error('File for convertion was not specified');

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

        const result = await api.post('/convert/'+options.format,data);

        if(!options.hook &&  options.download && result.download) result.download();

        return options.hook ? `Convertion result will be send to ${hook}` : result;
    }


    return {
        formats,
        convert
    }
}

