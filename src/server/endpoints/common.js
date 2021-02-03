import unoconv from '$lib/unoconv';

export default function( app ){
    app.get('/formats',async (req,res,next)=>{
        const list = unoconv.getFormats();
        if(!list) return res.error('Service is not started yet. Please retry later.');
        res.json(list);
    });
}