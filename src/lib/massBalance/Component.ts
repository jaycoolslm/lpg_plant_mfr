export default class {
    mr: number
    constructor(mr: number) {
        this.mr = mr;
    }

    returnMr() {
        return this.mr;
    }

    molarFlowRate(massFlowRate: number) {
        return massFlowRate / this.mr;
    }

    massFlowRate(molarFlowRate: number) {
        return molarFlowRate * this.mr;
    }

}