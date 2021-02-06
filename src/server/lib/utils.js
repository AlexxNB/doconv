import fs from 'fs/promises'
import path from 'path'
import {URL} from 'url'

/** async checks is file exists */
export async function exists(path){
    return new Promise( resolve => {
        fs.stat(path)
            .then(()=>resolve(true))
            .catch(()=>resolve(false))
    });
}

/** Replace file's extension in the path */
export function replaceExtension(file,ext){
    const parts = path.parse(file);
    return `${parts.dir.length ? parts.dir+'/' : ''}${parts.name}.${ext}`;
}


export function parseURL(url,header){
    try{
        const o = new URL(url);
        const parts =  {
            host: o.hostname,
            path: o.pathname+(o.search||''),
            port: o.port,
            protocol: o.protocol
        }
        if(header) {
            parts.headers = {};
            parts.headers['x-doconv-'+header]='true';
        }
        return parts;
      }catch{
        return false;
      }
}