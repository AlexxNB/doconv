import os from 'os';
import fs from 'fs/promises';
import {execFile} from 'child_process';
import {exists} from '$lib/utils';
import path from 'path';
import mime from '$store/mime.json';


const TMP = os.tmpdir();
let VERBOSE = false;

export default {
    listener,
    formats,
    convert,
    getFormats,
    getFormat,
    getFormatByExt,
    getFormatByFile,
    verbose
}

/** Launch unoconv listener */
async function listener(){
    await unoconv('--listener');
    formats();
}

/** Convert file to format */
async function convert(input,format,options){

    options = {...options||{}}

    const inputMeta = getFormatByFile(input);
    if(!inputMeta) throw new Error('Unsupported input file');

    const formatMeta = getFormat(format);
    if(!formatMeta) throw new Error('Unsupported format');

    const output = options.output || `${TMP}/${path.parse(input).name}.${formatMeta.ext}`;

    let args = ['-o',output,'-f',format, '-d',inputMeta.doctype];

    args.push(input);

    const clear = async ()=>{if(await exists(output)) await fs.unlink(output)};
    const read = async (encoding)=>{
        const buffer = await fs.readFile(output,encoding);
        await clear();
        return buffer;
    }

    await unoconv(args);

    return {
        file: output,
        meta: formatMeta,
        read,
        clear
    }
}

/** Get supportes formats list */
const formatsList = [];
async function formats(){
    if(formatsList.length > 0) return;

    const formatsRaw = await unoconv('--show');

    const lines = formatsRaw.split('\n');
    
    let currentDocType;
    for(let line of lines){
        let match = line.match(/The following list of (.+) formats are currently available/);
        if(match){
            currentDocType = match[1];
            continue;
        }
        match = line.match(/\s([^\s]+)\s+\-\s+(.+)\s+\[\.([^\s]+)\]/);
        if(match){
            formatsList.push({
                doctype: currentDocType,
                format: match[1],
                description: match[2],
                ext: match[3],
                mime: mime[match[3]] || 'application/octet-stream',
            });
        }
    }
}

/** Get format info by format */
function getFormats(){
    return formatsList;
}
/** Get format info by format */
function getFormat(format){
    return formatsList.find(f => f.format === format);
}
/** Get format info by extension */
function getFormatByExt(ext){
    if(ext === 'htm') ext = 'html';
    if(ext === 'jpeg') ext = 'jpg';
    return formatsList.find(f => f.ext === ext);
}
/** Get format info by filename */
function getFormatByFile(file){
    return getFormatByExt(path.parse(file).ext.slice(1));
}

function verbose(state){
    VERBOSE = state === undefined ? true : state;
}

/// UNOCONV WRAPER 

function unoconv()
{
    const args = Array.from(arguments).flat();
    VERBOSE && args.unshift('--verbose');
    args.unshift('--timeout','10');

    VERBOSE && console.log('[DEBUG] unocondv '+args.join(' '));

    return new Promise((resolve, reject) => {
        const child = execFile('unoconv',args,{},(error,stdout,stderr)=>{
            if(error) return reject(error);
            VERBOSE && console.log('[DEBUG] '+stderr);
            if(stderr.indexOf('Command failed') > -1) return reject(new Error(stderr));
            resolve(stderr)
        });
    })
}

