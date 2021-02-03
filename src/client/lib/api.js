export default {
    request,
    get: async (endpoint)=>request(endpoint,'GET'),
    post: async (endpoint,data={})=>request(endpoint,'POST',data)
}

async function request(endpoint,method,data){

    const formData = new FormData();
    for(let field in data){
        formData.append(field,data[field])
    }

    const res = await fetch(endpoint,{
        method:method||'GET',
        body: method !== 'GET' ? formData : undefined
    });

    const type = res.headers.get('Content-Type');
    const download = res.headers.has('Content-Disposition');

    if(!res.ok) throw new Error(await res.text());

    if(download){
        window.location.assign( window.URL.createObjectURL( await res.blob() ) );
    }else if(type == 'application/json'){
        return await res.json();
    }else if(type == 'plain/text'){
        return await res.text();
    }
}
