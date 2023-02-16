/**
 * Contains most things related to the input parameters. 
 * 
 * To add a new parameter add to the Parameters and DefualtParametersValue. 
 * Note: Make sure you hide the yAxisID in the chart.vue file. (Just Copy-paste from the existing and change id)
 */

var Parameters = {
    /**
     * List of Parameters and their corresponding information
    */
    Parameters: {
        Meals: {Name: "Meals", Unit: "Carbohydrates [g]", Type: "External factors", Duration: false, Insulin: false, predefinedDose: [], axisID:"y1", color:"#ff6666"},
        PA: {Name: "Physical Activity", Unit: "Heart Beat Increase [BPM]", Type: "External factors", Duration: true, Insulin: false, predefinedDose: [], axisID:"y2", color:"#66ff66"},
        Stress: {Name: "Stress", Unit: "Level [%]", Type: "External factors", Duration: true, Insulin: false, predefinedDose: [], axisID:"y3", color:"#ff66f"},
        Metformin: {Name: "Metformin", Unit: "Size [mg]", Type: "Treatment", Duration: false, Insulin: false, predefinedDose: ['500', '1000', '1500', '2000'], axisID:"y4", color:"#6666ff"},
        GLP: {Name: "GLP-1 agonists", Unit: "Size", Type: "Treatment", Duration: false, Insulin: false, predefinedDose: [{'Daily GLP-1': ['5', '10'], 'Weekly GLP-1': ['0.25', '0.5', '1']},], axisID:"y7", color:"#ffb366"},
        LAI: {Name: "Long Acting Insulin", Unit: "Size [U]", Type: "Treatment", Duration: false, Insulin: true, predefinedDose: [], axisID:"y5", color:"#ffff66"},
        FAI: {Name: "Fast Acting Insulin", Unit: "Size [U]", Type: "Treatment", Duration: false, Insulin: true, predefinedDose: [], axisID:"y6", color:"#66ffff"},
        // DPP: {Name: "DPP-4", Unit: "Size [mg]", Type: "Treatment", Duration: false, Insulin: false, predefinedDose: ['50', '100', '150', '200'], axisID:"y8", color:"#66ffa8"},
    },
    defaultParameterValues: {
        Meals: {time: 0, value:0, type:'Medium'},
        PA: {startTime:0, endTime:1, value:0},
        Stress: {startTime:0, endTime:1, value:0},
        Metformin: {time:0, value:0},
        LAI: {time:0, value:0},
        FAI: {time:0, value:0},
        GLP: {time:0, value:0, type:'Weekly GLP-1'},
        DPP: {time:0, value:0},
    },
    Types: ["External factors", "Treatment"],
    ParameterTypes: {
        Meals: ['Very high (100)', 'High (approximately 80)', 'Medium (approximately 60)', 'Low (approximately 40)', 'Very low (approximately 20)'],
        GLP: ['Daily GLP-1','Weekly GLP-1'],
    },
    TypeNames: {
        Meals: 'Glycimic index',
        GLP: 'Type'
    },
    InsulinTypes: {
        LAI: ['Long Acting','Very Long Acting'],
        FAI: ['Very Fast Acting', 'Fast Acting'],
    },
    /**
     * Adds a new element to the selected parameter
     * @param {{type:string}} par Parameters from the event
     * @param {Object} patient Patient Object
     */
    add(par, patient){
        // Gets the current items
        var items = patient[par.type];
        // Adds the new item from the default values and a unique id
        patient[par.type] = [...items, {id:this.generateUniqueID(items), ...this.defaultParameterValues[par.type] }];
    },
    /**
    * Generates a unique ID for a new element. 
    * Takes the ID of the last element and adds one.
    * @param {Array} items 
    */
    generateUniqueID(items){
        var newID;
        try {
            newID = items[items.length-1].id + 1
        } catch (error) {
            //console.log(error)
            newID = 1
        }
        return newID;
    },
    /**
     * Delete the parameter with the given type and ID
     * @param {{type:String, id:String}} par Parameters from the event
     * @param {Object} patient Patient Object
     */
    delete(par, patient){
        patient[par.type] = patient[par.type].filter((item)=> item.id !== par.id);
    },
      /**
     * Updates the value of the element
     * @param {{id: String, valType:String, value:String}} par Parameters from the event
     * @param {Object} patient Patient Object
     */
    updateValue(par, patient){
        if(par.valType == 'number'){
            patient[par.type] = patient[par.type].map((item)=>item.id === par.id ? {...item, value: parseFloat(par.val)}: item)
        }else if(par.valType == 'time'){
            patient[par.type] = patient[par.type].map((item)=>item.id === par.id ? {...item, time: par.val}: item)
        }else if(par.valType == 'startTime'){
            patient[par.type] = patient[par.type].map((item)=>item.id === par.id ? {...item, startTime: par.val}: item)
        }else if(par.valType == 'endTime'){
            patient[par.type] = patient[par.type].map((item)=>item.id === par.id ? {...item, endTime: par.val}: item)
        }else if(par.valType == 'type'){
            patient[par.type] = patient[par.type].map((item)=>item.id === par.id ? {...item, type: par.val}: item)
        }
    },
    /**
     * Updates the repeat of the given parameter
     * @param {{index: String, val:String}} par Parameters from the event
     * @param {Object} simPar The simpar Object
     */
    updateRepeat(par, simPar){
        simPar.repeat[par.index] = par.val;
    },
    /**
     * Updates the selected insulin type
     * @param {{type: String, val:String}} par Parameters from the event
     * @param {Object} simPar The simpar object
     * @param {Object} sim The sim object
     */
    updateInsulin(par, simPar, sim){        
        if (par.type=='Long'){
            simPar.selectedInsulin.LAI = par.val;
            if (simPar.selectedInsulin.LAI=='Long Acting'){
                sim.Params.pla=0.014023809879501; sim.Params.rla=0.005642135109700; sim.Params.qla=0.007287049037943;
                sim.Params.bla=0.088371175275079;
                sim.Params.Cmax=15; sim.Params.kla=0.033904763958221; sim.Params.kcll =0.005347967285141;
            }else if (simPar.selectedInsulin.LAI=='Very Long Acting'){
                sim.Params.pla=0.013691570387547; sim.Params.rla=0.085809546448744; sim.Params.qla=0.015050127414793;
                sim.Params.bla=0.035660745579443;
                sim.Params.Cmax=15; sim.Params.kla=0.026892564613936; sim.Params.kcll =0.040585233868227;
            }
        }else if (par.type=='Fast'){
            simPar.selectedInsulin.FAI = par.val;
            if (simPar.selectedInsulin.FAI=='Very Fast Acting'){
                sim.Params.pfa=0.033304427073854;
                sim.Params.rfa=0.192838157600319;
                sim.Params.qfa=-0.000000009999983;
                sim.Params.bfa=0.350073112766538;
                sim.Params.kclf = 0.031321989850181;
                sim.Params.sfa = 1;
            }else if (simPar.selectedInsulin.FAI=='Fast Acting'){
                sim.Params.pfa=0.007515131220953; sim.Params.rfa=0.006284304511320; sim.Params.qfa=0.029902465151402;
                sim.Params.bfa=0.402665052055251; sim.Params.kclf = 0.017217088399008;
                sim.Params.sfa = 2; 
            }
        }
    },
    /**
     * Updates the physiological parameters when slider changes
     * @param {{type: String, val:String}} par Parameters of the event
     * @param {Object} patient The patien object
     * @param {Object} sim The sim object
     */
    updateSlider(par, patient, sim){
        if(par.type === "sens") {
            patient.ins_sens = parseFloat(par.val) ;
            // console.log(patient.ins_sens,sim.Params.SPGU)
            sim.Params.SPGU=patient.ins_sens;
          }else if (par.type == "secr"){
            patient.ins_secr = parseFloat(par.val)
            sim.Params.Sfactor = (1+patient.ins_secr/100);
          }else if(par.type == "prod"){
            patient.glu_prod = parseFloat(par.val)
            let alpha=patient.glu_prod/100;
            sim.Params.c3=(1+alpha)*sim.defaultParams.c3;
            sim.Params.c5=(1+alpha)*sim.defaultParams.c5;
          } else if(par.type == "upta"){
            patient.glu_upta = parseFloat(par.val)
            let alpha=patient.glu_upta/100;
    
            sim.Basal.rBGU = sim.defaultBasal.rBGU + alpha*sim.defaultBasal.rBGU;
            sim.Basal.rGGU = sim.defaultBasal.rGGU + alpha*sim.defaultBasal.rGGU;
            sim.Basal.rHGU = sim.defaultBasal.rHGU + alpha*sim.defaultBasal.rHGU;
            sim.Basal.rPGU = sim.defaultBasal.rPGU + alpha*sim.defaultBasal.rPGU;
            sim.Basal.rRBCU = sim.defaultBasal.rRBCU + alpha*sim.defaultBasal.rRBCU;
          }
    }
}
export default Parameters