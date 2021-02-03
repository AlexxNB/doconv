import multiparty from 'multiparty';

export default function(req,res,next){
    const form = new multiparty.Form();
 
    form.parse(req, function(err, fields, files) {
        req.fields = fields;
        req.files = files;
        next();
    });
}