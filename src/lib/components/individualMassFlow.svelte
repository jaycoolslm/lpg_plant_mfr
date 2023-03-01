<script lang="ts">
    import { onMount } from "svelte";
    import DownloadChart from "./downloadChart.svelte";
    export let data: any[];
    export let iterations: number;

    let chart: any;
    let imgBase64: string;

    $: {
        if (data.length) {
            const ctx = document.getElementById("individualMassFlow");
            if (chart) chart.destroy();
            // @ts-ignore
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: Array(iterations)
                        .fill(0)
                        .map((_, i) => `Iteration ${i + 1}`),
                    datasets: data,
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
    <canvas id="individualMassFlow" />
</div>

<style>
    div {
        margin: 5rem auto;
        width: 80%;
    }
</style>
