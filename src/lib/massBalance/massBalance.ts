import Component from "./Component.js"

const rsh = new Component(86)
const water = new Component(18)
const naoh = new Component(40)
const rssr = new Component(170)
const nasr = new Component(108)
const oxygen = new Component(32)
const air = new Component(29)

// MAX PPM
const maxReentryMercaptide = 40 * 86 / 1000000 / 32
const maxReentryDisulphide = 120 * 170 / 1000000 / 32
const maxCatalyst = 450 / 1000000

// MIN PPM
const minCatalyst = 100 / 1000000



export default (iter: number) => {
    // INTO EXTRACTOR
    let rshMolInExtractor = rsh.molarFlowRate(254.8697)
    let waterMolInExtractor = water.molarFlowRate(824.941)
    let naohMolInExtractor = naoh.molarFlowRate(118.5440465)
    let rssrMolInExtractor = 0


    // INTO CAUSTIC SETTLER
    let rshMolInCausticSettler,
        rssrMolInCausticSettler,
        naohMolInCausticSettler

    // INTO OXIDISER
    let airMolInOxidiser = air.molarFlowRate(152.856),
        oxygenMolInOxidiser = oxygen.molarFlowRate(152.856 * 0.21),
        nasrMolInOxidiser,
        waterMolInOxidiser,
        rshMolInOxidiser,
        rssrMolInOxidiser

    // INTO DISULPHIDE SETTLER
    let airMolInDisulphideSettler,
        oxygenMolInDisulphideSettler,
        naohMolInDisulphideSettler,
        waterMolInDisulphideSettler,
        rssrMolInDisulphideSettler,
        rshMolInDisulphideSettler

    // INTO BUFFER TANK
    let rshMolInBufferTank,
        rssrMolInBufferTank,
        naohMolInBufferTank,
        waterMolInBufferTank


    // COMPONENTS AFTER EACH ITERATION
    let rshArr: {}[] = [],
        waterArr: {}[] = [],
        naohArr: {}[] = [],
        rssrArr: {}[] = [],
        airArr: {}[] = [],
        nasrArr: {}[] = [],
        catalystArr: {}[] = []

    let catalystAdded: number
    for (let i = 0; i < iter; i++) {
        let rshObj: any = {},
            waterObj: any = {},
            naohObj: any = {},
            rssrObj: any = {},
            airObj: any = {},
            nasrObj: any = {},
            catalystObj: any = {}

        // REACION INSIDE EXTRACTOR
        const extentExtractor = naohMolInExtractor * 0.996
        // extractor to caustic settler
        naohMolInCausticSettler = naohMolInExtractor - extentExtractor
        naohObj.inCausticSettler = naoh.massFlowRate(naohMolInCausticSettler)
        rshMolInCausticSettler = rshMolInExtractor - extentExtractor
        rshObj.inCausticSettler = rsh.massFlowRate(rshMolInCausticSettler)
        // extractor to oxidiser
        waterMolInOxidiser = waterMolInExtractor + extentExtractor
        waterObj.inOxidiser = water.massFlowRate(waterMolInOxidiser)
        nasrMolInOxidiser = extentExtractor
        nasrObj.inOxidiser = nasr.massFlowRate(nasrMolInOxidiser)
        airObj.inOxidiser = {
            oxygen: oxygen.massFlowRate(oxygenMolInOxidiser),
            total: air.massFlowRate(airMolInOxidiser),
        }
        // NEEDS TO BE STREAMLINED
        rshMolInOxidiser = 0
        rshObj.inOxidiser = rsh.massFlowRate(rshMolInOxidiser)
        rssrMolInOxidiser = rssrMolInExtractor
        rssrObj.inOxidiser = rssr.massFlowRate(rssrMolInExtractor)
        // CATALYST NOT ACCOUNTED FOR

        // REACTION INSIDE OXIDISER
        const extentOxidiser = nasrMolInOxidiser
        // oxidiser to disulphide settler
        oxygenMolInDisulphideSettler = oxygenMolInOxidiser - (extentOxidiser / 4)
        airMolInDisulphideSettler = airMolInOxidiser - (extentOxidiser / 4)
        airObj.inDisulphideSettler = {
            oxygen: oxygen.massFlowRate(oxygenMolInDisulphideSettler),
            total: air.massFlowRate(airMolInDisulphideSettler)
        }
        naohMolInDisulphideSettler = extentOxidiser
        naohObj.inDisulphideSettler = naoh.massFlowRate(naohMolInDisulphideSettler)
        waterMolInDisulphideSettler = waterMolInOxidiser - (extentOxidiser / 2)
        waterObj.inDisulphideSettler = water.massFlowRate(waterMolInDisulphideSettler)
        rssrMolInDisulphideSettler = extentOxidiser / 2
        rssrObj.inDisulphideSettler = rssr.massFlowRate(rssrMolInDisulphideSettler)
        // RSH AND CATALYST NOT ACCOUNTED FOR

        // SEPARATION INSIDE DISULPHIDE SEPARATOR
        // console.log("Air from separator to flare:", airMolInDisulphideSettler, "kmol / hr")
        // console.log("Of which", oxygenMolInDisulphideSettler, "kmol / hr is oxygen")
        // mixture to buffer tank

        let totalMassFlowRateToBufferTank

        waterMolInBufferTank = waterMolInDisulphideSettler
        waterObj.inBufferTank = water.massFlowRate(waterMolInBufferTank)
        naohMolInBufferTank = naohMolInDisulphideSettler
        naohObj.inBufferTank = naoh.massFlowRate(naohMolInBufferTank)

        if (i === 0) {
            totalMassFlowRateToBufferTank =
                (water.massFlowRate(waterMolInDisulphideSettler)
                    + naoh.massFlowRate(naohMolInDisulphideSettler))
                / (1 - maxReentryDisulphide - maxReentryMercaptide - maxCatalyst)

            catalystAdded = totalMassFlowRateToBufferTank * maxCatalyst

            catalystArr.push({
                mfr: catalystAdded,
                ppm: maxCatalyst * 1000000
            })

            rshMolInBufferTank = rsh.molarFlowRate(totalMassFlowRateToBufferTank * maxReentryMercaptide)
            rshObj.inBufferTank = rsh.massFlowRate(rshMolInBufferTank)
            rssrMolInBufferTank = rssr.molarFlowRate(totalMassFlowRateToBufferTank * maxReentryDisulphide)
            rssrObj.inBufferTank = rsh.massFlowRate(rssrMolInBufferTank)
        } else {
            totalMassFlowRateToBufferTank = water.massFlowRate(waterMolInBufferTank)
                + naoh.massFlowRate(naohMolInBufferTank) + catalystAdded
                + rsh.massFlowRate(rshMolInBufferTank) + rssr.massFlowRate(rssrMolInBufferTank)

            catalystArr.push({
                mfr: catalystAdded,
                ppm: catalystAdded * 1000000 / totalMassFlowRateToBufferTank
            })

            rshMolInBufferTank = rshMolInOxidiser
            rshObj.inBufferTank = rsh.massFlowRate(rshMolInBufferTank)

            rssrMolInBufferTank = rssrMolInOxidiser
            rssrObj.inBufferTank = rssr.massFlowRate(rssrMolInBufferTank)

        }

        const naohConcInBufferTank = naoh.massFlowRate(naohMolInDisulphideSettler) * 100 / totalMassFlowRateToBufferTank
        // console.log("Concentration of NaOH into buffer tank:", naohConcInBufferTank, "%")
        // console.log("Mass flow rate into buffer tank:", totalMassFlowRateToBufferTank, "kg / hr")
        // rssr to storage
        // console.log("RSSR to storage:", rssrMolInDisulphideSettler - rssrMolInBufferTank, "kmol / hr")

        // BUFFER TANK TO EXTRACTOR
        rshMolInExtractor += rshMolInBufferTank
        rshObj.inExtractor = rsh.massFlowRate(rshMolInExtractor)
        rssrMolInExtractor += rssrMolInBufferTank // this is unused further down the line
        rssrObj.inExtractor = rssr.massFlowRate(rssrMolInExtractor)

        waterMolInExtractor = waterMolInBufferTank
        waterObj.inExtractor = water.massFlowRate(waterMolInExtractor)
        naohMolInExtractor = naohMolInBufferTank
        naohObj.inExtractor = naoh.massFlowRate(naohMolInExtractor)

        rshArr.push(rshObj)
        waterArr.push(waterObj)
        naohArr.push(naohObj)
        rssrArr.push(rssrObj)
        airArr.push(airObj)
        nasrArr.push(nasrObj)

    }

    return {
        rshArr,
        waterArr,
        naohArr,
        rssrArr,
        airArr,
        nasrArr,
        catalystArr
    }
}

