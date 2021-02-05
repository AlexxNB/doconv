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
            ...options
        }

        const result = await api.post('/convert/'+options.format,{file:options.file});
        if(options.download && result.download) result.download();
        return result;
    }


    return {
        formats,
        convert
    }
}

