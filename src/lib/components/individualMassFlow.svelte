<script lang="ts">
    import { onMount } from "svelte";
    import DownloadChart from "./downloadChart.svelte";
    export let data: any[];
    export let iterations: number;

    let chart: any;
    let imgBase64: string;

    function generateRandomString(length: number) {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }

        return result;
    }

    const randomString = generateRandomString(10); // Generates a random string with 10 characters

    $: {
        if (data.length) {
            const ctx = document.getElementById(randomString);
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
    <canvas id={randomString} />
</div>

<style>
    div {
        margin: 5rem auto;
        width: 80%;
    }
</style>
