<script>
    import doconv from 'doconv/browser';
    import {router} from 'tinro';
    const dc = doconv();

    let files;
    let error = null;
    let format='pdf';

    let action = 'download';


    function doConvert(){
        error = null;
        if(action === 'download'){
            dc.convert({
                file: files[0],
                format
            }).then( result => {
                result.download();
            }).catch(err => error=err);
        }else{
            dc.convert({
                file: files[0],
                format,
                hook:'http://localhost:3000/store/save',
                context:{foo:'bar'}
            }).then( result => {
                setTimeout(()=>router.goto('/saved'),1000);
            }).catch(err => error=err);
        }
       
    }
</script>

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
<h4>3. Download or save result</h4>
<input type="radio" bind:group={action} value="download"/> - download<br/>
<input type="radio" bind:group={action} value="save"/> - save
<hr/>
    {#if error}
        <div class="error">{error}</div>
        <hr/>
    {/if}
    <p class="text-center">
        <button disabled={files===undefined} on:click={doConvert}>Convert file</button>
    </p>
{/await}


