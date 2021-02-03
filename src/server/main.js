import server from '@server';

import multiparty from '$lib/multiparty';
import {sendFile,errors,json} from '$lib/middlewares';

import common from '$EP/common';
import convert from '$EP/convert';
import unoconv from '$lib/unoconv';


unoconv.listener().catch(err=>{
  console.log('Cant start unoconv listener: '+err);
  process.exit(1);
});

const app = server({
    host: '0.0.0.0',
    port: 3000
});

app.use(multiparty);
app.use(sendFile);
app.use(errors);
app.use(json);
app.sub('/',common);
app.sub('/convert',convert);