<script>
    let list = [];
    async function getList(){
        let result = await fetch('/store/list');
        list = await result.json();
    }

    getList();

    function getSize(bytes){
        if(bytes < 1024) return bytes+' B'
        if(bytes < 1024*1024) return (bytes/1024).toFixed(2)+' KB'
        if(bytes < 1024*1024*1024) return (bytes/1024/1024).toFixed(2)+' MB'
        return (bytes/1024/1024/1024).toFixed(2)+' GB'
    }
</script>

{#if list} 
    {#if list.length}
    <table>
        <tr>
            <th width="110">Screenshot</th>
            <th>Filename</th>
            <th>Size</th>
        </tr>
        {#each list as line}
        <tr>
            <td>
                {#if line.screenshot}
                    <a href="/store/screenshot/{line.id}" target="_blank"><img class="thumb" src="/store/screenshot/{line.id}" alt="Screenshot" /></a>
                {:else}
                    <img class="thumb" src="/noscreenshot.png" alt="No Screenshot" />
                {/if}
            </td>
            <td><a href="/store/download/{line.id}" target="_blank">{line.name}</a></td>
            <td>{getSize(line.size)}</td>
        </tr>
        {/each}
    </table>
    {:else}
        <p class="text-center">No saved files</p>
    {/if}
    <hr/>
    <p class="text-center">
        <button on:click={getList}>Update</button>
    </p>
{/if}


<style>
    table{
        width: 100%;
        border-collapse: collapse;
    }

    td,th{
        border: 1px solid white;
        text-align: center;
        padding: 10px;
    }

    .thumb{
        max-width: 100px;
        max-height: 100px;
    }
</style>