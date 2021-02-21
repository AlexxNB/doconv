<script>
    import {Route,router,active} from 'tinro';
    import File from './File';
    import Markup from './Markup';
    import List from './List';
    router.mode.memory();
</script>
<div class="wrapper">
    <div class="card">
        <div class="top">
            <div class="logo">
                <h1>Doconv</h1>
                <p>Docker Document Converter</p>
            </div>
            <div class="menu">
                <a href="/file" use:active>Convert file</a>
                <a href="/markup" use:active>Convert markup</a>
                <a href="/saved" use:active>Saved files</a>
            </div>
        </div>
        <hr/>
        <div class="content">
            <Route path="/" redirect="/file"/>
            <Route path="/file"><File/></Route>
            <Route path="/markup"><Markup/></Route>
            <Route path="/saved"><List/></Route>
        </div>
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
        padding: 20px 30px;
        border-radius: 15px;
        margin: 50px;
        min-width: 650px;
    }
    .top{
        display:flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
    }

    .logo h1{
        margin: 0px;
        padding: 0px;
    }

    .logo p{
        margin: 0px;
        padding: 0px;
        font-size: .8em;
        color: #818181;
    }

    .menu a{
        display: block;
        color:#dd9300;
    }

    .menu a:hover{
        text-decoration: none;
        color:#b97c02;
    }

    .menu :global(a.active){
        color: #ffd47e;
    }

    .content{
        padding: 0px 20px;
    }
</style>

