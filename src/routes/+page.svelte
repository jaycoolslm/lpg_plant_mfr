<script lang="ts">
    import massBalance from "../lib/massBalance/massBalance";
    import { El, Input, Button } from "@ubeac/svelte";
    import NaohConc from "$lib/components/naohConc.svelte";
    import IndividualMassFlow from "$lib/components/individualMassFlow.svelte";
    import CatalystConc from "$lib/components/catalystConc.svelte";
    import {
        handleIndividualMassFlow,
        handleNaohConc,
        handleCatalystConc,
    } from "./functions";

    let iterations: number = 5;

    let naohConc: number[] = [];
    let catalystConc: number[] = [];
    let individualMassFlow: {
        label: string;
        data: number[];
        borderWidth: number;
    }[] = [];

    const iterate = () => {
        // console.clear();
        iterations = Number(iterations);
        const values = massBalance(iterations);

        naohConc = handleNaohConc(values, iterations);
        catalystConc = handleCatalystConc(values);
        individualMassFlow = handleIndividualMassFlow(values, iterations);
        console.log(individualMassFlow);
    };
</script>

<El container>
    <El row>
        <El
            col
            tag="h1"
            class="text-center py-4"
            bgColor="primary"
            textColor="light"
        >
            Engineers 18
        </El>
    </El>

    <El row class="px-2">
        <El col tag="h2" class="text-center my-3"
            >Design for an LPG mercaptans removal unit</El
        >
    </El>

    <El row class="px-2 justify-content-center gap-3">
        <El colSm="10" colMd="4" colLg="3">
            <Input
                bind:value={iterations}
                placeholder="Enter number of iterations"
                type="number"
            />
        </El>
        <El colSm="10" colMd="4" colLg="3">
            <Button on:click={iterate} color="primary" class="w-100"
                >Calculate</Button
            >
        </El>
    </El>

    <NaohConc data={naohConc} />
    <CatalystConc data={catalystConc} />
    <IndividualMassFlow data={individualMassFlow} {iterations} />
</El>
