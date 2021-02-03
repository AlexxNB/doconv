import unoconv from '$lib/unoconv';
import { replaceExtension } from '$lib/utils';

export default function( app ){
    app.post('/:format',async (req,res,next)=>{

        const input = req.files.file[0];
        const format = req.params.format;

        unoconv.convert(input.path,format)
            .then( async result => {
                const filename = replaceExtension(input.originalFilename,result.meta.ext);
                console.log('Convert: '+input.originalFilename,'->',filename);
                res.sendFile((await result.read()),filename,result.meta.mime);
            })
            .catch( err => {
                res.error(err.message)
            })
    });
}