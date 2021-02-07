<script>
    let list = [];
    async function getList(){
        let result = await fetch('/store/list');
        list = await result.json();
    }

    export const update = ()=>getList();
    getList();

    function getSize(bytes){
        if(bytes < 1024) return bytes+' B'
        if(bytes < 1024*1024) return (bytes/1024).toFixed(2)+' KB'
        if(bytes < 1024*1024*1024) return (bytes/1024/1024).toFixed(2)+' MB'
        return (bytes/1024/1024/1024).toFixed(2)+' GB'
    }
</script>

{#if list.length}
    <hr/>
    <h3>Saved documents</h3>
    <p></p>
    <table>
        <tr>
            <th>Filename</th>
            <th>Size</th>
        </tr>
        {#each list as line}
        <tr>
            <td>{line.name}</td>
            <td>{getSize(line.size)}</td>
        </tr>
        {/each}
    </table>
{/if}


<style>
    table{
        width: 100%;
        border-collapse: collapse;
    }

    td,th{
        border: 1px solid white;
    }
</style>