<script lang="ts">
    import { Button, Icon } from "@ubeac/svelte";

    export let imgBase64: string;

    const download = () => {
        var a = document.createElement("a");
        a.href = imgBase64;
        a.download = "chart.png";
        a.click();
    };
</script>

<Button on:click={download}><Icon name="download" /></Button>
