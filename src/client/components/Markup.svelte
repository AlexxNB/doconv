<script>
    import doconv from 'doconv/browser';
    import {router} from 'tinro';
    import Pell from './Pell.svelte';
    const dc = doconv();

    const sizes = {
        'A4':[210,297],
        'A5':[148,210]
    }

    let body = `<h1>Document header</h1><p>Page1</p><!--PAGEBREAK--><p>Page2</p>`
    let error = null;
    let format='pdf';
    let action = 'download';

    let size = 'A4';
    let portrait = true;

    function doGenerate(){
        error = null;
        let width = portrait ? sizes[size][0] : sizes[size][1];
        let height = portrait ? sizes[size][1] : sizes[size][0];
        if(action === 'download'){
            dc.markup({
                body,
                format,
                pageWidth: width,
                pageHeight: height
            }).then( result => {
                result.download();
            }).catch(err => error=err);
        }else{
            dc.markup({
                body,
                format,
                pageWidth: width,
                pageHeight: height,
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
<h4>1. Write markup</h4>
    <Pell bind:value={body}/>
<h4>2. Choose format</h4>
    <select bind:value={format}>
        {#each list as item}
        <option value={item.format}>*.{item.ext} - {item.description}</option>
        {/each}
    </select>
<h4>3. Page layout</h4>
    <select bind:value={size}>
        {#each Object.keys(sizes) as s}
        <option value={s}>{s}</option>
        {/each}
    </select>
    <select bind:value={portrait}>
        <option value={true}>Portrait</option>
        <option value={false}>Landscape</option>
    </select>
<h4>4. Download or save result</h4>
<input type="radio" bind:group={action} value="download"/> - download<br/>
<input type="radio" bind:group={action} value="save"/> - save
<hr/>
    {#if error}
        <div class="error">{error}</div>
        <hr/>
    {/if}
    <p class="text-center">
        <button on:click={doGenerate}>Generate file</button>
    </p>
{/await}


