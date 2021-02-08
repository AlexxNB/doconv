import path from 'path';
import fs from 'fs/promises';
import { customAlphabet } from 'nanoid'
import {parseHook,doconv} from 'doconv';
import DB from '$lib/db';

const nanoid = customAlphabet('1234567890abcdef', 10);
const filesDB = DB.connect('/store/files.db');
const dc = doconv('http://localhost:3000');

export default function( app ){
    app.post('/save',async (req,res,next)=>{
        parseHook(req).then( async result => {
            if(result.file){
                const filepath = path.join('/store',`${nanoid()}_${result.file.filename}`);
                await result.file.save(filepath);
                let screenpath = false;

                try {
                    const screenshot = await dc.convert({
                        file: filepath,
                        format:'png'
                    });
                    screenpath = await screenshot.save('/store');
                }catch(err){
                    console.log(err);
                }
                
                
                await filesDB.insert({
                    name: result.file.filename,
                    path: filepath,
                    mime: result.file.mime,
                    screenpath,
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
                size:f.size,
                screenshot: !!f.screenpath
            }
        });
        return res.json(list);
    });

    app.get('/screenshot/:id', async (req,res,next)=>{
        const data = await filesDB.findOne({_id:req.params.id});
        
        if(!data || !data.screenpath) return res.error('No screenshot available');
        res.writeHead(200, {
            "Content-Type": "image/png"
        });
        return res.end((await fs.readFile(data.screenpath)));
    });

    app.get('/download/:id', async (req,res,next)=>{
        const data = await filesDB.findOne({_id:req.params.id});
        if(!data || !data.path) return res.error('No such file');
        return res.sendFile(data.path,data.name,data.mime);
    });
}