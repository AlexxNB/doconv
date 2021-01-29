const { build } = require("esbuild");
const { spawn,execSync } = require("child_process");
const watch = require("node-watch");

const DEV = process.argv.includes('--dev');

build({
    entryPoints: ['src/main.js'],
    bundle: true,
    outfile: 'dist/app.js',
    platform: 'node',
    sourcemap: DEV && 'inline',
    minify: !DEV,
    incremental: DEV
}).then( bundle => {
    if(DEV){
        startDevContainer().then( container =>{
            watch('src',{recursive:true},()=>{
                bundle.rebuild().then( _ => {
                    container.restart()
                })
            })
        });  
    }
})


function startDevContainer(){
    return new Promise(resolve => {
        let container;

        const stop = ()=>{
            
            container && container.kill();
            execSync('docker stop document-converter-dev');
        }

        const start = ()=>{

            execSync('docker rm --force document-converter-dev');
            execSync('docker run -d -v \"$(pwd)/dist:/app\" -p 8000:8000 --name document-converter-dev docker-document-converter:latest');
    
            container = spawn('docker', ['attach', 'document-converter-dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('SIGINT', ()=>{
                console.log('\nStopping container... Please wait!');
                stop();
            });
            process.on('SIGTERM', stop);
            process.on('exit', stop);
        }
       
        console.log('Starting container...');
        start();

        resolve({
            stop: ()=>new Promise(r => {
                console.log('Stopping container... Please wait!');
                stop();
                console.log('Container stopped!');
                r(true);
            }),
            restart: ()=>new Promise(r => {
                console.log('Restarting container... Please wait!');
                stop();
                start();
                console.log('Container restarted!');
                r(true);
            }),
        });
    });
}