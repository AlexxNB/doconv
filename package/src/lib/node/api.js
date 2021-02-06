import FormData from 'form-data';

export default function(apiURL){
    return {
        get: async (endpoint)=>request(apiURL+endpoint,'GET'),
        post: async (endpoint,data={})=>request(apiURL+endpoint,'POST',data)
    }
}

function post(endpoint,data){
    return new Promise((resolve,reject)=>{
        const formData = new FormData();
        
        for(let field in data){
            formData.append(field,data[field])
        }

        formData.submit(endpoint,async (err,res)=>{
            console.log(arguments);
            if(err) return reject(err);
            
        })
    })
}

function bodyParser(responce){
    const mime = res.headers['Content-Type'];
    const isfile = res.headers['Content-Disposition'];
   
    let body = "";
    res.on('data', function(chunk) {
        return data += chunk;
    });
    res.on('end', function() {
        return loadFile(data);
    });
    res.on('error', function(err) {
        console.log("Error during HTTP request");
        console.log(err.message);
    });
}


