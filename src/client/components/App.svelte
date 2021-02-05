<script>
    import doconvert from 'doconvert/browser';
    const dc = doconvert();

    let files;
    let error = null;
    let format='pdf';


    function doConvert(){
        error = null;
        dc.convert({
            file: files[0],
            format
        }).then( result => {
            result.download();
        }).catch(err => error=err);
    }
</script>

<div class="card">
    <h1>doconv</h1>
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
    <h4>3. Download converted file</h4>
        {#if error}
            <div class="error">{error}</div>
        {/if}
        <p><input type='submit' value='Convert!' disabled={files===undefined} on:click={doConvert}/></p>
    {/await}
</div>


<style>
    .card{
        background-color: #484848;
        padding: 10px 80px;
        border-radius: 15px;
        margin: auto auto;
        position: absolute;              
        top: 50%;                        
        left: 50%;                      
        transform: translate(-50%, -50%);
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

