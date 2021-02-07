import path from 'path';
import { customAlphabet } from 'nanoid'
import {parseHook} from 'doconv';
import DB from '$lib/db';

const nanoid = customAlphabet('1234567890abcdef', 10);
const filesDB = DB.connect('/store/files.db');

export default function( app ){
    app.post('/save',async (req,res,next)=>{
        parseHook(req).then( async result => {
            if(result.file){
                const filename = `${nanoid()}_${result.file.filename}`;
                await result.file.save('/store',filename);
                await filesDB.insert({
                    name: result.file.filename,
                    path: path.join('/store',filename),
                    size: result.file.size,
                });
            } 
            return res.end('OK');
        }).catch( err => {
            console.log(err);
            return res.end(err.message);
        });  
    });

    app.get('/list', async (req,res,next)=>{
        const list = (await filesDB.find({})).map(f=>{
            return {
                id:f._id,
                name:f.name,
                size:f.size
            }
        });
        return res.json(list);
    });
}