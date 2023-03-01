export const handleNaohConc = (values: any, iterations: number): number[] => {
    let naohInBuffer: number[] = new Array(iterations).fill(0);
    let flowRateInBuffer: number[] = new Array(iterations).fill(0);

    Object.entries(values).forEach(([key, value]: any) => {
        if (value.some((e: any) => e.inBufferTank)) {
            value.forEach((v: any, index: number) => {
                flowRateInBuffer[index] += v.inBufferTank;
            });
        }
        if (key === "naohArr") {
            value.forEach((v: any, index: number) => {
                naohInBuffer[index] += v.inBufferTank;
            });
        }
    });
    let naohConc: number[] = []
    for (let i = 0; i < iterations; i++) {
        naohConc.push((naohInBuffer[i] * 100) / flowRateInBuffer[i])
    }
    return naohConc;
}

export const handleCatalystConc = (values: any): number[] => {
    const catalystConc = values.catalystArr.map((e: any) => e.ppm);
    return catalystConc;
}


type MassFlow = {
    label: string;
    data: number[];
    borderWidth: number;

}[]

export const handleIndividualMassFlow = (values: any, iterations: number): MassFlow => {
    let massFlow: MassFlow = [];
    Object.entries(values).forEach(([key, value]: any) => {
        if (value.some((e: any) => e.inBufferTank)) {
            let massFlowObj: any = {
                label: key + " into buffer tank / kg h-1",
                data: new Array(iterations).fill(0),
                borderWidth: 1,
            };
            value.forEach((v: any, index: number) => {
                massFlowObj.data[index] = v.inBufferTank;
            });
            massFlow.push(massFlowObj);
        }
    });
    return massFlow;
}