import unoconv from '@s/lib/unoconv';
import unococnv from '@s/lib/unoconv';
import { replaceExtension } from '@s/lib/utils';

export default function( app ){
    app.post('/:format',async (req,res,next)=>{

        const input = req.files.file[0];
        const format = req.params.format;

        console.log(input)

        unoconv.verbose();
        unococnv.convert(input.path,'pdf')
            .then( async result => {
                console.log(replaceExtension(input.originalFilename,result.meta.ext));
                res.sendFile((await result.read()),replaceExtension(input.originalFilename,result.meta.ext),result.meta.mime);
            })
            .catch( err => {
                res.error(err.message)
            })
    });
}