import {downloadFile} from './utils';

export default function(apiURL){
    return {
        get: async (endpoint)=>request(apiURL+endpoint,'GET'),
        post: {
            json: async (endpoint,data={})=>request(apiURL+endpoint,'POST_JSON',data),
            multipart: async (endpoint,data={})=>request(apiURL+endpoint,'POST_MULTIPART',data)
        }
    }
}

async function request(endpoint,method,data){

    method = method || 'GET';
    let options = {};

    if(method == 'POST_MULTIPART'){
        const formData = new FormData();
        
        for(let field in data){
            formData.append(field,data[field])
        }
        options.body = formData;
    }

    if(method == 'POST_JSON'){
        options.body = JSON.stringify(data);
        options.headers = {'Content-Type': 'application/json'}
    }

    options.method = method.replace(/_.+$/,'');
    let res = await fetch(endpoint,options);

    const mime = res.headers.get('Content-Type');
    const isfile = res.headers.get('Content-Disposition');

    if(!res.ok) throw new Error(await res.text());

    if(isfile){
        const filename = isfile.split('filename=')[1];
        const body = await res.blob();
        return {
            body,
            filename,
            mime,
            download: (name) => downloadFile(body,name||filename,mime)
        }
    }else if(mime == 'application/json'){
        return await res.json();
    }else if(mime == 'plain/text'){
        return await res.text();
    }
}