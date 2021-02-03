import unoconv from '$lib/unoconv';
import { replaceExtension } from '$lib/utils';

export default function( app ){
    app.post('/:format',async (req,res,next)=>{

        const input = req.files.file[0];
        const format = req.params.format;

        unoconv.convert(input.path,format)
            .then( async result => {
                console.log('Convert: '+input.originalFilename,'->',replaceExtension(input.originalFilename,result.meta.ext));
                res.sendFile((await result.read()),replaceExtension(input.originalFilename,result.meta.ext),result.meta.mime);
            })
            .catch( err => {
                res.error(err.message)
            })
    });
}