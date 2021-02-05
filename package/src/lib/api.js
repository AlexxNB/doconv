import {downloadFile} from './utils';

export default function(apiURL){
    return {
        get: async (endpoint)=>request(apiURL+endpoint,'GET'),
        post: async (endpoint,data={})=>request(apiURL+endpoint,'POST',data)
    }
}

async function request(endpoint,method,data){

    method = method || 'GET';

    let options = {method};

    if(method == 'POST'){
        const formData = new FormData();
        
        for(let field in data){
            formData.append(field,data[field])
        }
        options.body = formData;
    }

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