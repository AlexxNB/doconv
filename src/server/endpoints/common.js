import unoconv from '$lib/unoconv';

export default function( app ){
    app.post('/formats',async (req,res,next)=>{
        const list = unoconv.getFormats();
        if(list.length == 0) return res.error('Service is not started yet. Please retry later.');
        res.json(list);
    });
}