import server from '@server';

import multiparty from './lib/multiparty';
import {sendFile,errors} from './lib/middlewares';

import convert from './endpoints/convert';
import unoconv from './lib/unoconv';


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
app.sub('/convert',convert);