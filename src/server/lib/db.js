import fs from 'fs/promises';
import path from 'path';
import {customAlphabet} from 'nanoid';
import {exists} from '$lib/utils';

const nanoid = customAlphabet('1234567890abcdef', 32);

export default {
    connect
}

function connect(filepath){

    let COLLECTION;

    const write = async () => await fs.writeFile(filepath,JSON.stringify(COLLECTION));
    const load = async () => {
        if(COLLECTION) return;

        const dir = path.dirname(filepath);

        if(!(await exists(dir))) await fs.mkdir(dir,{recursive:true});

        if((await exists(filepath)))
            COLLECTION = JSON.parse((await fs.readFile(filepath,'utf8')));
        else{
            COLLECTION = [];
            await write();
        }
            
    }

    const queryFilter = (query,match=true)=> item => {
        for(let prop in query){
            if(query[prop] !== item[prop]) return !match;
        }
        return match;
    }

    return {
        insert: async (obj)=>{
            await load();
            obj._id = nanoid();
            COLLECTION.push(obj);
            await write();
            return obj;
        },
        delete: async (query)=>{
            await load();
            COLLECTION = COLLECTION.filter(queryFilter(query,false));
            await write();
        },
        find: async (query)=>{
            await load();
            return COLLECTION.filter(queryFilter(query));
        },
        findOne: async (query)=>{
            await load();
            return COLLECTION.find(queryFilter(query));
        }
    }
}