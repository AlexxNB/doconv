import fs from 'fs';

export async function isDirectory(filepath){
    return !/\.\w+$/.test(filepath)
}