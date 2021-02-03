<script>
  import api from '@lib/api';

</script>

{#await api.get('/formats')}
  Loading...
{:then list}
  {JSON.stringify(list)}
{/await}


<form ref='uploadForm' 
      id='uploadForm' 
      action='/convert/pdf' 
      method='post' 
      encType="multipart/form-data">
        <input type="file" name="file" />
        <input type='submit' value='Convert!' />
</form>