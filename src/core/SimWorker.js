import Sim from "./Sim.js";

self.addEventListener('message', e => {
    let newSim= new Sim();
    newSim.Params=e.data[0].Params;
    newSim.Basal=e.data[0].Basal;
    let simPar = e.data[1];
    newSim.setBasaldefGCPFIPF(simPar.initCond.GBPC0,simPar.initCond.IBPF0)
    newSim.Simulate(simPar);

    self.postMessage("Finished")

    self.close();
})

