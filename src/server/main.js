import server from '@server';

import multiparty from '$lib/multiparty';
import {json} from 'body-parser';
import middlewares from '$lib/middlewares';
import unoconv from '$lib/unoconv';

import common from '$EP/common';
import convert from '$EP/convert';
import markup from '$EP/markup';
import store from '$EP/store';


unoconv.init().then(_=>{

  const app = server({
      host: '0.0.0.0',
      port: 3000
  });
  
  app.use(...middlewares);
  app.sub('/store',store);
  
  app.use(json());
  app.use(multiparty);



  common(app);
  app.sub('/convert',convert);
  app.sub('/markup',markup);


}).catch(err=>{
  console.log(err);
  process.exit(1);
});

