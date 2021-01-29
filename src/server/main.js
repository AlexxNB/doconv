import server from '@server';

// @server is preconfigured instance of the Derver server
// https://github.com/alexxnb/derver

// Derver configuration parameters
const app = server({
    host: '0.0.0.0',
    port: 3000
});


// Add middlewares. See Derver readme for more info.
app.use('/hello/:name',(req,resp,next)=>{
    resp.send('Hello, '+req.params.name);
})

const unoconv = require("unoconv-promise");
 
unoconv
  .formats()
  .then(formats => {
    // formats will be an array contains supports formats
    formats.forEach(format => {
      console.log(format);
    });
  })
  .catch(e => {
    throw e;
  });