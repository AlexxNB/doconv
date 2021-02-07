import http from 'http';
import FormData from 'form-data';

export default function(apiURL){
    return {
        get: async (endpoint)=>get(apiURL+endpoint),
        post: async (endpoint,data)=>post(apiURL+endpoint,data)
    }
}

function post(endpoint,data){
    return new Promise((resolve,reject)=>{
        const formData = new FormData();
        
        for(let field in data){
            formData.append(field,data[field])
        }

        formData.submit(endpoint,async (err,res)=>{
            console.log('ARGUMENTS',arguments);
            if(err) return reject(err);
            resolve(await bodyParser(res));
        })
    })
}

function get(endpoint){
    return new Promise((resolve,reject)=>{
        http.get(endpoint,async (res)=>{
            const message = await bodyParser(res);
            if(!res.ok) return reject(message);
            return resolve(message);
        }).on("error", (err) => {
            reject(err.message);
        })
    });
}

function bodyParser(responce){
    const mime = res.headers['Content-Type'];
    const isfile = res.headers['Content-Disposition'];
    
    return new Promise((resolve,reject)=>{
        let body = "";
        responce.setEncoding('utf8');
        responce.on('error', err => reject(err.message));
        responce.on('data', chunk=>body += chunk);
        responce.on('end', async () => {
            if(isfile){
                const filename = isfile.split('filename=')[1];
                const body = await responce.blob();
                return resolve({
                    body,
                    filename,
                    mime
                })
            }else if(mime == 'application/json'){
                return resolve(JSON.parse(body));
            }else return resolve(body);
        });
    });

}


