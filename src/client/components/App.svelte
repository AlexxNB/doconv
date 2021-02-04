<script>
  import api from '@lib/api';

</script>

{#await api.get('/formats')}
  Loading...
{:then list}
    <div>
        <input type="file" name="file" />
        <input type='submit' value='Convert!' />
    </div>
{/await}

<style>

</style>

