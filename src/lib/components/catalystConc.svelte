<script lang="ts">
    import { onMount } from "svelte";
    import DownloadChart from "./downloadChart.svelte";

    export let data: any[];

    let chart: any;
    let imgBase64: string;

    $: {
        if (data.length) {
            const ctx = document.getElementById("catalystConc");
            if (chart) chart.destroy();
            // @ts-ignore
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((_, i) => `Iteration ${i + 1}`),
                    datasets: [
                        {
                            label: "Concentration of catalyst in Buffer Tank / ppm",
                            data,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    animation: {
                        onComplete: function () {
                            imgBase64 = chart.toBase64Image();
                        },
                    },
                },
            });
        }
    }

    onMount(() => {});
</script>

<div>
    {#if imgBase64}
        <DownloadChart {imgBase64} />
    {/if}
    <canvas id="catalystConc" />
</div>

<style>
    div {
        margin: 5rem auto;
        width: 80%;
    }
</style>
