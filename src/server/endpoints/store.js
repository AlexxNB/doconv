import {parseHook} from 'doconv';

export default function( app ){
    app.post('/save',async (req,res,next)=>{

        console.log((await parseHook(req)));
        res.end('OK');
    });
}