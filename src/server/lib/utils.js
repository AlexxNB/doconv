import fs from 'fs/promises'
import path from 'path'

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