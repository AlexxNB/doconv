<script>
    import {init,exec} from 'pell';
    import "pell/dist/pell.css";

    export let value = '';

    const pagebreak = '<!--PAGEBREAK-->';
    const pagebreakHR = '<hr id="pagebreak">';

    function pbToHR(str){
        return str.replace(new RegExp(pagebreak, "g"),pagebreakHR);
    }
    function hrToPB(str){
        return str.replace(new RegExp(pagebreakHR, "g"),pagebreak);
    }

    function initPell(el){
        init({
            element: el,
            onChange: html => value = hrToPB(html),
            defaultParagraphSeparator: 'p',
            actions: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'heading1',
                'heading2',
                'quote',
                'olist',
                'ulist',
                'line',
                'image',
                {
                    name: 'pagebreak',
                    icon: '---',
                    title: 'Page Break',
                    result: () => exec('insertHTML',pagebreakHR+'\n')
                },
            ]
        }).content.innerHTML = pbToHR(value);
    }
</script>

<div use:initPell />

<style>
    div{
        background-color: white;
        color: black;
        margin:0px;
        padding: 0px;
    }

    div :global(hr){
        margin: 0px;
    }

    div :global(#pagebreak){
        border:none; 
        border-top: 1px dashed grey
    }
</style>