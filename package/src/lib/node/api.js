import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import FormData from 'form-data';
import {isDirectory} from './utils';

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
    const mime = responce.headers['content-type'];
    const isfile = responce.headers['content-disposition'];
    
    return new Promise((resolve,reject)=>{
        let body = [];
        responce.on('error', err => reject(err.message));
        responce.on('data', chunk=>body.push(chunk));
        responce.on('end', async () => {
            body = Buffer.concat(body);
            if(isfile){
                const name = isfile.split('filename=')[1];
                return resolve({
                    body,
                    filename:name,
                    mime,
                    save: async (dir,filename)=>{
                        const filepath = (await isDirectory(dir)) 
                                            ? path.join(dir,filename || name) 
                                            : dir;
                        await fs.writeFile(filepath,body);
                        return filepath;
                    }
                })
            }else if(mime == 'application/json'){
                return resolve(JSON.parse(body.toString()));
            }else return resolve(body.toString());
        });
    });

}


