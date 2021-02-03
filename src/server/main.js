import server from '@server';

import multiparty from '$lib/multiparty';
import middlewares from '$lib/middlewares';
import unoconv from '$lib/unoconv';

import common from '$EP/common';
import convert from '$EP/convert';


unoconv.init().then(_=>{

  const app = server({
      host: '0.0.0.0',
      port: 3000
  });
  
  app.use(multiparty);
  app.use(...middlewares);

  common(app);
  app.sub('/convert',convert);

}).catch(err=>{
  console.log(err);
  process.exit(1);
});

