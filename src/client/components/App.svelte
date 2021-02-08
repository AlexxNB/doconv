<script>
    import doconv from 'doconv/browser';
    import List from './List';
    const dc = doconv();

    let files;
    let error = null;
    let format='pdf';

    let debug = false;


    function doConvert(){
        error = null;
        dc.convert({
            file: files[0],
            format
        }).then( result => {
            result.download();
        }).catch(err => error=err);
    }

    function doSave(){
        error = null;
        dc.convert({
            file: files[0],
            format,
            hook:'http://localhost:3000/store/save',
            context:{foo:'bar'}
        }).then( result => {
            // todo something
        }).catch(err => error=err);
    }

    window.addEventListener('keydown',(e)=>{
        if(e.keyCode == 68) debug = !debug;
    })
</script>
<div class="wrapper">
    <div class="card">
        <h1>Doconv</h1>
        <p>Docker Document Converter</p>

        
        {#await dc.formats()}
            Loading...
        {:then list}
        <h4>1. Choose document</h4>
            <input type="file" bind:files/>
        <h4>2. Choose new format</h4>
            <select bind:value={format}>
                {#each list as item}
                <option value={item.format}>*.{item.ext} - {item.description}</option>
                {/each}
            </select>
        <h4>3. Download or save converted file</h4>
            {#if error}
                <div class="error">{error}</div>
            {/if}
            <p>
                <input type='submit' value='Convert & download!' disabled={files===undefined} on:click={doConvert}/>
                {#if debug}<input type='submit' value='Convert & save!' disabled={files===undefined} on:click={doSave}/>{/if}
            </p>
        {/await}
        {#if debug}<List/>{/if}
    </div>
</div>


<style>
    .wrapper{
        width:100%;
        min-height: 100%;
        display: flex;
        justify-content: center; 
        align-items: center;  
    }
    .card{
        background-color: #484848;
        padding: 10px 80px;
        border-radius: 15px;
        margin: 50px;
    }

    .error{
        background-color:#313131;
        padding:10px;
        border-radius: 10px;
        color: #d32828;
    }

    h1,p{
        text-align: center;
    }
</style>

