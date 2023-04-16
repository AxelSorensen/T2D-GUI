import Sim from './Sim.js'
var TunedPatients = {
    patient_default(patient, simPar, sim) {
        /*
        app.InsulinSensitivitySlider.Value=3;
        app.GlucoseproductionrateSlider.Value=0;
        app.GlucoseuptakerateSlider.Value=0;
        app.InsulinSecretionrateSlider.Value=0;
        app.InsulinSensitivitySpinner.Value=3;
        app.GlucoseproductionrateSpinner.Value=0;
        app.GlucoseuptakerateSpinner.Value=0;
        app.InsulinSecretionrateSpinner.Value=0;
        app.defaultPatient=T2Dp;
        
        
        app.p.Param.k12=0.375*0.08;
        app.defaultPatient.Param.k12=app.p.Param.k12;
        app.p.Param.kabs=0.375*0.08;
        app.defaultPatient.Param.kabs=app.p.Param.kabs;
        app.p.GBPC0=14/0.055;
        app.defaultPatient.GBPC0=app.p.GBPC0;
        app.p.IBPF0=0.5;
        app.defaultPatient.IBPF0=app.p.IBPF0;
        */

        patient.Meals = [
            {
                id: 1,
                time: 7*60,
                value: 50,
                type: 'High (approximately 80)'
            },
            {
                id: 2,
                time: 12*60,
                value: 50,
                type: 'Medium (approximately 60)'
            },
            {
                id: 3,
                time: 18*60,
                value: 100,
                type: 'Medium (approximately 60)'
            },
        ];
        simPar.repeat.Meals = "daily";
        simPar.time = 1;
        patient.PA = [];
        patient.Stress = [];
        patient.Metformin = [];
        patient.LAI = [];
        patient.FAI = [];
        patient.GLP = [];
        patient.DPP = [];
        // this.clearResponses();

        let default_patient = new Sim();
        sim.Params = default_patient.defaultParams;
        sim.Basal = default_patient.defaultBasal;

        simPar.initCond.GBPC0 = 10;
        simPar.initCond.IBPF0 = 1;


        // this.updateValueSlider({ type: "sens", val: 3 }) // 
        patient.ins_sens=1;
        // this.updateValueSlider({ type: "secr", val: 0 }) // 
        patient.ins_secr=0;
        // this.updateValueSlider({ type: "prod", val: 0 }) // 
        patient.glu_prod=0;
        // this.updateValueSlider({ type: "upta", val: 0 }) // 
        patient.glu_upta=0;     

        return [patient,sim]
    },
    patient1(patient, simPar, sim) {
        /*
        app.p = T2Dp([], [], [], [], app.p.Nd, []);

        app.InsulinSensitivitySlider.Value = 1;
        app.GlucoseproductionrateSlider.Value = 0;
        app.GlucoseuptakerateSlider.Value = 0;
        app.InsulinSecretionrateSlider.Value = 0;
        app.InsulinSensitivitySpinner.Value = 1;
        app.GlucoseproductionrateSpinner.Value = 0;
        app.GlucoseuptakerateSpinner.Value = 0;
        app.InsulinSecretionrateSpinner.Value = 0;
        app.defaultPatient = T2Dp;


        app.p.Param.k12 = 0.5 * 0.08;
        app.defaultPatient.Param.k12 = app.p.Param.k12;
        app.p.Param.kabs = 0.5 * 0.08;
        app.defaultPatient.Param.kabs = app.p.Param.kabs;
        app.p.GBPC0 = 9.5 / 0.055;
        app.defaultPatient.GBPC0 = app.p.GBPC0;
        */
        // 'Very high (100)', 'High (approximately 80)', 'Medium (approximately 60)', 'Low (approximately 40)', 'Very low (approximately 20)'
        patient.Meals = [
            {
                id: 1,
                time: 480,
                value: 50,
                type: 'High (approximately 80)'
            },
            {
                id: 2,
                time: 720,
                value: 50,
                type: 'Medium (approximately 60)'
            },
            {
                id: 3,
                time: 1080,
                value: 100,
                type: 'Medium (approximately 60)'
            },
        ];
        simPar.repeat.Meals = "daily";
        simPar.time = 3;
        patient.PA = [];
        patient.Stress = [];
        patient.Metformin = [];
        patient.LAI = [];
        patient.FAI = [];
        patient.GLP = [];
        patient.DPP = [];
        
        // this.clearResponses();
        console.log(patient)
        sim = new Sim();

        // let default_patient = new Sim();
        // sim.setParameters(default_patient.defaultParams);
        // sim.Basal=default_patient.defaultBasal;

        sim.defaultParams.k12 = 0.5 * 0.08;
        sim.Params.k12 = 0.5 * 0.08;

        sim.Params.k12GIH = 0.5 * sim.defaultParams.k12GIH;
        sim.defaultParams.k12GIH = sim.defaultParams.k12GIH;

        sim.Params.k12GIM = 0.5 * sim.defaultParams.k12GIM;
        sim.defaultParams.k12GIM = sim.defaultParams.k12GIM;

        sim.Params.k12GIL = 0.5 * sim.defaultParams.k12GIL;
        sim.defaultParams.k12GIL = sim.defaultParams.k12GIL;

        sim.Params.k12GIvL = 0.5 * sim.defaultParams.k12GIvL;
        sim.defaultParams.k12GIvL = sim.defaultParams.k12GIvL;

        sim.Params.kabsGIH = 0.5 * sim.defaultParams.kabsGIH;
        sim.defaultParams.kabsGIH = sim.defaultParams.kabsGIH;

        sim.Params.kabsGIM = 0.5 * sim.defaultParams.kabsGIM;
        sim.defaultParams.kabsGIM = sim.defaultParams.kabsGIM;

        sim.Params.kabsGIL = 0.5 * sim.defaultParams.kabsGIL;
        sim.defaultParams.kabsGIL = sim.defaultParams.kabsGIL;

        sim.Params.kabsGIvL = 0.5 * sim.defaultParams.kabsGIvL;
        sim.defaultParams.kabsGIvL = sim.defaultParams.kabsGIvL;

        sim.defaultParams.kabs = 0.5 * 0.08;
        sim.Params.kabs = 0.5 * 0.08;

        simPar.initCond.GBPC0 = 9.5;
        simPar.initCond.IBPF0 = 1;
        
        // this.updateValueSlider({ type: "sens", val: 1 }) 
        patient.ins_sens=5;
        sim.Params.SPGU=5;
        // this.updateValueSlider({ type: "secr", val: 0 }) 
        patient.ins_secr=0;
        sim.Params.Sfactor = (1+patient.ins_secr/100);
        // this.updateValueSlider({ type: "prod", val: 0 }) 
        patient.glu_prod=0;
        let alpha=patient.glu_prod/100;
        sim.Params.c3=(1+alpha)*sim.defaultParams.c3;
        sim.Params.c5=(1+alpha)*sim.defaultParams.c5;
        // this.updateValueSlider({ type: "upta", val: 0 }) 
        patient.glu_upta=0;
        alpha=patient.glu_upta/100;
        sim.Basal.rBGU = sim.defaultBasal.rBGU + alpha*sim.defaultBasal.rBGU;
        sim.Basal.rGGU = sim.defaultBasal.rGGU + alpha*sim.defaultBasal.rGGU;
        sim.Basal.rHGU = sim.defaultBasal.rHGU + alpha*sim.defaultBasal.rHGU;
        sim.Basal.rPGU = sim.defaultBasal.rPGU + alpha*sim.defaultBasal.rPGU;
        sim.Basal.rRBCU = sim.defaultBasal.rRBCU + alpha*sim.defaultBasal.rRBCU;

        // sim.Params.kmin=0.005;
        // sim.Params.kmax=0.05;
        sim.Params.c2=1.2;
        sim.Params.d2 = 1;
        //sim.Params.zeta1=0.01;

        

        return sim
    },
    patient2(patient, simPar, sim) {
        /*
        app.InsulinSensitivitySlider.Value=3;
        app.GlucoseproductionrateSlider.Value=0;
        app.GlucoseuptakerateSlider.Value=0;
        app.InsulinSecretionrateSlider.Value=0;
        app.InsulinSensitivitySpinner.Value=3;
        app.GlucoseproductionrateSpinner.Value=0;
        app.GlucoseuptakerateSpinner.Value=0;
        app.InsulinSecretionrateSpinner.Value=0;
        app.defaultPatient=T2Dp;
        
        
        app.p.Param.k12=0.375*0.08;
        app.defaultPatient.Param.k12=app.p.Param.k12;
        app.p.Param.kabs=0.375*0.08;
        app.defaultPatient.Param.kabs=app.p.Param.kabs;
        app.p.GBPC0=14/0.055;
        app.defaultPatient.GBPC0=app.p.GBPC0;
        app.p.IBPF0=0.5;
        app.defaultPatient.IBPF0=app.p.IBPF0;
        */

        patient.Meals = [
            {
                id: 1,
                time: 480,
                value: 50,
                type: 'High (approximately 80)'
            },
            {
                id: 2,
                time: 720,
                value: 50,
                type: 'Medium (approximately 60)'
            },
            {
                id: 3,
                time: 1050,
                value: 100,
                type: 'Medium (approximately 60)'
            },
        ];
        simPar.repeat.Meals = "daily";
        simPar.time = 3;
        patient.PA = [];
        patient.Stress = [];
        patient.Metformin = [];
        patient.LAI = [];
        patient.FAI = [];
        patient.GLP = [];
        patient.DPP = [];
        // this.clearResponses();

        let default_patient = new Sim();
        sim.Params = default_patient.defaultParams;
        sim.Basal = default_patient.defaultBasal;

        sim.defaultParams.k12 = 0.375 * 0.08;
        sim.Params.k12 = 0.375 * 0.08;

        sim.Params.k12GIH = 0.375 * sim.defaultParams.k12GIH;
        sim.defaultParams.k12GIH = sim.defaultParams.k12GIH;

        sim.Params.k12GIM = 0.375 * sim.defaultParams.k12GIM;
        sim.defaultParams.k12GIM = sim.defaultParams.k12GIM;

        sim.Params.k12GIL = 0.375 * sim.defaultParams.k12GIL;
        sim.defaultParams.k12GIL = sim.defaultParams.k12GIL;

        sim.Params.k12GIvL = 0.375 * sim.defaultParams.k12GIvL;
        sim.defaultParams.k12GIvL = sim.defaultParams.k12GIvL;

        sim.Params.kabsGIH = 0.375 * sim.defaultParams.kabsGIH;
        sim.defaultParams.kabsGIH = sim.defaultParams.kabsGIH;

        sim.Params.kabsGIM = 0.375 * sim.defaultParams.kabsGIM;
        sim.defaultParams.kabsGIM = sim.defaultParams.kabsGIM;

        sim.Params.kabsGIL = 0.375 * sim.defaultParams.kabsGIL;
        sim.defaultParams.kabsGIL = sim.defaultParams.kabsGIL;

        sim.Params.kabsGIvL = 0.375 * sim.defaultParams.kabsGIvL;
        sim.defaultParams.kabsGIvL = sim.defaultParams.kabsGIvL;

        sim.defaultParams.kabs = 0.375 * 0.08;
        sim.Params.kabs = 0.375 * 0.08;

        simPar.initCond.GBPC0 = 14;
        simPar.initCond.IBPF0 = 0.5;


        // this.updateValueSlider({ type: "sens", val: 1 }) 
        patient.ins_sens=3;
        sim.Params.SPGU=3;
        // this.updateValueSlider({ type: "secr", val: 0 }) 
        patient.ins_secr=0;
        sim.Params.Sfactor = (1+patient.ins_secr/100);
        // this.updateValueSlider({ type: "prod", val: 0 }) 
        patient.glu_prod=0;
        let alpha=patient.glu_prod/100;
        sim.Params.c3=(1+alpha)*sim.defaultParams.c3;
        sim.Params.c5=(1+alpha)*sim.defaultParams.c5;
        // this.updateValueSlider({ type: "upta", val: 0 }) 
        patient.glu_upta=0;
        alpha=patient.glu_upta/100;
        sim.Basal.rBGU = sim.defaultBasal.rBGU + alpha*sim.defaultBasal.rBGU;
        sim.Basal.rGGU = sim.defaultBasal.rGGU + alpha*sim.defaultBasal.rGGU;
        sim.Basal.rHGU = sim.defaultBasal.rHGU + alpha*sim.defaultBasal.rHGU;
        sim.Basal.rPGU = sim.defaultBasal.rPGU + alpha*sim.defaultBasal.rPGU;
        sim.Basal.rRBCU = sim.defaultBasal.rRBCU + alpha*sim.defaultBasal.rRBCU;  

        //sim.Params.zeta1=0.01;
        // sim.Params.kmin=0.001;
        // sim.Params.kmax=0.01;
        sim.Params.c2=6;
        sim.Params.c3=0.7;
        sim.Params.d2 = 2;

        return [patient,sim]
    },
    patient3(patient, simPar, sim) {
        /*
        app.InsulinSensitivitySlider.Value=2;
        app.GlucoseproductionrateSlider.Value=0;
        app.GlucoseuptakerateSlider.Value=0;
        app.InsulinSecretionrateSlider.Value=0;
        app.InsulinSensitivitySpinner.Value=2;
        app.GlucoseproductionrateSpinner.Value=0;
        app.GlucoseuptakerateSpinner.Value=0;
        app.InsulinSecretionrateSpinner.Value=0;
        app.defaultPatient=T2Dp;
        
        
        app.p.Param.k12=0.375*0.08;
        app.defaultPatient.Param.k12=app.p.Param.k12;
        app.p.Param.kabs=0.375*0.08;
        app.defaultPatient.Param.kabs=app.p.Param.kabs;
        app.p.GBPC0=18/0.055;
        app.defaultPatient.GBPC0=app.p.GBPC0;
        app.p.IBPF0=0.5;
        app.defaultPatient.IBPF0=app.p.IBPF0;
        */

        patient.Meals = [
            {
                id: 1,
                time: 480,
                value: 50,
                type: 'High (approximately 80)'
            },
            {
                id: 2,
                time: 720,
                value: 50,
                type: 'Medium (approximately 60)'
            },
            {
                id: 3,
                time: 1140,
                value: 100,
                type: 'Medium (approximately 60)'
            },
        ];
        simPar.repeat.Meals = "daily";
        simPar.time = 3;
        patient.PA = [];
        patient.Stress = [];
        patient.Metformin = [];
        patient.LAI = [];
        patient.FAI = [];
        patient.GLP = [];
        patient.DPP = [];
        // this.clearResponses();

        let default_patient = new Sim();
        sim.setParameters(default_patient.defaultParams);
        sim.Basal = default_patient.defaultBasal;



        sim.defaultParams.k12 = 0.375 * 0.08;
        sim.Params.k12 = 0.375 * 0.08;

        sim.Params.k12GIH = 0.375 * sim.defaultParams.k12GIH;
        sim.defaultParams.k12GIH = sim.defaultParams.k12GIH;

        sim.Params.k12GIM = 0.375 * sim.defaultParams.k12GIM;
        sim.defaultParams.k12GIM = sim.defaultParams.k12GIM;

        sim.Params.k12GIL = 0.375 * sim.defaultParams.k12GIL;
        sim.defaultParams.k12GIL = sim.defaultParams.k12GIL;

        sim.Params.k12GIvL = 0.375 * sim.defaultParams.k12GIvL;
        sim.defaultParams.k12GIvL = sim.defaultParams.k12GIvL;

        sim.Params.kabsGIH = 0.375 * sim.defaultParams.kabsGIH;
        sim.defaultParams.kabsGIH = sim.defaultParams.kabsGIH;

        sim.Params.kabsGIM = 0.375 * sim.defaultParams.kabsGIM;
        sim.defaultParams.kabsGIM = sim.defaultParams.kabsGIM;

        sim.Params.kabsGIL = 0.375 * sim.defaultParams.kabsGIL;
        sim.defaultParams.kabsGIL = sim.defaultParams.kabsGIL;

        sim.Params.kabsGIvL = 0.375 * sim.defaultParams.kabsGIvL;
        sim.defaultParams.kabsGIvL = sim.defaultParams.kabsGIvL;

        sim.defaultParams.kabs = 0.375 * 0.08;
        sim.Params.kabs = 0.375 * 0.08;
        sim.Params.c2=1.2;
        sim.Params.c3=0.7;
        sim.Params.d2 = 2;
        //sim.Params.zeta1=0.002;
        simPar.initCond.GBPC0 = 18;
        simPar.initCond.IBPF0 = 0.35;

        // this.updateValueSlider({ type: "sens", val: 1 }) 
        patient.ins_sens=3;
        sim.Params.SPGU=patient.ins_sens;
        // this.updateValueSlider({ type: "secr", val: 0 }) 
        patient.ins_secr=0;
        sim.Params.Sfactor = (1+patient.ins_secr/100);
        // this.updateValueSlider({ type: "prod", val: 0 }) 
        patient.glu_prod=0;
        let alpha=patient.glu_prod/100;
        sim.Params.c3=(1+alpha)*sim.defaultParams.c3;
        sim.Params.c5=(1+alpha)*sim.defaultParams.c5;
        // this.updateValueSlider({ type: "upta", val: 0 }) 
        patient.glu_upta=0;
        alpha=patient.glu_upta/100;
        sim.Basal.rBGU = sim.defaultBasal.rBGU + alpha*sim.defaultBasal.rBGU;
        sim.Basal.rGGU = sim.defaultBasal.rGGU + alpha*sim.defaultBasal.rGGU;
        sim.Basal.rHGU = sim.defaultBasal.rHGU + alpha*sim.defaultBasal.rHGU;
        sim.Basal.rPGU = sim.defaultBasal.rPGU + alpha*sim.defaultBasal.rPGU;
        sim.Basal.rRBCU = sim.defaultBasal.rRBCU + alpha*sim.defaultBasal.rRBCU;

        return [patient, sim]
    }
}
export default TunedPatients