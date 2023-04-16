// javascript-obfuscator:disable

/*
The software is owned by Aalborg University and provided to the user for teaching of students only. The pre-defined generic patients, does not represent any real person, and is intended only for teaching purposes. Further the possibilities to suggest specific medicine, and see resulting effect on such generic patients shall in no way be seen as instruction on how to medicate any real patients. The software is not approved for use on patients. 
If you abide by this Agreement, AAU grants you a non-exclusive non-transferable license to use one copy of the version or release of the accompanying software for your internal teaching purposes only, specifically excluding any commercial use of the software. Your use is subject to the following restrictions:

 You may not use the software for patient care and treatment.
 You may not the use software to provide services to third parties.
 You may not make copies and distribute, resell or sublicense the software to third parties.
 You may not copy the software or make it available on a public or external distributed network.
 You may not allow access on an intranet unless it is restricted to authorized users for teaching purposes. 
 You may make one copy of the software for archival purposes or when it is an essential step in authorized use for teaching purposes. 
 You may not modify, reverse engineer, disassemble, decrypt, decompile or make derivative works of software. 
  You may not share your test results with third parties for commercial benefits or for marketing purposes.

THE SOFTWARE IS PROVIDED AS-IS. AALBORG UNIVERSITY DISCLAIMS ALL OTHER EXPRESS AND IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. USER UNDERSTANDS THAT THE SOFTWARE MAY NOT BE ERROR FREE, AND USE MAY BE INTERRUPTED. 
*/














/*
The model implemented in this file uses information from the following scientific sources:

Mohamad Al Ahdab, John Leth, Torben Knudsen, Peter Vestergaard, Henrik Glavind Clausen,
Glucose-insulin mathematical model for the combined effect of medications and life style of Type 2 diabetic patients,
Biochemical Engineering Journal,
Volume 176,
2021,
108170,
ISSN 1369-703X,
https://doi.org/10.1016/j.bej.2021.108170.
(https://www.sciencedirect.com/science/article/pii/S1369703X21002461)
Abstract: The goal of this paper is to propose a new mathematical model for the combined effect of different treatments and lifestyles on the glucose-insulin dynamics of Type 2 diabetes (T2D) patients. The model gives the possibility to take into consideration physical activity, stress, meals, and medications while evaluating or designing treatment plans for T2D patients. The model is proposed by combining and modifying some of the available models in the literature. Simulations were performed for the modifications to show how the model confirm with literature on T2D patients. Additionally, a discussion is provided to demonstrate the ability of the model to be used in the assessment of treatment plans and in the design for robust insulin dose guidance algorithms. An open source code for the model is additionally provided.
Keywords: Glucose; Modelling; Simulation; T2D
*/





// javascript-obfuscator:enable

// maybe i could use linear algebra package, but it seems like it still does operations the same way, defining matrices as [[],[]].
// var linearAlgebra = require('linear-algebra')(),     // initialise it
// Vector = linearAlgebra.Vector,
// Matrix = linearAlgebra.Matrix;



class Sim {
    constructor(params) {
        this.ncalls = {};
        // this.ncalls['ode'] = 0;
        // this.ncalls['lu'] = 0;
        // this.ncalls['num_jac_'] = 0;

        //------------------------------------------------------------ Used for Radau5
        // var m = new Float64Array(3);
        // console.log(m)
        // this.MU_REAL = 3 + 3 ** (2 / 3) - 3 ** (1 / 3)
        // // this.MU_COMPLEX = [3 + 0.5 * (3 ** (1 / 3) - 3 ** (2 / 3)), - 0.5j * (3 ** (5 / 6) + 3 ** (7 / 6))];
        // this.MU_COMPLEX = [2.68108287362775, -3.05043019924741]; // should be [2.68108287362775 + 0.00000000000000i,	0.00000000000000 - 3.05043019924741i]
        // this.T = [[0.09443876248897524, -0.14125529502095421, 0.03002919410514742],
        // [0.25021312296533332, 0.20412935229379994, -0.38294211275726192],
        // [1, 1, 0]];
        // this.TI = [[4.17871859155190428, 0.32768282076106237, 0.52337644549944951],
        // [-4.17871859155190428, -0.32768282076106237, 0.47662355450055044],
        // [0.50287263494578682, -2.57192694985560522, 0.59603920482822492]];
        // this.TI_REAL = [this.TI[0]];
        // this.TI_COMPLEX = [this.TI[1], this.TI[2]];//TI[1] + 1j * TI[2]
        // let S6 = 6 ** 0.5;
        // this.C = [[(4 - S6) / 10, (4 + S6) / 10, 1]];
        // this.E = [[(-13 - 7 * S6) / 3, (-13 + 7 * S6) / 3, (-1) / 3]];
        // this.P = [[13 / 3 + 7 * S6 / 3, -23 / 3 - 22 * S6 / 3, 10 / 3 + 5 * S6],
        // [13 / 3 - 7 * S6 / 3, -23 / 3 + 22 * S6 / 3, 10 / 3 - 5 * S6],
        // [1 / 3, -8 / 3, 10 / 3]];
        // ----------------------------------------------------------------------------------------------

        // this.NEWTON_MAXITER = 6;  // Maximum number of Newton iterations.
        // this.MIN_FACTOR = 0.2;  // Minimum allowed decrease in a step size.
        // this.MAX_FACTOR = 10;  // Maximum allowed increase in a step size.




        // super(params);
        this.id = "Patient 1";
        this.ode_output_sampling_period = 1; // will return 1 data point for each 'ode_output_sampling_period' seconds
        // list of state variables
        this.stateList = {
            "HBA1C": { unit: "[mmol/mol]", html: "HBA1C" },
            "qss": { unit: "[mg]", html: "qss" },
            "qsl": { unit: "[mg]", html: "qsl" }
        };
        this.paramList = {
            "VGBC": { unit: "dL", html: "VGBC" },
            "VGBF": { unit: "dL", html: "VGBF" }
        };
        this.defaultBasal = {
            "GPF": 123.529687,
            "IPF": 1.000000,
            "IL": 4.978212,
            "GL": 137.570991,
            "Gamma": 1.000000,
            "SB": 0.515788,
            "GH": 128.444007,
            "IH": 2.613416,
            "rPIR": 5.115243,
            "rBGU": 70.000000,
            "rRBCU": 10.000000,
            "rGGU": 20.000000,
            "rPGU": 35.000000,
            "rHGP": 155.000000,
            "rHGU": 20.000000,
        };
        this.defaultParams = {
            "VGBC": 3.500000,
            "VGBF": 4.500000,
            "VGH": 13.800000,
            "VGL": 25.100000,
            "VGG": 11.200000,
            "VGK": 6.600000,
            "VGPC": 10.400000,
            "VGPF": 67.400000,
            "QGB": 5.900000,
            "QGH": 43.700000,
            "QGA": 2.500000,
            "QGL": 12.600000,
            "QGG": 10.100000,
            "QGK": 10.100000,
            "QGP": 15.100000,
            "TGB": 2.100000,
            "TGP": 5.000000,
            "VIB": 0.260000,
            "VIH": 0.990000,
            "VIG": 0.940000,
            "VIL": 1.140000,
            "VIK": 0.510000,
            "VIPF": 6.740000,
            "QIB": 0.450000,
            "QIH": 3.120000,
            "QIA": 0.180000,
            "QIK": 0.720000,
            "QIP": 1.050000,
            "QIG": 0.720000,
            "TIP": 20.000000,
            "ml0": 6.330000,
            "QIL": 0.900000,
            "VIPC": 0.740000,
            "VGamma": 6.740000,
            "fg": 0.900000,
            "Kq1": 0.680000,
            "Kq2": 0.002360,
            "k12": 0.080000,
            "kmin": 0.005000,
            "kmax": 0.050000,
            "kabs": 0.080000,
            "c1": 0.067000,
            "c2": 1.590000,
            "c3": 0.620000,
            "c4": 1.720000,
            "c5": 2.030000,
            "d1": 1.126000,
            "d2": 0.683000,
            "d3": 0.140000,
            "d4": 0.023000,
            "d5": 1.590000,
            "SHGU": 1.000000,
            "SHGP": 1.000000,
            "SPGU": 1.000000,
            "zeta1": 0.002600,
            "zeta2": 0.000099,
            "ml0": 6.330000,
            "Kl": 0.057200,
            "Ks": 0.057200,
            "gammapan": 2.366000,
            "alphapan": 0.615000,
            "betapan": 0.931000,
            "N1": 0.049900,
            "N2": 0.000150,
            "KILLPAN": 0.000000,
            "Sfactor": 1.000000,
            "VPSI": 11.310000,
            "Kout": 68.304114,
            "CF2": 21.151177,
            "tpsi": 35.100000,
            "zeta": 8.248000,
            "zetae": 1.2*40,//4.0464,//Used to be 40. 
            "RmaxC": 5.000000,
            "Fv": 0.772000,
            "ka1": 0.021000,
            "ka2": 0.017500,
            "CL": 0.606667,
            "CLic": 0.668333,
            "Vp": 97.300000,
            "Vc": 22.200000,
            "kvd": 71.900000,
            "k2v": 0.390000,
            "koff": 0.010200,
            "RmaxP": 13.000000,
            "kdeg": 0.001833,
            "kgo": 0.001880,
            "kgg": 0.001850,
            "kpg": 4.130000,
            "kgl": 0.460000,
            "kpl": 0.010100,
            "klp": 0.910000,
            "kpo": 0.510000,
            "vGWmax": 0.972*0.9, //0.9*0.972000,
            "vLmax": 0.756000*0.9, // 0.9*0.756000,
            "vPmax": 0.296000*0.9, //0.9*0.296000,
            "nGW": 2.000000,
            "nL": 5.000000,
            "nP": 5.000000,
            "phiGW50": 431.000000,
            "phiL50": 521.000000,
            "phiP50": 1024.000000,
            "rhoalpha": 0.054000,
            "rhobeta": 0.054000,
            "alpham": 0.060000,
            "betam": 0.100000,
            "pla": 0.014024,
            "rla": 0.005642,
            "qla": 0.007287,
            "bla": 0.088371,
            "Cmax": 15.000000,
            "kla": 0.033905,
            "kcll": 0.005348,
            "pfa": 0.033304,
            "rfa": 0.192838,
            "sfa": 1,
            "qfa": -0.000000009999983,
            "bfa": 0.350073,
            "kclf": 0.031322,
            "tHR": 5.000000,
            "ne": 4.000000,
            "ae": 0.350000, //0.1
            "te": 600.000000,
            "alphae": 0.250000, //0.8 
            "betae": 0.000339,
            "HRb": 80.000000,
            "ce1": 500.000000,
            "ce2": 100.000000,
            "sigsmbg": 0.100000,
            "k12GIH": 0.037,
            "kabsGIH": 0.037,
            "k12GIM": 0.021,
            "kabsGIM": 0.021,
            "k12GIL": 0.012,
            "kabsGIL": 0.012,
            "k12GIvL": 0.006,
            "kabsGIvL": 0.006,
            "ah2": 0.013327726243785, //Daily GLP-1
            "bh2": 0.013327635106873,
            "ch2": 1.132015661298425 * 1000,
            "ah24": 6.542156013872301e-05,//Weekly GLP-1
            "bh24": 0.002630843797799,
            "ch24": 3.459871138462720e+08 / 1000,//1400000 //
            "fStress": 0.2,
            "tauMIHGP": 0.001,//0.04, 
            "taufr": 0.0154,
            "tauMIHGU": 0.04,
        };
        // load parameters handed over to this instance
        if (typeof params === "undefined") {
            params = {};
        }
        this.Params = Object.assign(params, this.defaultParams);
        this.Basal = Object.assign({}, this.defaultBasal)
        
        // this.keys=Object.keys(this.X0);
        this.keys = [
            "GBC",
            "GBF",
            "GH",
            "GG",
            "GL",
            "GK",
            "GPC",
            "GPF",
            "IB",
            "IH",
            "IG",
            "IL",
            "IK",
            "IPC",
            "IPF",
            "qss",
            "qsl",
            "qint",
            "MO1",
            "MO2",
            "MGl",
            "MGW",
            "ML",
            "MP",
            "AG1",
            "AG2",
            "Ac",
            "Ap",
            "DRc",
            "DRp",
            "E1",
            "E2",
            "Hfa",
            "Dfa",
            "Bla",
            "Hla",
            "Dla",
            "ml",
            "P",
            "R",
            "Gamma",
            "psi",
            "PSI",
            "MIHGP",
            "fr",
            "MIHGU",
            "De",
            "DNq",
            "TE",
            "XGC",
            "XGP",
            "XIC",
            "XIS",
            "XIinj",
            "Ila",
            "Ifa",
            "GHint",
            "qssGIH",
            "qslGIH",
            "qintGIH",
            "qssGIM",
            "qslGIM",
            "qintGIM",
            "qssGIL",
            "qslGIL",
            "qintGIL",
            "qssGIvL",
            "qslGIvL",
            "qintGIvL",
            "psih2",
            "PSIh2",
            "psih24",
            "PSIh24"];
        // console.log(this.keys)
        this.n = this.keys.length;
        let u = { 'DgA': 1, 'HRv': this.Params.HRb, 'stressv': 0 };
        this.setBasaldefGCPFIPF(7, 1);
        // console.log('this.obj2Arr(this.X0)', this.obj2Arr(this.X0))
        // let Xs = this.obj2Arr(this.X0).map(x => [x, x, x]);
        // console.log('Xs', Xs)
        // let F = this.derivatives_vec([0, 0, 0], Xs, u, this)
        // console.log('F', F)
        // let f = this.derivatives(0,this.X0,u,this);
        // console.log('pre f=',{...f})
        // let numjac=this.num_jac((t,y)=>this.derivatives(t,y,u,this), 0, this.X0, f, 1e-6, null);
        // console.log('numjac=',numjac)
        // let Z0 = [];
        // for (let i = 0; i < 3; i++) {
        //     Z0[i] = [];
        //     for (let j = 0; j < this.n; j++)
        //         Z0[i][j] = 0;
        // }
        // console.log('preZ0',Z0)
        // let rtol=1e-3;
        // let atol=1e-3;
        // let h=0.1;
        // let scale = this.sMaddScalar([this.timesScalar(this.vecAbs(this.X0) , rtol)],atol) ;
        // scale=this.structToMat(scale);
        // let fun = (t, y) => this.derivatives(t, y, u, this);
        // let fun_ = (t, y) => this.fode(t, y, u, this);

        // this.sol=RadauDenseOutput(t_old, t, y_old, Z)


        // -------------------------------------------- Used by Radau5
        // this.sol = undefined;


        // this.t = 0;
        // this.y = this.X0;

        // this.y_old = undefined;
        // this.max_step = 20;//validate_max_step(max_step)
        // // self.rtol, self.atol = validate_tol(rtol, atol, self.n)
        // this.rtol = 1e-5;
        // this.atol = 1e-5;//e-1;
        // this.newton_tol = Math.max(10 * Number.EPSILON / this.rtol, Math.min(0.03, this.rtol ** 0.5))
        // console.log('newtol_tol', this.newton_tol, 0 * Number.EPSILON / this.rtol, Math.min(0.03, this.rtol ** 0.5))
        // this.f = this.derivatives(this.t, this.y, u, this)
        // this.h_abs = 0.1;

        // this.h_abs_old = undefined;
        // this.error_norm_old = undefined;


        // this.sol = undefined;

        // this.jac = undefined; 
        // ------------------------------------------------------------
    };
    inInterval(t, vector) {
      var PA = 0;
      for (let i = 0; i < vector.length; i++) {
          if (t >= vector[i][0][0] && t < vector[i][vector[i].length - 1][0]) {
              PA += vector[i][0][1];
          }
      }
      return PA;
  }
    debug_Sim(simPar) {
        function fode(t, x) {
            let mu = 5;
            return [x[1], mu * (1 - x[0] ** 2) * x[1] - x[0]]
        }
        var init_ode_step_size = 0.7;
        let last_graph_update = Date.now();
        let last_prog_report = 0;
        let ode_output_sampling_period = 1 * simPar.time / simPar.simSettings.dataFrequencyRatio;
        ode_output_sampling_period = 0.01;//(ode_output_sampling_period>0 && isFinite(ode_output_sampling_period))? ode_output_sampling_period: 1; // if invalid frequency, set to output at 1 data point per minute
        let last_sample_time = 0;//+ode_output_sampling_period;
        let X = { GH: [1], IH: [0] };

        this.keys = ['GH', 'IH'];
        this.n = 2;
        let out = { tout: [0], yout: X, hout: [init_ode_step_size], errout: [] };
        out = this.Radau5_(fode, 0, 50, [1, 0], init_ode_step_size, ode_output_sampling_period, last_sample_time, simPar.simSettings, last_prog_report, last_graph_update, out);
        self.postMessage({ full: out, progTime: 1440 })
        return out;
    }
    Simulate(simPar) {
        /*
            Refactor events to 
            events=[];
            events[i]=[t,(xe)=>{
                var x = xe.x;
                var u = xe.u;
                var memory=xe.memory;

                x['asdf']+=meal; // modify x ,u, and memory;

                xe.x=x;
                xe.u=u;
                xe.memory=memory;
            }]
            ensure events are in time order,

            then just 
            for (event of events){
                events[2](xe)
                sim
            }

        */
        this.simStartRT = Date.now();
        // return this.debug_Sim(simPar);
        var init_ode_step_size = 0.2;
        let last_graph_update = Date.now();
        let last_prog_report = Date.now();
        console.log('Simulation start')

        let ode_output_sampling_period = 1 * simPar.time / simPar.simSettings.dataFrequencyRatio;
        ode_output_sampling_period = (ode_output_sampling_period > 0 && isFinite(ode_output_sampling_period)) ? ode_output_sampling_period : 1; // if invalid frequency, set to output at 1 data point per minute
        ode_output_sampling_period = ode_output_sampling_period>5?5:ode_output_sampling_period;
        let last_sample_time = 0 + ode_output_sampling_period;
        let Meals = [...simPar.parVector.Meals.data]; // "= data" does not work as changing Meals array would change mealVector.data Array, this copies the array
        let GLP = [...simPar.parVector.GLP.data];
        // console.log('Simulate received:',GLP)
        // console.log('GLP[0]=',GLP[0])
        let paVector = [...simPar.parVector.PA.data];
        let stressVector = [...simPar.parVector.Stress.data];
        let metVector = [...simPar.parVector.Metformin.data];
        let faiVector = [...simPar.parVector.FAI.data];
        let laiVector = [...simPar.parVector.LAI.data];
        let dppVector = []; // Uncommented below to since it read undefined after being removed from visibility in UI
        // let dppVector = [...simPar.parVector.DPP.data];
        // console.log(Meals, GLP, paVector, stressVector, metVector, faiVector, laiVector,dppVector)
        // console.log(dppVector)
        // console.log('Meals:')
        // console.log(Meals);
        let meals = [];
        for (let i = 0; i < Meals.length; i++) {
            if (Meals[i][1] > 0)
                meals.push([Meals[i][0], Meals[i][1] * 1e3, Meals[i][2]]); // meals in mg
        }
        // for (let i=0;i<GLP.length;i++){
        //     if (GLP[i][2]=='')
        // }
        for (let i = 0; i < stressVector.length; i++) {
            for (let j = 0; j < stressVector[i].length; j++) {
                stressVector[i][j][1] = stressVector[i][j][1] / 100;
            }
        }
        for (let i = 0; i < metVector.length; i++) {
            metVector[i][1] = metVector[i][1] ; // fode expects metformin in [mg]
        }
        for (let i = 0; i < faiVector.length; i++) {
            faiVector[i][1] = faiVector[i][1] * 1e2 / 6.76;
        }
        for (let i = 0; i < laiVector.length; i++) {
            laiVector[i][1] = laiVector[i][1] * 1e2 / 6.76;
        }
        for (let i = 0; i < dppVector.length; i++) {
            dppVector[i][1] = dppVector[i][1] *(1/(303.406)*10**6);
        }

        // console.log('meals:')
        // console.log(meals)
        // console.log('PA:')
        // console.log(paVector)
        // console.log('stressVector')
        // console.log(stressVector)
        // let stopEvents=[['Start']];  // TBD: event based events

        let Tstop = [0];

        let TFinal = 1440 * simPar.time;
        let fcnEvents;
        if (simPar.simSettings.clEnable){
            fcnEvents=new Array(Math.trunc((TFinal-simPar.simSettings.clStartTime)/simPar.simSettings.clPeriod)+1)
            for (let i=0;i<fcnEvents.length;i++){
                Tstop.push(i*simPar.simSettings.clPeriod+simPar.simSettings.clStartTime);
                fcnEvents[i]=[];
                fcnEvents[i][0]=i*simPar.simSettings.clPeriod+simPar.simSettings.clStartTime;
                fcnEvents[i][1]=1;
            }
        }else{
            fcnEvents=[];
        }
        // console.log(fcnEvents)

        meals.unshift([0, 1e-7, 'Very high'])
        // console.log('meals',[...meals])
        for (let i = 0; i < meals.length; i++) {
            if (meals[i][1] > 0)
                Tstop.push(meals[i][0]);
        }
        for (let i = 0; i < GLP.length; i++) {
            if (GLP[i][1] > 0)
                Tstop.push(GLP[i][0]);
        }

        for (let i = 0; i < paVector.length; i++) {
            Tstop.push(paVector[i][0][0]);
            Tstop.push(paVector[i][paVector[i].length - 1][0]);
        }
        for (let i = 0; i < stressVector.length; i++) {
            Tstop.push(stressVector[i][0][0]);
            Tstop.push(stressVector[i][stressVector[i].length - 1][0]);
        }
        for (let i = 0; i < metVector.length; i++) {
            if (metVector[i][1] > 0)
                Tstop.push(metVector[i][0]);
        }
        for (let i = 0; i < laiVector.length; i++) {
            if (laiVector[i][1] > 0)
                Tstop.push(laiVector[i][0]);
        }
        for (let i = 0; i < faiVector.length; i++) {
            if (faiVector[i][1] > 0)
                Tstop.push(faiVector[i][0]);
        }
        for (let i = 0; i < dppVector.length; i++) {
            if (dppVector[i][1] > 0)
                Tstop.push(dppVector[i][0]);
        }
        Tstop.push(TFinal);
        Tstop = Array.from(new Set(Tstop)); // find unique
        Tstop.sort((a, b) => a - b) // sort unique stopping times in ascending order
        // console.log('Tstop:')
        // console.log(Tstop)


        let u = { 'DgA': 0, 'HRv': this.Params.HRb, 'stressv': 0 }; // Dg=Last meal
        let x0 = this.X0;
        // x0['DNq']=1e-7;
        let X = {};
        for (let key in x0) {
            switch (key) {
                case 'GBC':
                case 'GBF':
                case 'GH':
                case 'GG':
                case 'GL':
                case 'GK':
                case 'GPC':
                case 'GPF':
                case 'XGC':
                case 'XGP':
                    X[key] = [x0[key] * 0.0555];
                    break;
                default:
                    X[key] = [x0[key]];
                    break;
            }

        }
        let Xstop = x0;

        let out = { tout: [0], yout: X, hout: [init_ode_step_size], errout: [] };


        // var out=ode45((t,x)=>derivatives(t,x,u,0,this.patient),144,x0);
        let LastMeal = 0;
        let DM = 1;

        var output = [];
        let houtput = [];
        let erroutput = [];

        let nFailed = 0;
        let nsteps = 0;
        let nfevals = 0;
        function getMealsByType(t, events) {
            let MBT = { VH: 0, H: 0, M: 0, L: 0, VL: 0, S: 0 };
            for (let event of events) {
                if (event[0] == t) {
                    switch (event[2]) {
                        case 'Very high':
                            MBT.VH += event[1];
                            MBT.S += event[1];
                            break;
                        case 'High':
                            MBT.H += event[1];
                            MBT.S += event[1];
                            break;
                        case 'Medium':
                            MBT.M += event[1];
                            MBT.S += event[1];
                            break;
                        case 'Low':
                            MBT.L += event[1];
                            MBT.S += event[1];
                            break;
                        case 'Very low':
                            MBT.VL += event[1];
                            MBT.S += event[1];
                            break;
                    }
                }
            }
            return MBT;
        }
        function getGLPByType(t, events) {
            let glps = { psih2: 0, psih24: 0 };
            for (let event of events) {
                if (event[0] == t) {
                    switch (event[2]) {
                        case 'Daily':
                            glps.psih2 += event[1];
                            break;
                        case 'Weekly':
                            glps.psih24 += event[1];
                            break;
                    }
                }
            }
            return glps;
        }
        // javascript-obfuscator:disable
        let memory;
        if (simPar.simSettings.clEnable){
            try{
            console.log('Eval:',simPar.simSettings.clInitStr)
            eval(simPar.simSettings.clInitStr);
            }
            catch (err){
                console.log(err.name)
                console.log(err.message)
                out.ResponseStatistics = { GHavg: NaN, HbA1c_IFCC: NaN, eAG: NaN };
                self.postMessage({ full: out, progTime: TFinal })
                return  0;
            }
        }else{
            const n_samples=TFinal/ode_output_sampling_period;
            out.yout['lai']=new Array(n_samples).fill(0);
            out.yout['fai']=new Array(n_samples).fill(0);
        }
        // javascript-obfuscator:enable
        for (let i = 1; i < Tstop.length; i++) {


            let x = Xstop;


            let stoppedForMeal = this.eventExistAtTime(Tstop[i - 1], meals);
            // console.log('t='+Tstop[i-1]+' meal='+stoppedForMeal)
            if (i == 1 && (stoppedForMeal == 0)) {
                DM = 1;
            } else if (stoppedForMeal > 0) {
                let MBT = getMealsByType(Tstop[i - 1], meals)
                // console.log('MBT', MBT)
                DM = x['De'] + MBT.S - x['DNq'];
                x['qss'] += MBT.VH;
                x['qssGIH'] += MBT.H;
                x['qssGIM'] += MBT.M;
                x['qssGIL'] += MBT.L;
                x['qssGIvL'] += MBT.VL;
                x['De'] += MBT.S;

                LastMeal = MBT.S;
                // meals.shift();
            } else {
                DM = 0;
            }
            x['DNq'] += DM;
            u.DgA = LastMeal;

            let stoppedForGLP = this.eventExistAtTime(Tstop[i - 1], GLP);
            if (stoppedForGLP > 0) {
                let glps = getGLPByType(Tstop[i - 1], GLP);
                for (let key in glps) {
                    console.log('key=', key, 'glps[key]=', glps[key])
                    x[key] += glps[key];
                }
            }


            let PA = 0;
            if (paVector.length > 0) {
                PA = this.inInterval(Tstop[i - 1], paVector);
                // if (PA>0)
                // console.log('from '+Tstop[i-1]+' to '+ Tstop[i]+'  =>  PA='+PA)
                // if (Tstop[i]>paVector[0][paVector[0].length-1][0]){
                //     paVector.shift();
                // }
            }
            u.HRv = this.Params.HRb + PA;


            u.stressv = 0;
            if (stressVector.length > 0) {
                u.stressv = this.inInterval(Tstop[i - 1], stressVector);
                // if (u.stressv>0)
                // console.log('from '+Tstop[i-1]+' to '+ Tstop[i]+'  =>  stress='+u.stressv)
                // if (Tstop[i]>stressVector[0][stressVector[0].length-1][0]){
                //     stressVector.shift();
                // }
            }

            let met_dose = this.eventExistAtTime(Tstop[i - 1], metVector);
            // console.log('metVector',metVector)
            // console.log('met_dose',met_dose)
            x['MO1'] += met_dose;
            x['MO2'] += met_dose;
            // if (met_dose>0)
            //     console.log('Met:',Tstop[i-1],met_dose)
            x['Hfa'] += this.eventExistAtTime(Tstop[i - 1], faiVector);

            x['Bla'] += this.eventExistAtTime(Tstop[i - 1], laiVector);
            
            x['AG1'] += this.eventExistAtTime(Tstop[i - 1], dppVector);
            // console.log(fcnEvents)
            
            if (simPar.simSettings.clEnable){
                if (this.eventExistAtTime(Tstop[i - 1], fcnEvents)==1){
                    // var u_cl=0;
                    try {
                        // javascript-obfuscator:disable
                        var GH=x['GH'];
                        var t=Tstop[i-1];
                        let lai=0;
                        let fai=0;
                        eval(simPar.simSettings.clStr)
                        x['Bla'] += lai * 1e2 / 6.76
                        x['Hfa'] += fai * 1e2 / 6.76;
                        // javascript-obfuscator:enable
                        //out.tout;
                        if (typeof out.yout['lai']==='undefined'){
                            // out.yout['lai']=new Array(out.tout.length-1);
                            out.yout['lai']=new Array(out.tout.length).fill(0);
                            // out.yout['fai']=new Array(out.tout.length-1);
                            out.yout['fai']=new Array(out.tout.length).fill(0);
                        }else{
                            console.log(out.tout.length,out.yout['lai'].length)
                            out.yout['lai'].push(...new Array(out.tout.length-out.yout['lai'].length).fill(0));
                            out.yout['fai'].push(...new Array(out.tout.length-out.yout['fai'].length).fill(0));
                        }
                        
                        out.yout['lai'].push(lai);
                        out.yout['fai'].push(fai);

                        if (typeof out['CL']==='undefined'){
                            out['CL']={};
                            out['CL'].lai=[];
                            out['CL'].fai=[];
                        }
                        out['CL'].lai.push([t,lai]);
                        out['CL'].fai.push([t,fai]);
                        console.log([t,lai],out['CL'].lai)

                    }
                    catch (err){
                        console.log(err.name,err.message)
                        out.ResponseStatistics? null:out.ResponseStatistics = { GHavg: NaN, HbA1c_IFCC: NaN, eAG: NaN };
                        self.postMessage({ full: out, progTime: TFinal })
                        return  0;
                    }
                }
            }

            // console.log('LastMeal',u.Dg)
            // out=this.ode45((t,x)=>this.derivatives(t,x,u,this),Tstop[i-1],Tstop[i],x,init_ode_step_size,ode_output_sampling_period,last_sample_time,simPar.simSettings,last_prog_report,last_graph_update,out)
            if (simPar.simSettings.selected_solver == "ode45-ish") {
                // console.log('using ode45 solver')
                out = this.ode45_Arr((t, x) => this.fode(t, x, u, this), Tstop[i - 1], Tstop[i], this.obj2Arr(x), init_ode_step_size, ode_output_sampling_period, last_sample_time, simPar.simSettings, last_prog_report, last_graph_update, out);
                // Xstop = out.XStop;
                Xstop = this.Arr2Obj(out.XStop);
            } else {
                console.log('using radau5 solver')
                // out=this.Radau5((t,x)=>this.derivatives(t,x,u,this),Tstop[i-1],Tstop[i],x,init_ode_step_size,ode_output_sampling_period,last_sample_time,simPar.simSettings,last_prog_report,last_graph_update,out);
                out = this.Radau5_((t, x) => this.derivatives_vec(t, x, u, this), u.stressv, Tstop[i - 1], Tstop[i], this.obj2Arr(x), init_ode_step_size, ode_output_sampling_period, last_sample_time, simPar.simSettings, last_prog_report, last_graph_update, out);
                Xstop = this.Arr2Obj(out.XStop);
            }
            last_sample_time = out.last_sample_time;
            init_ode_step_size = out.h;
            nFailed += out.nfailed;
            nsteps += out.nsteps;
            nfevals += out.nfevals
            last_prog_report = out.last_prog_report;
            last_graph_update = out.last_graph_update;
            // console.log('simulated: '+Tstop[i-1]+'/'+Tstop[Tstop.length-1])
            // console.log('ode step size:'+init_ode_step_size)
            // let len = out_new.yout['GH'].length;
            // var last_t=0;//out.tout[out.tout.length-1];
            // console.log('last_t='+last_t)
            // for (var j = 0; j < len; j++) { 
            //     out.tout.push(out_new.tout[j]);
            //     out.hout.push(out_new.hout[j]);
            //     out.errout.push(out_new.errout[j]);
            //     for (let key in out_new.yout){
            //         switch (key){
            //             case 'GBC':
            //             case 'GBF':
            //             case 'GH':
            //             case 'GG':
            //             case 'GL':
            //             case 'GK':
            //             case 'GPC':
            //             case 'GPF':
            //             case 'XGC':
            //             case 'XGP':
            //                 out.yout[key].push(out_new.yout[key][j]*0.055);
            //                 break;
            //             default :
            //                 out.yout[key].push(out_new.yout[key][j]);
            //                 break;
            //         }

            //     }

            //     // out_new.tout[j]+=last_t;
            // }




            // let xstop={};
            // for (let key in out_new.yout){
            //     xstop[key]=out_new.yout[key][len-1];
            // }

            // console.log('Xstop', Xstop)

            // for (let i=0;i<out_new.yout['GH'].length;i++){
            //     output.push([out_new.tout[i]+last_t,out_new.yout['GH'][i]*0.055]);
            //     houtput.push([out_new.tout[i]+last_t,out_new.hout[i]]);
            //     erroutput.push([out_new.tout[i]+last_t,out_new.errout[i]]);
            // }
            // self.postMessage({full: out,progTime: Tstop[i]})
            // last_prog_report = Tstop[i];
            // self.postMessage(out)
            if (Tstop[i] >= TFinal) { // Just in case there are events after simulation is supposed to end, stop the for loop
                break;
            }
        }

        // console.log('final postMsg',out.ResponseStatistics)
        self.postMessage({ full: out, progTime: TFinal })

        // console.log(out)
        // this.graphInfo=[{name:'GH',data:output}];
        // this.Graph.data=[{name:'GH',data:output}];
        console.log('nfevals=' + nfevals, 'nsteps=' + nsteps, 'nFailed=' + nFailed)
        console.log('Simulation ended')
        return [{ name: 'GH', data: output }, { name: 'stepSize', data: houtput }, { name: 'odeErr', data: erroutput }];
        // return [{name:'GH',data:output},{name:'stepSize',data:houtput}];
    };
    eventExistAtTime(t, events) {
        for (let event of events) {
            if (event[0] == t) {
                return event[1];
            }
        }
        return 0;
    };
    setParameters(params) {
        // import parameters
        // params could be an object with all parameters or just a few parameters e.g.
        // params={'HRb':80,"ce1": 500}
        this.Params = Object.assign(this.Params, params);
    };
    setBasaldefGCPFIPF(GBPC0, IBPF0) {
        let bas = this.BasaldefGCPFIPF(GBPC0, IBPF0);
        this.X0 = bas.x;

        
        this.Basal = Object.assign(this.Basal, bas.rates);

        this.Basal['GPF'] = bas.x['GPF'];
        this.Basal['IPF'] = IBPF0;
        this.Basal['IL'] = bas.x['IL'];
        this.Basal['GL'] = bas.x['GL'];
        this.Basal['Gamma'] = bas.x['Gamma'];
        this.Basal['SB'] = bas.S;
        this.Basal['GH'] = bas.x['GH'];
        this.Basal['IH'] = bas.x['IH'];



        // let x0Arr=this.obj2Arr(this.X0);
        // console.log('x0Arr',x0Arr)
        // console.log(this.Arr2Obj(this.fode(0,x0Arr,{ 'DgA': 0, 'HRv': this.Params.HRb, 'stressv': 0 },this)))

    };
    BasaldefGCPFIPF(GBPC0, IBPF0) {
        /*
            GBPC0 in [mmol/l]
            returns an object {'x':x,'rates':rates,'S':S};
            where x is the initial/equilibria state
            rates are the rates in the basal vector
            and S is "I have no idea"
        */
        let x = {};

        let param = this.Params;
        let GPC = GBPC0 / 0.0555;
        let IPF = IBPF0;
        let rBGU = this.Basal['rBGU'];
        let rRBCU = this.Basal['rRBCU'];
        let rGGU = this.Basal['rGGU'];
        let rPGU = this.Basal['rPGU'];
        let rHGU = this.Basal['rHGU'];
        // let k12=param.k12, Kq1=param.Kq1, Kq2=param.Kq2, kmin=param.kmin,
        // kmax=param.kmax, kabs=param.kabs, fg=param.fg;

        //Metformin submodel:
        // let kgo=param.kgo, kgg=param.kgg, kpg=param.kpg, kgl=param.kgl, kpl=param.kpl,
        // klp=param.klp, vGWmax=param.vGWmax, vLmax=param.vLmax, vPmax=param.vPmax,
        // nGW=param.nGW, nL=param.nL, nP=param.nP, phiGW50=param.phiGW50,
        // phiL50=param.phiL50, phiP50=param.phiP50, rhoO1=param.rhoalpha, rhoO2=param.rhobeta,
        // alpham=param.alpham, betam=param.betam, kpo=param.kpo;

        //Vildagliptin submodel: 
        // let ka1=param.ka1, ka2=param.ka2, CL=param.CL, CLic=param.CLic, Vc=param.Vc,
        // Vp=param.Vp, RmaxC=param.RmaxC, kdvil=param.kvd, k2vil=param.k2v,
        // koff=param.koff, RmaxP=param.RmaxP, kdeg=param.kdeg;

        //Physical activity model:
        // let tHR=param.tHR, HRb=param.HRb, ne=param.ne, ae=param.ae, te=param.te,
        // ce1=param.ce1, ce2=param.ce2;
        //Fast acting insulin:
        // let pfa=param.pfa, rfa=param.rfa, qfa=param.qfa, bfa=param.bfa;

        //Long acting insulin:
        // let pla=param.pla, rla=param.rla, qla=param.qla, bla=param.bla,
        // Cmax=param.Cmax, kla=param.kla;

        //Pancreas submodel
        // let zeta1=param.zeta1, zeta2=param.zeta2;
        let kdmdpan = param.ml0 * param.Kl;
        let Kpan = param.Ks, gammapan = param.gammapan;
        // let alphapan=param.alphapan, betapan=param.betapan;
        let N1 = param.N1;
        // let N2=param.N2;
        // let KILLPAN = param.KILLPAN;
        // let Sfactor = param.Sfactor;
        //Insulin submodel:
        let VIB = param.VIB, VIH = param.VIH, QIB = param.QIB, QIL = param.QIL,
            QIK = param.QIK, QIP = param.QIP, QIH = param.QIH,
            QIG = param.QIG, VIG = param.VIG, VIL = param.VIL, QIA = param.QIA, VIK = param.VIK,
            VIPC = param.VIPC, VIPF = param.VIPF, TIP = param.TIP;


        //Glucose submodel:
        let VGBC = param.VGBC, QGB = param.QGB, VGBF = param.VGBF, TGB = param.TGB,
            VGH = param.VGH, QGL = param.QGL,
            QGK = param.QGK, QGP = param.QGP, QGH = param.QGH, VGG = param.VGG,
            QGG = param.QGG, VGL = param.VGL, QGA = param.QGA, VGK = param.VGK,
            VGPC = param.VGPC, VGPF = param.VGPF, TGP = param.TGP, alphae = param.alphae,
            betae = param.betae;

        //Glucagon submodel:
        let VGamma = param.VGamma;


        //GLP-1 submodel:
        let VPSI = param.VPSI, Kout = param.Kout, CF2 = param.CF2,
            tpsi = param.tpsi, kphi = param.zeta;

        //rates:
        let cIPGU = param.c1, cIHGPinft = param.c2,
            cGHGP = param.c3, cIHGUinft = param.c4, cGHGU = param.c5,
            dIPGU = param.d1, dIHGPinft = param.d2, dGHGP = param.d3,
            dIHGUinft = param.d4, dGHGU = param.d5;
        // GLucose basal values:
        let GPF = GPC - TGP * rPGU / VGPF;
        let GH = GPC + (VGPF / (QGP * TGP)) * (GPC - GPF);
        let GK = GH;

        let rKGE = (330 + 0.872 * GK) * (1 / (1 + Math.exp(-0.01 * (GK - 460)))) + (71 + 71 * Math.tanh(0.011 * (GK - 460))) * (1. / (1 + Math.exp(0.01 * (GK - 460))));
        let dGKdt=(1/VGK)*(QGK*(GH-GK)-rKGE);
        let GK_n=0;
        while(Math.abs(dGKdt)>1e-9&&GK_n<10){
            GK_n++;
            var df=-(QGK + ((781*Math.tanh((11*GK)/1000 - 253/50)**2)/1000 - 781/1000)/(Math.exp(GK/50 - 46/5) + 1) + 109/(125*(Math.exp(46/5 - GK/50) + 1)) + (Math.exp(GK/50 - 46/5)*(71*Math.tanh((11*GK)/1000 - 253/50) + 71))/(50*(Math.exp(GK/50 - 46/5) + 1)**2) + (Math.exp(46/5 - GK/50)*((109*GK)/125 + 330))/(50*(Math.exp(46/5 - GK/50) + 1)**2))/VGK
            rKGE=(330 + 0.872 * GK) * (1 / (1 + Math.exp(-0.01 * (GK - 460)))) + (71 + 71 * Math.tanh(0.011 * (GK - 460))) * (1. / (1 + Math.exp(0.01 * (GK - 460))));
            var f=(1/VGK)*(QGK*(GH-GK)-rKGE)
            GK=GK-f/df
            dGKdt=f;
        }
        




        let GG = GH - rGGU / QGG;
        let GBC = GH - (1 / QGB) * rBGU;
        let GBF = GBC - (TGB / VGBF) * rBGU;
        let GL = (1 / QGL) * (QGH * GH + rRBCU - QGB * GBC - QGK * GK - QGP * GPC);
        let rHGP = QGL * GL - QGA * GH - QGG * GG + rHGU;
        x['GBC'] = GBC; x['GBF'] = GBF; x['GH'] = GH; x['GG'] = GG;
        x['GL'] = GL; x['GK'] = GK; x['GPC'] = GPC; x['GPF'] = GPF;
        // Insulin basal values
        let t2 = Math.pow(QIP, 2),
            t3 = QIP * 6.0e+1,
            t4 = VIPF * 1.7e+1,
            t5 = IPF * QIP * TIP * 3.0,
            t8 = IPF * VIPF * 2.0e+1,
            t9 = IPF * QIP * -6.0e+1,
            t6 = -t4,
            t7 = IPF * t3,
            t12 = t5 + t8 + t9,
            t10 = t3 + t6,
            t11 = 1.0 / t10,
            t13 = t11 * t12,
            t14 = -t13;

        x['IB'] = t14;
        x['IH'] = t14;
        x['IG'] = t14;
        x['IL'] = (t11 * (IPF * t2 * -7.8e+2 - IPF * QIB * QIP * 7.8e+2 + IPF * QIH * QIP * 7.8e+2 - IPF * QIK * QIP * 6.0e+2 + IPF * QIB * VIPF * 2.6e+2 - IPF * QIH * VIPF * 2.6e+2 + IPF * QIK * VIPF * 2.0e+2 + IPF * QIP * VIPF * 2.21e+2 + IPF * QIB * QIP * TIP * 3.9e+1 - IPF * QIH * QIP * TIP * 3.9e+1 + IPF * QIK * QIP * TIP * 3.0e+1)) / (QIL * 1.3e+1);
        x['IK'] = t13 * (-1.0e+1 / 1.3e+1); x['IPC'] = -t11 * (t5 + t9 + IPF * t4); x['IPF'] = IPF;
        let rPIR = (t11 * (IPF * t2 * -3.9e+3 - IPF * QIA * QIP * 2.34e+3 - IPF * QIB * QIP * 3.9e+3 - IPF * QIG * QIP * 2.34e+3 + IPF * QIH * QIP * 3.9e+3 - IPF * QIK * QIP * 3.0e+3 + IPF * QIA * VIPF * 7.8e+2 + IPF * QIB * VIPF * 1.3e+3 + IPF * QIG * VIPF * 7.8e+2 - IPF * QIH * VIPF * 1.3e+3 + IPF * QIK * VIPF * 1.0e+3 + IPF * QIP * VIPF * 1.105e+3 + IPF * QIA * QIP * TIP * 1.17e+2 + IPF * QIB * QIP * TIP * 1.95e+2 + IPF * QIG * QIP * TIP * 1.17e+2 - IPF * QIH * QIP * TIP * 1.95e+2 + IPF * QIK * QIP * TIP * 1.5e+2)) / 3.9e+1;
        // Glucose absorption model:
        x['qss'] = 0;
        x['qsl'] = 0;
        x['qint'] = 0;
        // Metformin:
        x['MO1'] = 0; x['MO2'] = 0; x['MGl'] = 0; x['MGW'] = 0;
        x['ML'] = 0; x['MP'] = 0;
        // Vildagliptin:
        x['AG1'] = 0; x['AG2'] = 0; x['Ac'] = 0; x['Ap'] = 0;
        x['DRc'] = 0; x['DRp'] = 0;
        // Physical activity:
        x['E1'] = 0; x['E2'] = 0;
        // Fast acting insulin:
        x['Hfa'] = 0; x['Dfa'] = 0;
        // Long acting inslin:
        x['Bla'] = 0; x['Hla'] = 0; x['Dla'] = 0;
        // Pancreas: 
        let XG = Math.pow(x['GH'], 3.27) / (1.32 ** 3.27 + 5.93 * Math.pow(x['GH'], 3.02));
        let Pinft = Math.pow(XG, (1.11));
        let Y = Pinft;
        let R = XG;
        let ml = (kdmdpan + gammapan * Pinft) / (Kpan + N1 * Y);
        let S = N1 * Y * ml;
        x['ml'] = ml; x['P'] = Pinft; x['R'] = XG;
        //  Glucagon:
        x['Gamma'] = 1;
        //  GLP-1:
        x['psi'] = 0; x['PSI'] = 0;

        // Basal rates: 
        x['MIHGP'] = 1;
        x['fr'] = 0.0027;
        x['MIHGU'] = 1;
        let rates = { rPIR: rPIR, rBGU: rBGU, rRBCU: rRBCU, rGGU: rGGU, rPGU: rPGU, rHGP: rHGP, rHGU: rHGU };

        // Zero initial conditions: Seems like index number has been shifted by one e.g. x['XIinj'] is 53 not 54.
        x['De'] = 0; //47
        x['DNq'] = 100.0 * Number.EPSILON ** 0.5; //48
        x['TE'] = 0; //49
        x['XGC'] = 0; //50
        x['XGP'] = 0; //51
        x['XIC'] = 0; //52
        x['XIS'] = 0; //53
        x['XIinj'] = 0; //54
        x['Ila'] = 0;//55
        x['Ifa'] = 0;//56
        x['GHint'] = 0;//57

        x['qssGIH'] = 0;//58
        x['qslGIH'] = 0;//59
        x['qintGIH'] = 0;//60
        x['qssGIM'] = 0;//61
        x['qslGIM'] = 0;//62
        x['qintGIM'] = 0;//63
        x['qssGIL'] = 0;//64
        x['qslGIL'] = 0;//65
        x['qintGIL'] = 0;//66
        x['qssGIvL'] = 0;//67
        x['qslGIvL'] = 0;//68
        x['qintGIvL'] = 0;//69

        x["psih2"] = 0;
        x["PSIh2"] = 0;

        x["psih24"] = 0;
        x["PSIh24"] = 0;
        return { x: x, rates: rates, S: S };
    };
    Arr2Obj(x) {
        var a = {};
        for (let i = 0; i < this.keys.length; i++) {
            a[this.keys[i]] = x[i];
        }
        return a;
    }
    obj2Arr(x) {
        var a = new Array(this.keys.length);
        for (let i = 0; i < this.keys.length; i++) {
            a[i] = x[this.keys[i]];
        }
        return a;
    }
    // fode(_t, x, u, obj) {
    //     return this.obj2Arr(this.derivatives(_t, this.Arr2Obj(x), u, obj));
    // }
    // derivatives(_t, x, u, obj) {
    //     // this.ncalls['ode'] += 1;
    //     // this.ncalls['lu']+=1;
    //     //  this.ncalls['num_jac_']+=1;
    //     let basal = obj.Basal;
    //     let param = obj.Params;



    //     // Glucose absorption model: 
    //     let k12 = param.k12, Kq1 = param.Kq1, Kq2 = param.Kq2, kmin = param.kmin, kmax = param.kmax, kabs = param.kabs;
    //     let fg = param.fg;

    //     let k12GIH = param.k12GIH, kabsGIH = param.kabsGIH, k12GIM = param.k12GIM, kabsGIM = param.kabsGIM, k12GIL = param.k12GIL, kabsGIL = param.kabsGIL, k12GIvL = param.k12GIvL, kabsGIvL = param.kabsGIvL;

    //     // Metformin submodel:
    //     let kgo = param.kgo, kgg = param.kgg, kpg = param.kpg, kgl = param.kgl, kpl = param.kpl,
    //         klp = param.klp, vGWmax = param.vGWmax, vLmax = param.vLmax, vPmax = param.vPmax,
    //         nGW = param.nGW, nL = param.nL, nP = param.nP, phiGW50 = param.phiGW50,
    //         phiL50 = param.phiL50, phiP50 = param.phiP50, rhoO1 = param.rhoalpha, rhoO2 = param.rhobeta,
    //         alpham = param.alpham, betam = param.betam, kpo = param.kpo;

    //     // Vildagliptin submodel: 
    //     let ka1 = param.ka1, ka2 = param.ka2, CL = param.CL, CLic = param.CLic, Vc = param.Vc,
    //         Vp = param.Vp, RmaxC = param.RmaxC, kdvil = param.kvd, k2vil = param.k2v,
    //         koff = param.koff, RmaxP = param.RmaxP, kdeg = param.kdeg;

    //     // Physical activity model:
    //     let tHR = param.tHR, HRb = param.HRb, ne = param.ne, ae = param.ae, te = param.te,
    //         ce1 = param.ce1, ce2 = param.ce2;
    //     // Fast acting insulin:
    //     let pfa = param.pfa, rfa = param.rfa, qfa = param.qfa, bfa = param.bfa,
    //         kclf = param.kclf, sfa = param.sfa;

    //     // Long acting insulin:
    //     let pla = param.pla, rla = param.rla, qla = param.qla, bla = param.bla,
    //         Cmax = param.Cmax, kla = param.kla, kcll = param.kcll;

    //     // Pancreas submodel
    //     let zeta1 = param.zeta1, zeta2 = param.zeta2, kdmdpan = param.ml0 * param.Kl,
    //         Kpan = param.Ks, //Kpan
    //         gammapan = param.gammapan,
    //         alphapan = param.alphapan,
    //         betapan = param.betapan, N1 = param.N1, N2 = param.N2,
    //         KILLPAN = param.KILLPAN,
    //         Sfactor = param.Sfactor;
    //     // Insulin submodel:
    //     let VIB = param.VIB, VIH = param.VIH, QIB = param.QIB, QIL = param.QIL,
    //         QIK = param.QIK, QIP = param.QIP, QIH = param.QIH,
    //         QIG = param.QIG, VIG = param.VIG, VIL = param.VIL, QIA = param.QIA, VIK = param.VIK,
    //         VIPC = param.VIPC, VIPF = param.VIPF, TIP = param.TIP;


    //     // Glucose submodel:
    //     let VGBC = param.VGBC, QGB = param.QGB, VGBF = param.VGBF, TGB = param.TGB,
    //         VGH = param.VGH, QGL = param.QGL,
    //         QGK = param.QGK, QGP = param.QGP, QGH = param.QGH, VGG = param.VGG,
    //         QGG = param.QGG, VGL = param.VGL, QGA = param.QGA, VGK = param.VGK,
    //         VGPC = param.VGPC, VGPF = param.VGPF, TGP = param.TGP, alphae = param.alphae,
    //         betae = param.betae;

    //     // Glucagon submodel:
    //     let VGamma = param.VGamma;


    //     // GLP-1 submodel:
    //     let VPSI = param.VPSI, Kout = param.Kout, CF2 = param.CF2,
    //         tpsi = param.tpsi, kphi = param.zeta;

    //     // rates:
    //     let cIPGU = param.c1, cIHGPinft = param.c2,
    //         cGHGP = param.c3, cIHGUinft = param.c4, cGHGU = param.c5,
    //         dIPGU = param.d1, dIHGPinft = param.d2, dGHGP = param.d3,
    //         dIHGUinft = param.d4, dGHGU = param.d5,
    //         SHGP = param.SHGP,
    //         SHGU = param.SHGU,
    //         SPGU = param.SPGU;

    //     //  Extract states from state vector:
    //     // Glucose absorption model: 
    //     let qss = x["qss"], qsl = x["qsl"], qint = x["qint"],
    //         De = x["De"], DNq = x["DNq"];

    //     let qssGIH = x["qssGIH"], qslGIH = x["qslGIH"], qintGIH = x["qintGIH"],
    //         qssGIM = x["qssGIM"], qslGIM = x["qslGIM"], qintGIM = x["qintGIM"],
    //         qssGIL = x["qssGIL"], qslGIL = x["qslGIL"], qintGIL = x["qintGIL"],
    //         qssGIvL = x["qssGIvL"], qslGIvL = x["qslGIvL"], qintGIvL = x["qintGIvL"];

    //     //Metformin submodel:
    //     let MO1 = x["MO1"], MO2 = x["MO2"], MGl = x["MGl"], MGW = x["MGW"], ML = x["ML"],
    //         MP = x["MP"];

    //     //Vildagliptin submodel: 
    //     let AG1 = x["AG1"], AG2 = x["AG2"], Ac = x["Ac"], Ap = x["Ap"], DRc = x["DRc"],
    //         DRp = x["DRp"];

    //     //Physical activity model:
    //     let E1 = x["E1"], E2 = x["E2"],
    //         TE = x["TE"];
    //     //Fast acting insulin:
    //     let Hfa = x["Hfa"], Dfa = x["Dfa"], Ifa = x["Ifa"];

    //     // Long acting insulin:
    //     let Bla = x["Bla"], Hla = x["Hla"], Dla = x["Dla"], Ila = x["Ila"];

    //     // Pancreas submodel
    //     let ml = x["ml"], P = x["P"], R = x["R"];

    //     // Insulin submodel:
    //     let IB = x["IB"], IH = x["IH"], IG = x["IG"], IL = x["IL"], IK = x["IK"],
    //         IPC = x["IPC"], IPF = x["IPF"];

    //     // Glucose submodel:
    //     let GBC = x["GBC"], GBF = x["GBF"], GH = x["GH"], GG = x["GG"], GL = x["GL"],
    //         GK = x["GK"], GPC = x["GPC"], GPF = x["GPF"];

    //     // Glucagon submodel:
    //     let Gamma = x["Gamma"];

    //     // GLP-1 submodel:    
    //     let psi = x["psi"], PSI = x["PSI"];

    //     // rates:
    //     let MIHGP = x["MIHGP"];
    //     let fr = x["fr"];
    //     let MIHGU = x["MIHGU"];

    //     // Total glucose consumption: 
    //     let XGC = x["XGC"];
    //     // Total Glucose production and appearance: 
    //     let XGP = x["XGP"];
    //     // Total insulin consumption: 
    //     let XIC = x["XIC"];
    //     // Secreted inuslin: 
    //     let XIS = x["XIS"];
    //     // Injected insulin: 
    //     let XIinj = x["XIinj"];

    //     // Integrated hepatic glucose
    //     let GHint = x["GHint"];
    //     // Basal values and constant rates:
    //     let GBPF = basal.GPF, IBPF = basal.IPF, IBL = basal.IL, GBL = basal.GL,
    //         GammaB = basal.Gamma, SB = basal.SB, GBH = basal.GH, IBH = basal.IH, rBPIR = basal.rPIR, rBGU = basal.rBGU, rRBCU = basal.rRBCU, rGGU = basal.rGGU, rBPGU = basal.rPGU, rBHGP = basal.rHGP, rBHGU = basal.rHGU;
    //     // Glucose Absorption submodel

    //     // The model equations
    //     // declare vector of derivatives dx/dt
    //     let dx_dt = {};

    //     // Glucose Absorption submodel

    //     //The model equations
    //     let qssA = qss + qssGIH + qssGIM + qssGIL + qssGIvL;
    //     let qslA = qsl + qslGIH + qslGIM + qslGIL + qslGIvL;
    //     let qintA = qint + qintGIH + qintGIM + qintGIL + qintGIvL;
    //     dx_dt["De"] = kmin * De;
    //     dx_dt["DNq"] = kmin * (u.DgA - DNq);
    //     dx_dt["qss"] = -k12 * qss;
    //     // console.log('QA1=',DNq,Kq1)
    //     let QA1 = 5 / (2 * DNq * (1 - Kq1));
    //     let QA2 = 5 / (2 * DNq * Kq2);
    //     // console.log('kempt=',kmin,kmax,QA1,qssA,qslA,Kq1,DNq,QA2,Kq2)
    //     let kempt = kmin + ((kmax - kmin) / 2) * (Math.tanh(QA1 * (qssA + qslA - Kq1 * DNq)) - Math.tanh(QA2 * (qssA + qslA - Kq2 * DNq)) + 2);
    //     dx_dt["qsl"] = -kempt * qsl + k12 * qss;
    //     dx_dt["qint"] = -kabs * qint + kempt * qsl;

    //     //Glucose Absorption (High IG) submodel 
    //     dx_dt["qssGIH"] = -k12GIH * qssGIH;
    //     dx_dt["qslGIH"] = -kempt * qslGIH + k12GIH * qssGIH;
    //     dx_dt["qintGIH"] = -kabsGIH * qintGIH + kempt * qslGIH;

    //     //Glucose Absorption (Medium IG) submodel 
    //     dx_dt["qssGIM"] = -k12GIM * qssGIM;
    //     dx_dt["qslGIM"] = -kempt * qslGIM + k12GIM * qssGIM;
    //     dx_dt["qintGIM"] = -kabsGIM * qintGIM + kempt * qslGIM;

    //     //Glucose Absorption (Low IG) submodel 
    //     dx_dt["qssGIL"] = -k12GIL * qssGIL;
    //     dx_dt["qslGIL"] = -kempt * qslGIL + k12GIL * qssGIL;
    //     dx_dt["qintGIL"] = -kabsGIL * qintGIL + kempt * qslGIL;

    //     //Glucose Absorption (Very low IG) submodel 
    //     dx_dt["qssGIvL"] = -k12GIvL * qssGIvL;
    //     dx_dt["qslGIvL"] = -kempt * qslGIvL + k12GIvL * qssGIvL;
    //     dx_dt["qintGIvL"] = -kabsGIvL * qintGIvL + kempt * qslGIvL;

    //     let Ra = fg * kabs * qint + fg * kabsGIH * qintGIH + fg * kabsGIM * qintGIM + fg * kabsGIL * qintGIL + fg * kabsGIvL * qintGIvL;


    //     // Stress:
    //     // Stress is a parameter that takes values between 1 and 0.
    //     // It is defined as a vector of a sepcific time step for the simulation.
    //     // Therefore, it is necessary to interpolate it here:
    //     let stress = u.stressv; // interp1(0:obj.dt:(length(stressv)*obj.dt-obj.dt),stressv,t); %Interpolates (T,stressv) at time t

    //     // Metformin submodel: 

    //     // Model equations:
    //     dx_dt["MO1"] = -alpham * MO1;
    //     dx_dt["MO2"] = -betam * MO2;
    //     dx_dt["MGl"] = -(kgo + kgg) * MGl + rhoO1 * MO1 + rhoO2 * MO2;
    //     dx_dt["MGW"] = MGl * kgg + MP * kpg - MGW * kgl;
    //     dx_dt["ML"] = MGW * kgl + MP * kpl - ML * klp;
    //     dx_dt["MP"] = ML * klp - (kpl + kpg + kpo) * MP + MGl;

    //     let EGW = (vGWmax * Math.pow(MGW, nGW)) / (Math.pow(phiGW50, nGW) + Math.pow(MGW, nGW));
    //     let EL = (vLmax * Math.pow(ML, nL)) / (Math.pow(phiL50, nL) + Math.pow(ML, nL));
    //     let EP = (vPmax * Math.pow(MP, nP)) / (Math.pow(phiP50, nP) + Math.pow(MP, nP));

    //     // Vildagliptin submodel:
    //     // The model equations:
    //     dx_dt["AG1"] = -ka1 * AG1;
    //     dx_dt["AG2"] = ka1 * AG1 - ka2 * AG2;
    //     dx_dt["Ac"] = ka2 * AG2 - ((CL + CLic) / Vc) * Ac + (CLic / Vp) * Ap - ((RmaxC - DRc) * k2vil * (Ac / Vc)) / (kdvil + Ac / Vc) + koff * DRc;
    //     dx_dt["Ap"] = CLic * (Ac / Vc - Ap / Vp) - ((RmaxP - DRp) * k2vil * (Ap / Vp)) / (kdvil + Ap / Vp) + koff * DRp;
    //     dx_dt["DRc"] = (RmaxC - DRc) * k2vil * (Ac / Vc) / (kdvil + Ac / Vc) - (koff - kdeg) * DRc;
    //     dx_dt["DRp"] = (RmaxP - DRp) * k2vil * (Ap / Vp) / (kdvil + Ap / Vp) - (koff + kdeg) * DRp;


    //     // GLP-1 agonists 

    //     //(Daily GLP-1):
    //     dx_dt["psih2"] = -param.ah2 * x["psih2"];
    //     dx_dt["PSIh2"] = param.bh2 * param.ah2 * x["psih2"] - param.bh2 * x["PSIh2"];

    //     //(Weekly GLP-1):
    //     dx_dt["psih24"] = -param.ah24 * x["psih24"];
    //     dx_dt["PSIh24"] = param.bh24 * param.ah24 * x["psih24"] - param.bh24 * x["PSIh24"];
    //     // Physical activity submodel
    //     let HR = u.HRv; // interp1(0:obj.dt:(length(HRv)*obj.dt-obj.dt),HRv,t); %Interpolates (T,HRv) at time t
    //     // The model equations:
    //     dx_dt["E1"] = (1 / tHR) * (HR - HRb - E1);
    //     let gE = Math.pow(E1 / (ae * HRb), ne) / (1 + Math.pow(E1 / (ae * HRb), ne));
    //     dx_dt["TE"] = (1 / te) * (ce1 * gE + ce2 - TE);
    //     // dE2  =  -(gE+1/TE)*E2+(gE*TE)/(ce1+ce2);
    //     dx_dt["E2"] = -(gE + 1 / te) * E2 + gE;

    //     // Glucose submodel rates: 

    //     let MIPGU = (7.03 + SPGU * 6.52 * Math.tanh(cIPGU * (IPF / IBPF - dIPGU))) / (7.03 + SPGU * 6.52 * Math.tanh(cIPGU * (1 - dIPGU)));

    //     let MGPGU = GPF / GBPF;

    //     let rPGU = MIPGU * MGPGU * rBPGU;


    //     let MIHGPinft = (1.21 - SHGP * 1.14 * Math.tanh(cIHGPinft * (IL / IBL - dIHGPinft))) / (1.21 - SHGP * 1.14 * Math.tanh(cIHGPinft * (1 - dIHGPinft)));

    //     let MGHGP = (1.42 - 1.41 * Math.tanh(cGHGP * (GL / GBL - dGHGP))) / (1.42 - 1.41 * Math.tanh(cGHGP * (1 - dGHGP)));

    //     let MgammaHGP = 2.7 * Math.tanh(0.39 * Gamma / GammaB) - fr;

    //     let rHGP = MIHGP * MGHGP * MgammaHGP * rBHGP;

    //     let MIHGUinft = (Math.tanh(cIHGUinft * (IL / IBL - dIHGUinft))) / (Math.tanh(cIHGUinft * (1 - dIHGUinft)));

    //     let MGHGU = (5.66 + 5.66 * Math.tanh(cGHGU * (GL / GBL - dGHGU))) / (5.66 + 5.66 * Math.tanh(cGHGU * (1 - dGHGU)));

    //     let rHGU = MIHGU * MGHGU * rBHGU;

    //     let rKGE = 330;
    //     // if (GK>=460){
    //     //     rKGE = 330+0.872*GK;
    //     // }
    //     // else{
    //     //     rKGE = 71+71*Math.tanh(0.011*(GK-460));
    //     // }
    //     rKGE = (330 + 0.872 * GK) * (1 / (1 + Math.exp(-0.01 * (GK - 460)))) + (71 + 71 * Math.tanh(0.011 * (GK - 460))) * (1. / (1 + Math.exp(0.01 * (GK - 460))));
    //     // Effect of Metformin:
    //     rHGP = rHGP * (1 - EL);
    //     rGGU = rGGU * (1 + EGW);
    //     rPGU = rPGU * (1 + EP);
    //     //  Rates dynamic model

    //     dx_dt["MIHGP"] = 0.04 * (MIHGPinft - MIHGP);
    //     dx_dt["fr"] = 0.0154 * (0.5 * (2.7 * Math.tanh(0.39 * Gamma / GammaB) - 1) - fr);
    //     dx_dt["MIHGU"] = 0.04 * (MIHGUinft - MIHGU);

    //     //  Glucose submodel:
    //     // +564.4444
    //     dx_dt["GBC"] = (1 / VGBC) * (QGB * (GH - GBC) - (VGBF / TGB) * (GBC - GBF));
    //     dx_dt["GBF"] = (1 / VGBF) * ((VGBF / TGB) * (GBC - GBF) - rBGU);
    //     dx_dt["GH"] = (1 / VGH) * (QGB * GBC + QGL * GL + QGK * GK + QGP * GPC - QGH * GH - rRBCU);
    //     // console.log(x)
    //     dx_dt["GG"] = (1 / VGG) * (QGG * (GH - GG) - rGGU + Ra);
    //     dx_dt["GL"] = (1 / VGL) * (QGA * GH + QGG * GG - QGL * GL + ((1 + stress) * (1 - alphae * E2) * rHGP - (1 + alphae * E2) * rHGU));
    //     dx_dt["GK"] = (1 / VGK) * (QGK * (GH - GK) - rKGE);
    //     dx_dt["GPC"] = (1 / VGPC) * (QGP * (GH - GPC) - (VGPF / TGP) * (GPC - GPF));
    //     dx_dt["GPF"] = (1 / VGPF) * ((VGPF / TGP) * (GPC - (1 + betae * E1) * GPF) - (1 + alphae * E2) * rPGU);
    //     dx_dt["XGC"] = (rBGU) + rRBCU + rGGU + (1 + alphae * E2) * rHGU + rKGE + betae * E1 * GPF * QGP + (1 + alphae * E2) * rPGU;
    //     dx_dt["XGP"] = Ra + (1 + stress) * (1 - alphae * E2) * rHGP;
    //     dx_dt["GHint"] = GH;
    //     // Glucagon submodel:

    //     // Basal values: 
    //     let rBPGammaR = 9.1;

    //     let MGPGammaR = 1.31 - 0.61 * Math.tanh(1.06 * ((GH / GBH) - 0.47));
    //     let MIPGammaR = 2.93 - 2.09 * Math.tanh(4.18 * ((IH / IBH) - 0.62));

    //     let rPGammaR = MGPGammaR * MIPGammaR * rBPGammaR;

    //     dx_dt["Gamma"] = (1 / VGamma) * ((1 + stress) * rPGammaR - 9.1 * Gamma);

    //     // GLP-1 submodel
    //     // console.log('dx_dt["psi"] =',kphi,kempt,qslA,psi,tpsi)
    //     dx_dt["psi"] = kphi * kempt * qslA - psi / tpsi;
    //     dx_dt["PSI"] = (1 / VPSI) * (psi / tpsi - (Kout + (RmaxC - DRc) * CF2) * PSI);

    //     // Pancreas submodel

    //     // The model equations:
    //     // 1.32**3.27 = 2.4790
    //     let XG = Math.pow(GH, 3.27) / (2.4790 + 5.93 * Math.pow(GH, 3.02));
    //     let Pinft = Math.pow(XG, 1.11) + zeta1 * (PSI + param.ch24 * x["PSIh24"] + param.ch2 * x["PSIh2"]);
    //     let Y = Pinft;

    //     // let S = Sfactor;
    //     // if (XG>R){
    //     //     S = Sfactor*ml*(N1*Y+N2*(XG-R)+zeta2*PSI);
    //     // }
    //     // else{
    //     //     S = Sfactor*ml*(N1*Y+zeta2*PSI);
    //     // }
    //     let S = Sfactor * ml * ((N1 * Y + zeta2 * (PSI + param.ch24 * x["PSIh24"] + param.ch2 * x["PSIh2"])) * (1 / (1 + Math.exp(0.5 * (XG - R)))) + (N1 * Y + N2 * (XG - R) + zeta2 * (PSI + param.ch24 * x["PSIh24"] + param.ch2 * x["PSIh2"])) * (1 / (1 + Math.exp(-0.5 * (XG - R)))));
    //     // let S=Sfactor*ml*((N1*Y+zeta2*(PSI+      ch24*   PSIh24  +      ch2*   PSIh2  )).*(1./(1+     exp(0.5*(XG-R))))+(N1*Y+N2*(XG-R)+zeta2*(PSI+      ch24*   PSIh24  +      ch2*   PSIh2  )).*(1./(1+     exp(-0.5*(XG-R)))));

    //     dx_dt["ml"] = kdmdpan - Kpan * ml + gammapan * P - S;
    //     dx_dt["P"] = alphapan * (Pinft - P);
    //     dx_dt["R"] = betapan * (XG - R);

    //     // Insulin submodel rates:
    //     let rPIR = (S / SB) * rBPIR;
    //     let rLIC = 0.4 * (QIA * IH + QIG * IG + rPIR);
    //     let rKIC = 0.3 * QIK * IK;
    //     let rPIC = IPF / ((0.85) / (0.15 * QIP) - 20 / VIPF);
    //     // Long-acting Insulin:

    //     // Model equations:
    //     dx_dt["Bla"] = -kla * Bla * (Cmax / (1 + Hla));
    //     dx_dt["Hla"] = -pla * (Hla - qla * Math.pow(Dla, 3)) + kla * Bla * (Cmax / (1 + Hla));
    //     dx_dt["Dla"] = pla * (Hla - qla * Math.pow(Dla, 3)) - bla * Dla / (1 + Ila);
    //     dx_dt["Ila"] = rla * bla * Dla / (1 + (Ila)) - kcll * (Ila);
    //     // Fast-acting Insulin 

    //     // Model equations:
    //     dx_dt["Hfa"] = -pfa * (Hfa - qfa * Math.pow(Dfa, 3));
    //     dx_dt["Dfa"] = pfa * (Hfa - qfa * Math.pow(Dfa, 3)) - bfa * Dfa / (1 + Ifa);
    //     dx_dt["Ifa"] = rfa * bfa * Dfa / (1 + (Ifa)) - kclf * (Ifa);
    //     // Insulin submodel: 

    //     // Model equations:
    //     dx_dt["IB"] = (QIB / VIB) * (IH - IB);
    //     dx_dt["IH"] = (1 / VIH) * (QIB * IB + QIL * IL + QIK * IK + QIP * IPF - QIH * IH);
    //     dx_dt["IG"] = (QIG / VIG) * (IH - IG);
    //     dx_dt["IL"] = (1 / VIL) * (QIA * IH + QIG * IG - QIL * IL + (1 - stress) * rPIR - rLIC);
    //     dx_dt["IK"] = (1 / VIK) * (QIK * (IH - IK) - rKIC);
    //     dx_dt["IPC"] = (1 / VIPC) * (QIP * (IH - IPC) - (VIPF / TIP) * (IPC - IPF)) + 10 * Ifa + 10 * Ila;
    //     dx_dt["IPF"] = (1 / VIPF) * ((VIPF / TIP) * (IPC - IPF) - rPIC);
    //     dx_dt["XIC"] = rLIC + rKIC + rPIC;
    //     dx_dt["XIS"] = (1 - stress) * rPIR;
    //     dx_dt["XIinj"] = VIPF * rla * bla * Dla / (1 + IPF) + VIPF * rfa * bfa * Dfa / (1 + IPF);

    //     return dx_dt;
    // };
    /**
     * 
     * @param {Array<number>} _t 
     * @param {Array<Array<number>>} x, rows are states collumns are different state vectors, i.e. x[2]=[GH1,GH2,..]
     * @param {Object} u 
     * @param {Object} obj 
     * @returns Array<Array<number>> f, i.e. f[i]=[dxi1_dt,dxi2_dt,..]
     */
    fode(_t, x, u, obj) {
        this.ncalls['fode'] = this.ncalls['fode'] ? this.ncalls['fode'] + 1 : 1;
        // this.ncalls['lu']+=1;
        //  this.ncalls['num_jac_']+=1;
        let basal = obj.Basal;
        let param = obj.Params;
        let n = this.n;
        let m = x[0].length;


        // Glucose absorption model: 
        const k12 = param.k12, Kq1 = param.Kq1, Kq2 = param.Kq2, kmin = param.kmin, kmax = param.kmax, kabs = param.kabs;
        const fg = param.fg;

        const k12GIH = param.k12GIH, kabsGIH = param.kabsGIH, k12GIM = param.k12GIM, kabsGIM = param.kabsGIM, k12GIL = param.k12GIL, kabsGIL = param.kabsGIL, k12GIvL = param.k12GIvL, kabsGIvL = param.kabsGIvL;

        // Metformin submodel:
        const kgo = param.kgo, kgg = param.kgg, kpg = param.kpg, kgl = param.kgl, kpl = param.kpl,
            klp = param.klp, vGWmax = param.vGWmax, vLmax = param.vLmax, vPmax = param.vPmax,
            nGW = param.nGW, nL = param.nL, nP = param.nP, phiGW50 = param.phiGW50,
            phiL50 = param.phiL50, phiP50 = param.phiP50, rhoO1 = param.rhoalpha, rhoO2 = param.rhobeta,
            alpham = param.alpham, betam = param.betam, kpo = param.kpo;
        const phiGW50_nGW = Math.pow(phiGW50, nGW), phiL50_nL = Math.pow(phiL50, nL), phiP50_nP = Math.pow(phiP50, nP);
        // Vildagliptin submodel: 
        const ka1 = param.ka1, ka2 = param.ka2, CL = param.CL, CLic = param.CLic, Vc = param.Vc,
            Vp = param.Vp, RmaxC = param.RmaxC, kdvil = param.kvd, k2vil = param.k2v,
            koff = param.koff, RmaxP = param.RmaxP, kdeg = param.kdeg;
        const CLCLicVc = ((CL + CLic) / Vc)
        const CLicVp = (CLic / Vp);
        // Physical activity model:
        const tHR = param.tHR, HRb = param.HRb, ne = param.ne, ae = param.ae, te = param.te,
            ce1 = param.ce1, ce2 = param.ce2;
        const tHR_1 = (1 / tHR);
        // Fast acting insulin:
        const pfa = param.pfa, rfa = param.rfa, qfa = param.qfa, bfa = param.bfa,
            kclf = param.kclf, sfa = param.sfa;

        // Long acting insulin:
        const pla = param.pla, rla = param.rla, qla = param.qla, bla = param.bla,
            Cmax = param.Cmax, kla = param.kla, kcll = param.kcll;

        // Pancreas submodel
        const zeta1 = param.zeta1, zeta2 = param.zeta2, kdmdpan = param.ml0 * param.Kl,
            Kpan = param.Ks, //Kpan
            gammapan = param.gammapan,
            alphapan = param.alphapan,
            betapan = param.betapan, N1 = param.N1, N2 = param.N2,
            KILLPAN = param.KILLPAN,
            Sfactor = param.Sfactor;
        // Insulin submodel:
        const VIB = param.VIB, VIH = param.VIH, QIB = param.QIB, QIL = param.QIL,
            QIK = param.QIK, QIP = param.QIP, QIH = param.QIH,
            QIG = param.QIG, VIG = param.VIG, VIL = param.VIL, QIA = param.QIA, VIK = param.VIK,
            VIPC = param.VIPC, VIPF = param.VIPF, TIP = param.TIP;


        // Glucose submodel:
        const VGBC = param.VGBC, QGB = param.QGB, VGBF = param.VGBF, TGB = param.TGB,
            VGH = param.VGH, QGL = param.QGL,
            QGK = param.QGK, QGP = param.QGP, QGH = param.QGH, VGG = param.VGG,
            QGG = param.QGG, VGL = param.VGL, QGA = param.QGA, VGK = param.VGK,
            VGPC = param.VGPC, VGPF = param.VGPF, TGP = param.TGP, alphae = param.alphae,
            betae = param.betae;

        // Glucagon submodel:
        const VGamma = param.VGamma;


        // GLP-1 submodel:
        const VPSI = param.VPSI, Kout = param.Kout, CF2 = param.CF2,
            tpsi = param.tpsi, kphi = param.zeta;

        // rates:
        const cIPGU = param.c1, cIHGPinft = param.c2,
            cGHGP = param.c3, cIHGUinft = param.c4, cGHGU = param.c5,
            dIPGU = param.d1, dIHGPinft = param.d2, dGHGP = param.d3,
            dIHGUinft = param.d4, dGHGU = param.d5,
            SHGU = param.SHGU,
            SPGU = param.SPGU,
            SHGP = param.SHGP*(0.3/(1+Math.exp(-20*(SPGU-0.5)))+0.7);
            

        //  Extract states from state vector:
        // Glucose absorption model: 
        // let qss=x["qss"], qsl=x["qsl"], qint=x["qint"],
        //     De=x["De"], DNq=x["DNq"];    

        // let qssGIH=x["qssGIH"], qslGIH=x["qslGIH"], qintGIH=x["qintGIH"],
        //     qssGIM=x["qssGIM"], qslGIM=x["qslGIM"], qintGIM=x["qintGIM"],
        //     qssGIL=x["qssGIL"], qslGIL=x["qslGIL"], qintGIL=x["qintGIL"],
        //     qssGIvL=x["qssGIvL"], qslGIvL=x["qslGIvL"], qintGIvL=x["qintGIvL"];

        // //Metformin submodel:
        // let MO1=x["MO1"], MO2=x["MO2"], MGl=x["MGl"], MGW=x["MGW"], ML=x["ML"],
        //     MP=x["MP"];

        // //Vildagliptin submodel: 
        // let AG1=x["AG1"], AG2=x["AG2"], Ac=x["Ac"], Ap=x["Ap"], DRc=x["DRc"],
        //     DRp=x["DRp"];

        // //Physical activity model:
        // let E1=x["E1"], E2=x["E2"],
        //     TE=x["TE"];
        // //Fast acting insulin:
        // let Hfa=x["Hfa"], Dfa=x["Dfa"], Ifa = x["Ifa"];

        // // Long acting insulin:
        // let Bla= x["Bla"], Hla= x["Hla"], Dla= x["Dla"], Ila = x["Ila"];

        // // Pancreas submodel
        // let ml= x["ml"], P= x["P"], R= x["R"];

        // // Insulin submodel:
        // let IB= x["IB"],   IH= x["IH"], IG= x["IG"], IL= x["IL"], IK= x["IK"],
        //     IPC= x["IPC"], IPF= x["IPF"];

        // // Glucose submodel:
        // let GBC= x["GBC"], GBF= x["GBF"], GH= x["GH"], GG= x["GG"], GL= x["GL"],
        //     GK= x["GK"], GPC= x["GPC"], GPF= x["GPF"];

        // // Glucagon submodel:
        // let Gamma= x["Gamma"];

        // // GLP-1 submodel:    
        // let psi= x["psi"], PSI= x["PSI"];

        // // rates:
        // let MIHGP= x["MIHGP"];
        // let fr= x["fr"];
        // let MIHGU= x["MIHGU"];

        // // Total glucose consumption: 
        // let XGC = x["XGC"];
        // // Total Glucose production and appearance: 
        // let XGP = x["XGP"];
        // // Total insulin consumption: 
        // let XIC = x["XIC"];
        // // Secreted inuslin: 
        // let XIS = x["XIS"];
        // // Injected insulin: 
        // let XIinj = x["XIinj"];

        // // Integrated hepatic glucose
        // let GHint = x["GHint"];
        // Basal values and constant rates:
        const GBPF = basal.GPF, IBPF = basal.IPF, IBL = basal.IL, GBL = basal.GL,
            GammaB = basal.Gamma, SB = basal.SB, GBH = basal.GH, IBH = basal.IH, rBPIR = basal.rPIR, rBGU = basal.rBGU, rRBCU = basal.rRBCU;
        let rGGU = basal.rGGU;
        const rBPGU = basal.rPGU, rBHGP = basal.rHGP, rBHGU = basal.rHGU;
        // Glucose Absorption submodel

        // The model equations
        // declare vector of derivatives dx/dt
        let dx_dt = new Array(n);
        // for (let i = 0; i < n; i++)
        //     dx_dt[i] = new Array(m);

        // Glucose Absorption submodel

        //The model equations

        // let qintA = qint + qintGIH + qintGIM + qintGIL + qintGIvL; 
        // dx_dt["De"] = -kmin*De;
        dx_dt[46] = -kmin * x[46]; //x[46]=De
        // dx_dt["DNq"] = kmin*(u.DgA-DNq);
        dx_dt[47] = kmin * (x[46] - x[47]); // x[47]=DNq
        // dx_dt["qss"] = -k12*qss;
        dx_dt[15] = -k12 * x[15]; // x[15]=qss
        // console.log('QA1=',DNq,Kq1)

        // console.log('kempt=',kmin,kmax,QA1,qssA,qslA,Kq1,DNq,QA2,Kq2)
        // let kempt = new Array(m);
        const temp_c = kmin + ((kmax - kmin) / 2);
        let QA1 = 5 / (2 * x[47] * (1 - Kq1));
        let QA2 = 5 / (2 * x[47] * Kq2);
        let qssA = x[15] + x[57] + x[60] + x[63] + x[66];
        let qslA = x[16] + x[58] + x[61] + x[64] + x[67];
        let kempt = temp_c * (Math.tanh(QA1 * (qssA + qslA - Kq1 * x[47])) - Math.tanh(QA2 * (qssA + qslA - Kq2 * x[47])) + 2);
        //let kemptH = temp_c * (Math.tanh(QA1 * (x[57] + x[58] - Kq1 * x[47])) - Math.tanh(QA2 * (x[57] + x[58] - Kq2 * x[47])) + 2);
        //let kemptM = temp_c * (Math.tanh(QA1 * (x[60] + x[61] - Kq1 * x[47])) - Math.tanh(QA2 * (x[60] + x[61] - Kq2 * x[47])) + 2);
        dx_dt[16] = -kempt * x[16] + k12 * x[15];
        dx_dt[17] = -kabs * x[17] + kempt * x[16];

        //Glucose Absorption (High IG) submodel 
        dx_dt[57] = -k12GIH * x[57];
        dx_dt[58] = -kempt * x[58] + k12GIH * x[57];
        dx_dt[59] = -kabsGIH * x[59] + kempt * x[58];

        //Glucose Absorption (Medium IG) submodel 
        dx_dt[60] = -k12GIM * x[60];
        dx_dt[61] = -kempt * x[61] + k12GIM * x[60];
        dx_dt[62] = -kabsGIM * x[62] + kempt * x[61];

        //Glucose Absorption (Low IG) submodel 
        dx_dt[63] = -k12GIL * x[63];
        dx_dt[64] = -kempt * x[64] + k12GIL * x[63];
        dx_dt[65] = -kabsGIL * x[65] + kempt * x[64];

        //Glucose Absorption (Very low IG) submodel 
        dx_dt[66] = -k12GIvL * x[66];
        dx_dt[67] = -kempt * x[67] + k12GIvL * x[66];
        dx_dt[68] = -kabsGIvL * x[68] + kempt * x[67];

        let Ra = fg * (kabs * x[17] + kabsGIH * x[59] + kabsGIM * x[62] + kabsGIL * x[65] + kabsGIvL * x[68]);


        // Stress:
        // Stress is a parameter that takes values between 1 and 0.
        // It is defined as a vector of a sepcific time step for the simulation.
        // Therefore, it is necessary to interpolate it here:
        let stress = param.fStress*u.stressv; // interp1(0:obj.dt:(length(stressv)*obj.dt-obj.dt),stressv,t); %Interpolates (T,stressv) at time t

        // Metformin submodel: 

        // Model equations:
        dx_dt[18] = -alpham * x[18];
        dx_dt[19] = -betam * x[19];
        dx_dt[20] = -(kgo + kgg) * x[20] + rhoO1 * x[18] + rhoO2 * x[19];
        dx_dt[21] = x[20] * kgg + x[23] * kpg - x[21] * kgl;
        dx_dt[22] = x[21] * kgl + x[23] * kpl - x[22] * klp;
        dx_dt[23] = x[22] * klp - (kpl + kpg + kpo) * x[23] + x[20];
        // dx_dt["MO1"] = -alpham * MO1;
        // dx_dt["MO2"] = -betam * MO2;
        // dx_dt["MGl"] = -(kgo + kgg) * MGl + rhoO1 * MO1 + rhoO2 * MO2;
        // dx_dt["MGW"] = MGl * kgg + MP * kpg - MGW * kgl;
        // dx_dt["ML"] = MGW * kgl + MP * kpl - ML * klp;
        // dx_dt["MP"] = ML * klp - (kpl + kpg + kpo) * MP + MGl;
        const MGW_nGW = Math.pow(x[21], nGW);
        let EGW = (vGWmax * MGW_nGW) / (phiGW50_nGW + MGW_nGW);
        const ML_nL = Math.pow(x[22], nL)
        let EL = (vLmax * ML_nL) / (phiL50_nL + ML_nL);
        const MGl_nP = Math.pow(x[20], nP);
        let EP = (vPmax * MGl_nP) / (phiP50_nP + MGl_nP);

        // Vildagliptin submodel:
        // The model equations:
        dx_dt[24] = -ka1 * x[24];
        dx_dt[25] = ka1 * x[24] - ka2 * x[25];

        dx_dt[26] = ka2 * x[25] - CLCLicVc * x[26] + CLicVp * x[27] - ((RmaxC - x[28]) * k2vil * (x[26] / Vc)) / (kdvil + x[26] / Vc) + koff * x[28];
        dx_dt[27] = CLic * (x[26] / Vc - x[27] / Vp) - ((RmaxP - x[29]) * k2vil * (x[27] / Vp)) / (kdvil + x[27] / Vp) + koff * x[29];
        dx_dt[28] = (RmaxC - x[28]) * k2vil * (x[26] / Vc) / (kdvil + x[26] / Vc) - (koff - kdeg) * x[28];
        dx_dt[29] = (RmaxP - x[29]) * k2vil * (x[27] / Vp) / (kdvil + x[27] / Vp) - (koff + kdeg) * x[29];


        // GLP-1 agonists 

        //(Daily GLP-1):
        dx_dt[69] = -param.ah2 * x[69];
        dx_dt[70] = param.bh2 * param.ah2 * x[69] - param.bh2 * x[70];

        //(Weekly GLP-1):
        dx_dt[71] = -param.ah24 * x[71];
        dx_dt[72] = param.bh24 * param.ah24 * x[71] - param.bh24 * x[72];
        // Physical activity submodel
        let HR = u.HRv; // interp1(0:obj.dt:(length(HRv)*obj.dt-obj.dt),HRv,t); %Interpolates (T,HRv) at time t
        // The model equations:
        dx_dt[30] = tHR_1 * (HR - HRb - x[30]);
        const E1_aeHRb_ne = Math.pow(x[30] / (ae * HRb), ne)
        const gE = E1_aeHRb_ne / (1 + E1_aeHRb_ne);
        dx_dt[48] = (1 / te) * (ce1 * gE + ce2 - x[48]);
        // dE2  =  -(gE+1/x[48])*E2+(gE*x[48])/(ce1+ce2);
        dx_dt[31] = -(gE + 1 / te) * x[31] + gE;

        // Glucose submodel rates: 

        let MIPGU = (7.03 + SPGU * 6.52 * Math.tanh(cIPGU * (x[14] / IBPF - dIPGU))) / (7.03 + SPGU * 6.52 * Math.tanh(cIPGU * (1 - dIPGU)));

        let MGPGU = x[7] / GBPF;

        let rPGU = MIPGU * MGPGU * rBPGU;


        let MIHGPinft = (1.21 - SHGP * 1.14 * Math.tanh(cIHGPinft * (x[11] / IBL - dIHGPinft))) / (1.21 - SHGP * 1.14 * Math.tanh(cIHGPinft * (1 - dIHGPinft)));

        let MGHGP = (1.42 - 1.41 * Math.tanh(cGHGP * (x[4] / GBL - dGHGP))) / (1.42 - 1.41 * Math.tanh(cGHGP * (1 - dGHGP)));

        let MgammaHGP = 2.7 * Math.tanh(0.39 * x[40] / GammaB) - x[44];

        let rHGP = x[43] * MGHGP * MgammaHGP * rBHGP;

        let MIHGUinft = (Math.tanh(cIHGUinft * (x[11] / IBL - dIHGUinft))) / (Math.tanh(cIHGUinft * (1 - dIHGUinft)));

        let MGHGU = (5.66 + 5.66 * Math.tanh(cGHGU * (x[4] / GBL - dGHGU))) / (5.66 + 5.66 * Math.tanh(cGHGU * (1 - dGHGU)));

        let rHGU = x[45] * MGHGU * rBHGU;

        // let rKGE = 330;
        // if (GK>=460){
        //     rKGE = 330+0.872*GK;
        // }
        // else{
        //     rKGE = 71+71*Math.tanh(0.011*(GK-460));
        // }
        const rKGE = (330 + 0.872 * x[5]) * (1 / (1 + Math.exp(-0.01 * (x[5] - 460)))) + (71 + 71 * Math.tanh(0.011 * (x[5] - 460))) * (1. / (1 + Math.exp(0.01 * (x[5] - 460))));
        // Effect of Metformin:
        rHGP = rHGP * (1 - EL);
        rGGU = rGGU * (1 + EGW);
        rPGU = rPGU * (1 + EP);
        //  Rates dynamic model

        dx_dt[43] = param.tauMIHGP * (MIHGPinft - x[43]);
        dx_dt[44] = param.taufr * (0.5 * (2.7 * Math.tanh(0.39 * x[40] / GammaB) - 1) - x[44]);
        dx_dt[45] = param.tauMIHGU * (MIHGUinft - x[45]);

        //  Glucose submodel:
        // +564.4444
        dx_dt[0] = (1 / VGBC) * (QGB * (x[2] - x[0]) - (VGBF / TGB) * (x[0] - x[1]));
        dx_dt[1] = (1 / VGBF) * ((VGBF / TGB) * (x[0] - x[1]) - rBGU);
        dx_dt[2] = (1 / VGH) * (QGB * x[0] + QGL * x[4] + QGK * x[5] + QGP * x[6] - QGH * x[2] - rRBCU);
        // console.log(x)
        dx_dt[3] = (1 / VGG) * (QGG * (x[2] - x[3]) - rGGU + Ra);
        dx_dt[4] = (1 / VGL) * (QGA * x[2] + QGG * x[3] - QGL * x[4] + ((1 + stress) * (1 - alphae * x[31]) * rHGP - (1 + alphae * x[31]) * rHGU));
        dx_dt[5] = (1 / VGK) * (QGK * (x[2] - x[5]) - rKGE);
        dx_dt[6] = (1 / VGPC) * (QGP * (x[2] - x[6]) - (VGPF / TGP) * (x[6] - x[7]));
        dx_dt[7] = (1 / VGPF) * ((VGPF / TGP) * (x[6] - (1 + betae * x[30]) * x[7]) - (1 + alphae * x[31]) * rPGU);
        dx_dt[49] = (rBGU) + rRBCU + rGGU + (1 + alphae * x[31]) * rHGU + rKGE + betae * x[30] * x[7] * QGP + (1 + alphae * x[31]) * rPGU;
        dx_dt[50] = Ra + (1 + 
            stress) * (1 - alphae * x[31]) * rHGP;
        dx_dt[56] = x[2];
        // Glucagon submodel:

        // Basal values: 
        let rBPGammaR = 9.1;

        let MGPGammaR = 1.31 - 0.61 * Math.tanh(1.06 * ((x[2] / GBH) - 0.47));
        let MIPGammaR = 2.93 - 2.09 * Math.tanh(4.18 * ((x[9] / IBH) - 0.62));

        let rPGammaR = MGPGammaR * MIPGammaR * rBPGammaR;

        dx_dt[40] = (1 / VGamma) * ((1 + stress) * rPGammaR - 9.1 * x[40]);

        // GLP-1 submodel
        // console.log('dx_dt["psi"] =',kphi,kempt,qslA,psi,tpsi)
        dx_dt[41] = kphi * kempt * qslA - x[41] / tpsi;
        dx_dt[42] = (1 / VPSI) * (x[41] / tpsi - (Kout + (RmaxC - x[28]) * CF2) * x[42]);

        // Pancreas submodel

        // The model equations:
        // 1.32**3.27 = 2.4790
        let XG = Math.pow(x[2], 3.27) / (2.4790 + 5.93 * Math.pow(x[2], 3.02));
        let Barx = 1-1/(1+(1/100)*Math.exp(100*(0.055*x[2]-5)));
        let Bardx = 1-1/(1+(1/2)*Math.exp(2*(dx_dt[2]-0.0001)));

        let XG11=Math.pow(XG, 1.11)
        
        let Pinft = XG11 + zeta1 * (x[42] + (Bardx*Barx*param.ch24*param.zetae*XG11)*x[72]  + (Bardx*Barx*param.ch2*param.zetae*XG11) * x[70]);
        let Y = Pinft;

        // let S = Sfactor;
        // if (XG>R){
        //     S = Sfactor*ml*(N1*Y+N2*(XG-R)+zeta2*x[42]);
        // }
        // else{
        //     S = Sfactor*ml*(N1*Y+zeta2*x[42]);
        // }
        let agoasdgjkhb=(param.ch24*param.zetae*N1*Y)*x[72]+(param.ch2*param.zetae*N1*Y)*x[70];
        let S = Sfactor * x[37] * ((N1 * Y + zeta2 * (x[42] + Bardx*Barx*agoasdgjkhb)) * (1 / (1 + Math.exp(0.5 * (XG - x[39])))) + (N1 * Y + N2 * (XG - x[39]) + zeta2 * (x[42] + Bardx*Barx*agoasdgjkhb)) * (1 / (1 + Math.exp(-0.5 * (XG - x[39])))));
        // let S=Sfactor*ml*((N1*Y+zeta2*(x[42]+      ch24*   PSIh24  +      ch2*   PSIh2  )).*(1./(1+     exp(0.5*(XG-x[39]))))+(N1*Y+N2*(XG-x[39])+zeta2*(x[42]+      ch24*   PSIh24  +      ch2*   PSIh2  )).*(1./(1+     exp(-0.5*(XG-x[39])))));

        dx_dt[37] = kdmdpan - Kpan * x[37] + gammapan * x[38] - S;
        dx_dt[38] = alphapan * (Pinft - x[38]);
        dx_dt[39] = betapan * (XG - x[39]);

        // Insulin submodel rates:
        let rPIR = (S / SB) * rBPIR;
        let rLIC = 0.4 * (QIA * x[9] + QIG * x[10] + rPIR);
        let rKIC = 0.3 * QIK * x[12];
        let rPIC = x[14] / ((0.85) / (0.15 * QIP) - 20 / VIPF);
        // Long-acting Insulin:

        // Model equations:
        dx_dt[34] = -kla * x[34] * (Cmax / (1 + x[35]));
        dx_dt[35] = -pla * (x[35] - qla * Math.pow(x[36], 3)) + kla * x[34] * (Cmax / (1 + x[35]));
        dx_dt[36] = pla * (x[35] - qla * Math.pow(x[36], 3)) - bla * x[36] / (1 + x[54]);
        dx_dt[54] = rla * bla * x[36] / (1 + (x[54])) - kcll * (x[54]);
        // Fast-acting Insulin 

        // Model equations:
        dx_dt[32] = -pfa * (x[32] - qfa * Math.pow(x[33], 3));
        dx_dt[33] = pfa * (x[32] - qfa * Math.pow(x[33], 3)) - bfa * x[33] / (1 + x[55]);
        dx_dt[55] = rfa * bfa * x[33] / (1 + (x[55])) - kclf * (x[55]);
        // Insulin submodel: 

        // Model equations:
        dx_dt[8] = (QIB / VIB) * (x[9] - x[8]);
        dx_dt[9] = (1 / VIH) * (QIB * x[8] + QIL * x[11] + QIK * x[12] + QIP * x[14] - QIH * x[9]);
        dx_dt[10] = (QIG / VIG) * (x[9] - x[10]);
        dx_dt[11] = (1 / VIL) * (QIA * x[9] + QIG * x[10] - QIL * x[11] + (1 - stress) * rPIR - rLIC);
        dx_dt[12] = (1 / VIK) * (QIK * (x[9] - x[12]) - rKIC);
        dx_dt[13] = (1 / VIPC) * (QIP * (x[9] - x[13]) - (VIPF / TIP) * (x[13] - x[14])) + 120*sfa*x[55] + 40*x[54];
        dx_dt[14] = (1 / VIPF) * ((VIPF / TIP) * (x[13] - x[14]) - rPIC);
        dx_dt[51] = rLIC + rKIC + rPIC;
        dx_dt[52] = (1 - stress) * rPIR;
        dx_dt[53] = x[54] + x[55];
        // dx_dt[53] = VIPF * rla * bla * x[36] / (1 + x[14]) + VIPF * rfa * bfa * x[33] / (1 + x[14]);
        return dx_dt;
    };
    
    /**
    * Returns maximum element in a vector
    * @param {Object[]} v Object array
    */
    maxInVec(v) {
        let a = Number.NEGATIVE_INFINITY;
        for (let key in v) {
            a = Math.max(a, v[key]);
        }
        return a;
    };
    /**
    * Returns element wise vector division (In Matlab: a./b)
    * @param {Object[]} a Object array
    * @param {Object[]} b Object array
    */
    vectorDiv(v1, v2) {
        let c = Object.assign({}, v1);
        for (let key in v1) {
            c[key] = v1[key] / v2[key];
        }
        return c;
    };
    /**
    * Returns vector sum of arbitrary many vectors
    * e.g. vectorSum(a,b,c)=a+b+c;
    * vectorSum(a,b)=a+b;
    * @param {Object[]} X Object array
    */
    vectorSum(...X) {
        return X.reduce((a, b) => {
            for (let key in b) {
                if (b.hasOwnProperty(key))
                    a[key] = (a[key] || 0) + b[key]
            }
            return a
        }, {}
        )
    };
    vectorDiff(...X) {
        let c = { ...X[0] }
        for (let i = 1; i < X.length; i++) {
            for (let key in X[i]) {
                c[key] -= X[i][key];
            }
        }
        return c;
    };
    vecMax(...X) {
        return X.reduce((a, b) => {
            for (let k in b) {
                if (b.hasOwnProperty(k))
                    a[k] = Math.max((a[k] || Number.NEGATIVE_INFINITY), b[k])
            }
            return a
        }, {}
        )
    };
    vecScalarMax(X, a) {
        return Object.keys(X).reduce(function (result, key) {
            result[key] = Math.max(X[key], a);
            return result
        }, {})
    };
    timesScalar(X, a) {
        return Object.keys(X).reduce(function (result, key) {
            result[key] = X[key] * a
            return result
        }, {})
    };
    vecAbs(X) {
        return Object.keys(X).reduce(function (result, key) {
            result[key] = Math.abs(X[key]);
            return result
        }, {})
    };
    vecNormInf(x) {
        return this.vecMax(this.vecAbs(x));
    };
    sampleGaussian(mean,std){
        const u1 = Math.random();
        const u2 = Math.random();
        
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0*std+mean;
    }
    /**
     * 
     * @param {*} ode 
     * @param {number} t0 
     * @param {number} tfinal 
     * @param {Array<number>} x0 
     * @param {number} h0 
     * @param {number} out_dt 
     * @param {number} last_output_t 
     * @param {Object} opt 
     * @param {number} last_prog_report 
     * @param {number} last_graph_update 
     * @param {Object} out 
     * @returns out
     */
    ode45_Arr(ode, t0, tfinal, x0, h0, out_dt, last_output_t, opt, last_prog_report, last_graph_update, out) {

        var t = t0;
        // var last_output_t=t;
        var y = x0;
        const n = y.length;
        var threshold = 1e-4;
        var rtol = (typeof opt === 'undefined') ? 1e-5 : opt.rtol;
        var hmin = (typeof opt === 'undefined') ? 1e-3 : opt.hmin;

        var pow = 1 / 5;

        var a2 = 1 / 5;
        var a3 = 3 / 10;
        var a4 = 4 / 5;
        var a5 = 8 / 9;

        var b11 = 1 / 5;
        var b21 = 3 / 40;
        var b31 = 44 / 45;
        var b41 = 19372 / 6561;
        var b51 = 9017 / 3168;
        var b61 = 35 / 384;
        var b22 = 9 / 40;
        var b32 = -56 / 15;
        var b42 = -25360 / 2187;
        var b52 = -355 / 33;
        var b33 = 32 / 9;
        var b43 = 64448 / 6561;
        var b53 = 46732 / 5247;
        var b63 = 500 / 1113;
        var b44 = -212 / 729;
        var b54 = 49 / 176;
        var b64 = 125 / 192;
        var b55 = -5103 / 18656;
        var b65 = -2187 / 6784;
        var b66 = 11 / 84;

        var e1 = 71 / 57600;
        var e3 = -71 / 16695;
        var e4 = 71 / 1920;
        var e5 = -17253 / 339200;
        var e6 = 22 / 525;
        var e7 = -1 / 40;
        //  Stats
        var nsteps = 0;
        var nfailed = 0;

        var f1 = ode(0, x0);
        var nfevals = 1;
        var done = false;
        // var hmin=1.0e-7;
        var absh = h0;

        // var tout = [t]; 
        var tout = out.tout;
        var yout = out.yout;
        // var hout=[h0];
        var hout = [];
        var errout = [];
        // for (let key in y){
        //     // yout[key]=[y[key]];
        //     yout[key]=[];
        // } 
        let next_output_t = last_output_t;
        while (done == false) {

            // By default, hmin is a small number such that t+hmin is only slightly
            // different than t.  It might be 0 if t is 0.
            // hmin = 1.0e-3;//16*eps(t);
            // absh = Math.max(hmin, absh);    // couldn't limit absh until new hmin
            var h = absh;
            let out_point = false;
            // Stretch the step if within 10% of tfinal-t.
            if (1.1 * absh >= Math.abs(tfinal - t)) {
                h = tfinal - t;
                absh = Math.abs(h);
                done = true;
            }
            // LOOP FOR ADVANCING ONE STEP.
            var nofailed = true;                      // no failed attempts
            while (true) {
                var y2 = y.map((yi,i)=>yi+f1[i]*h*b11);//this.vectorSum(y, this.timesScalar(f1, h * b11));
                var t2 = t + h * a2;
                var f2 = ode(t2, y2);
                var y3 = y.map((yi,i)=>yi+h*(f1[i]*b21+f2[i]*b22));//this.vectorSum(y, this.timesScalar(f1, h * b21), this.timesScalar(f2, h * b22));
                var t3 = t + h * a3;
                var f3 = ode(t3, y3);

                var y4 = y.map((yi,i)=>yi+h*(f1[i]*b31+f2[i]*b32+f3[i]*b33));//this.vectorSum(y, this.timesScalar(f1, h * b31), this.timesScalar(f2, h * b32), this.timesScalar(f3, h * b33));
                var t4 = t + h * a4;
                var f4 = ode(t4, y4);

                var y5 = y.map((yi,i)=>yi+h*(f1[i]*b41+f2[i]*b42+f3[i]*b43+f4[i]*b44)); //this.vectorSum(y, this.timesScalar(f1, h * b41), this.timesScalar(f2, h * b42), this.timesScalar(f3, h * b43), this.timesScalar(f4, h * b44));
                var t5 = t + h * a5;
                var f5 = ode(t5, y5);

                var y6 = y.map((yi,i)=>yi+h*(f1[i]*b51+f2[i]*b52+f3[i]*b53+f4[i]*b54+f5[i]*b55));// this.vectorSum(y, this.timesScalar(f1, h * b51), this.timesScalar(f2, h * b52), this.timesScalar(f3, h * b53), this.timesScalar(f4, h * b54), this.timesScalar(f5, h * b55));
                var t6 = t + h;
                var f6 = ode(t6, y6);

                var tnew = t + h;
                if (done) {
                    tnew = tfinal;   // Hit end point exactly.
                }
                h = tnew - t;      // Purify h.     

                var ynew = y.map((yi,i)=>yi+h*(f1[i]*b61+f3[i]*b63+f4[i]*b64+f5[i]*b65+f6[i]*b66));//  this.vectorSum(y, this.timesScalar(f1, h * b61), this.timesScalar(f3, h * b63), this.timesScalar(f4, h * b64), this.timesScalar(f5, h * b65), this.timesScalar(f6, h * b66));
                var f7 = ode(tnew, ynew);

                nfevals = nfevals + 6;

                // Estimate the error.
                var fE = new Array(n);// this.vectorSum(this.timesScalar(f1, e1), this.timesScalar(f3, e3), this.timesScalar(f4, e4), this.timesScalar(f5, e5), this.timesScalar(f6, e6), this.timesScalar(f7, e7));
                for (let i=0;i<n;i++)
                    fE[i]=f1[i]*e1+f3[i]*e3+f4[i]*e4+f5[i]*e5+f6[i]*e6+f7[i]*e7;

                var maxScale=0;
                for (let i=0;i<n;i++){
                    var mx=Math.max(Math.abs(y[i]),Math.abs(ynew[i]))
                    if (mx>maxScale)
                        maxScale=mx;
                }
                maxScale=Math.max(maxScale,threshold);

                var err = 0;// absh * this.maxInVec(this.vecAbs(this.vectorDiv(fE, this.vecScalarMax(this.vecMax(this.vecAbs(y), this.vecAbs(ynew)), threshold))));
                for (let i=0;i<n;i++){
                    var temp_err= Math.abs(fE[i]/( maxScale ));
                    if (temp_err>err)
                        err=temp_err;
                }
                err=absh*err;

                // console.log('err',err)
                let odeSucceeded = true;
                if (isNaN(err)) {
                    odeSucceeded = false;
                    err = 4 * rtol;
                }



                if (err > rtol) {                       // Failed step
                    nfailed = nfailed + 1;
                    let absh_init = absh;
                    if (nofailed) {
                        nofailed = false;
                        absh = absh * Math.max(0.1, Math.pow(0.8 * (rtol / err), pow));
                    } else {
                        absh = 0.5 * absh;
                    }

                    if (absh < hmin && odeSucceeded) {
                        absh = hmin;
                    }

                    // absh=absh_n;
                    h = absh;
                    if (absh <= hmin && absh_init <= hmin && odeSucceeded) {
                        // console.log('absh<=hmin','absh='+absh)
                        break;
                    } else {
                        done = false;
                        out_point = false;
                    }

                } else {                                // Successful step
                    break;
                }
            }
            nsteps = nsteps + 1;
            ynew[2]+=this.sampleGaussian(0,opt.processNoise_GH);
            // nout_new = nout_new + 1;
            // if (tnew-last_output_t>=out_dt ){
            //     // tout.push(tnew);// = {tout, tnew};

            //     // for (let key in ynew){
            //     //   yout[key].push(ynew[key]);
            //     // }
            //     let t_int_new=Math.round((last_output_t+out_dt)/out_dt)*out_dt
            //     let y_int_new=vectorSum(y,this.timesScalar(vectorSum({...ynew},this.timesScalar(y,-1)),(t_int_new-t)/(tnew-t)));
            //     tout.push(t_int_new);// = {tout, tnew};
            //     hout.push(h);
            //     errout.push(err);

            //     for (let key in ynew){
            //         yout[key].push(y_int_new[key]);
            //     }

            //     last_output_t=t_int_new;
            // }

            // if (out_point || done){
            //     tout.push(tnew);
            //     for (let key in ynew){
            //         yout[key].push(ynew[key]);
            //     }
            //     next_output_t+=out_dt;
            // }   
            while (tnew > next_output_t) {
                out.tout.push(next_output_t);

                if (typeof out.yout['hout'] == 'undefined')
                    out.yout['hout'] = [h];
                else
                    out.yout['hout'].push(h);

                let int_x = (next_output_t - t) / (tnew - t);
                // console.log(int_x)
                for (let key_i=0;key_i<n;key_i++) {
                    const key=this.keys[key_i];
                    switch (key) {
                        case 'GBC':
                        case 'GBF':
                        case 'GH':
                        case 'GG':
                        case 'GL':
                        case 'GK':
                        case 'GPC':
                        case 'GPF':
                        case 'XGC':
                        case 'XGP':
                            out.yout[key].push((y[key_i] + int_x * (ynew[key_i] - y[key_i])) * 0.0555);
                            break;
                        default:
                            out.yout[key].push(y[key_i] + int_x * (ynew[key_i] - y[key_i]));
                            break;
                    }
                }
                // console.log('interp:',{next_output_t,t,tnew,int_x,y,ynew})

                // console.log(Date.now() - last_graph_update,1000.0 / opt.graphFrequency)
                if (Date.now() - last_graph_update > 1000.0 / opt.graphFrequency) {
                    last_graph_update = Date.now();

                    // find 'td' such that tout[td]==Math.max(Tstop[i]-1440,0)
                    let td = out.tout.findIndex((val) => val >= out.tout[out.yout['GHint'].length - 1] - opt.HbA1c_interval*1440)
                    let GHavg = (out.yout['GHint'][out.yout['GHint'].length - 1] - out.yout['GHint'][td]) / (out.tout[out.yout['GHint'].length - 1] - out.tout[td]);
                    let HbA1c_IFCC = (10.93 * (GHavg + 77.3) / (35.6)) - 23.5;
                    let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
                    out.ResponseStatistics = { GHavg: GHavg * 0.0555, HbA1c_IFCC: HbA1c_IFCC, eAG: eAG };
                    // console.log('HbA1c',HbA1c_IFCC)
                    // last_prog_report=t;
                    self.postMessage({ full: out, progTime: tnew })
                }
                // console.log(Date.now() , last_prog_report, 0.1* (1000.0 / opt.graphFrequency))
                if (Date.now() - last_prog_report > 0.1* (1000.0 / opt.graphFrequency)) {
                    last_prog_report=Date.now();
                    // console.log(last_prog_report)
                    self.postMessage({ progTime: tnew })
                }




                next_output_t += out_dt;
            }
            // yout.push(ynew);// = {yout, ynew}; 
            if (done) {
                break
            }
            // If there were no failures compute a new h.
            if (nofailed) {
                // Note that absh may shrink by 0.8, and that err may be 0.
                var temp = 1.25 * (err / rtol) ** pow;
                var maxRatio = 2; // default 5
                if (temp > 1 / maxRatio) {
                    absh = Math.max(hmin, absh / temp);
                } else {
                    absh = maxRatio * absh;//5.0*absh;
                }
            }
            // Advance the integration one step.
            t = tnew;
            y = ynew;
            f1 = f7;  // Already have f(tnew,ynew)
            // if (t - last_prog_report >= 100) {
            //     last_prog_report=t;
            //     self.postMessage({ progTime: t })
            // }
        }

        // console.log('nfailed='+nfailed)
                            // find 'td' such that tout[td]==Math.max(Tstop[i]-1440,0)
        // let td = out.tout.findIndex((val) => val >= next_output_t - 1440)
        // let GHavg = (out.yout['GHint'][out.yout['GHint'].length - 1] - out.yout['GHint'][td]) / (next_output_t - out.tout[td]);
        // let HbA1c_IFCC = (10.93 * (GHavg + 77.3) / (35.6)) - 23.5;
        // let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
        // out.ResponseStatistics = { GHavg: GHavg * 0.0555, HbA1c_IFCC: HbA1c_IFCC, eAG: eAG };
        let td = out.tout.findIndex((val) => val >= out.tout[out.yout['GHint'].length - 1] - opt.HbA1c_interval*1440)
        let GHavg = (out.yout['GHint'][out.yout['GHint'].length - 1] - out.yout['GHint'][td]) / (out.tout[out.yout['GHint'].length - 1] - out.tout[td]);
        let HbA1c_IFCC = (10.93 * (GHavg + 77.3) / (35.6)) - 23.5;
        let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
        out.ResponseStatistics = { GHavg: GHavg * 0.0555, HbA1c_IFCC: HbA1c_IFCC, eAG: eAG };
        // console.log(out.tout[out.yout['GHint'].length - 1],out.tout[td])
        // console.log('HbA1c',HbA1c_IFCC)           
        // out.tout= out.tout,
        // out.yout= out.yout,
        // out.ResponseStatistics= out.ResponseStatistics,
        out.h= Math.max(hmin, absh),
        out.hout= hout,
        out.errout= errout,
        out.nfailed= nfailed,
        out.nsteps= nsteps,
        out.nfevals= nfevals,
        out.XStop= y,
        out.last_sample_time= next_output_t,
        out.last_graph_update= last_graph_update
        out.last_prog_report=last_prog_report;

        // return {
        //     tout: out.tout,
        //     yout: out.yout,
        //     ResponseStatistics: out.ResponseStatistics,
        //     h: Math.max(hmin, absh),
        //     hout: hout,
        //     errout: errout,
        //     nfailed: nfailed,
        //     nsteps: nsteps,
        //     nfevals: nfevals,
        //     XStop: y,
        //     last_sample_time: next_output_t,
        //     last_graph_update: last_graph_update
        // };
        return out;
        // return {tout,yout,h: Math.max(hmin, absh),hout:hout};
    };
    ode45(ode, t0, tfinal, x0, h0, out_dt, last_output_t, opt, last_prog_report, last_graph_update, out) {

        var t = t0;
        // var last_output_t=t;
        var y = x0;

        var threshold = 1e-4;
        var rtol = (typeof opt === 'undefined') ? 1e-5 : opt.rtol;
        var hmin = (typeof opt === 'undefined') ? 1e-3 : opt.hmin;

        var pow = 1 / 5;

        var a2 = 1 / 5;
        var a3 = 3 / 10;
        var a4 = 4 / 5;
        var a5 = 8 / 9;

        var b11 = 1 / 5;
        var b21 = 3 / 40;
        var b31 = 44 / 45;
        var b41 = 19372 / 6561;
        var b51 = 9017 / 3168;
        var b61 = 35 / 384;
        var b22 = 9 / 40;
        var b32 = -56 / 15;
        var b42 = -25360 / 2187;
        var b52 = -355 / 33;
        var b33 = 32 / 9;
        var b43 = 64448 / 6561;
        var b53 = 46732 / 5247;
        var b63 = 500 / 1113;
        var b44 = -212 / 729;
        var b54 = 49 / 176;
        var b64 = 125 / 192;
        var b55 = -5103 / 18656;
        var b65 = -2187 / 6784;
        var b66 = 11 / 84;

        var e1 = 71 / 57600;
        var e3 = -71 / 16695;
        var e4 = 71 / 1920;
        var e5 = -17253 / 339200;
        var e6 = 22 / 525;
        var e7 = -1 / 40;
        //  Stats
        var nsteps = 0;
        var nfailed = 0;

        var f1 = ode(0, x0);
        var nfevals = 1;
        var done = false;
        // var hmin=1.0e-7;
        var absh = h0;

        // var tout = [t]; 
        var tout = out.tout;
        var yout = out.yout;
        // var hout=[h0];
        var hout = [];
        var errout = [];
        // for (let key in y){
        //     // yout[key]=[y[key]];
        //     yout[key]=[];
        // } 
        let next_output_t = last_output_t;
        while (done == false) {

            // By default, hmin is a small number such that t+hmin is only slightly
            // different than t.  It might be 0 if t is 0.
            // hmin = 1.0e-3;//16*eps(t);
            // absh = Math.max(hmin, absh);    // couldn't limit absh until new hmin
            var h = absh;
            let out_point = false;
            // Stretch the step if within 10% of tfinal-t.
            if (1.1 * absh >= Math.abs(tfinal - t)) {
                h = tfinal - t;
                absh = Math.abs(h);
                done = true;
            }
            // LOOP FOR ADVANCING ONE STEP.
            var nofailed = true;                      // no failed attempts
            while (true) {
                var y2 = this.vectorSum(y, this.timesScalar(f1, h * b11));
                var t2 = t + h * a2;
                var f2 = ode(t2, y2);
                var y3 = this.vectorSum(y, this.timesScalar(f1, h * b21), this.timesScalar(f2, h * b22));
                var t3 = t + h * a3;
                var f3 = ode(t3, y3);

                var y4 = this.vectorSum(y, this.timesScalar(f1, h * b31), this.timesScalar(f2, h * b32), this.timesScalar(f3, h * b33));
                var t4 = t + h * a4;
                var f4 = ode(t4, y4);

                var y5 = this.vectorSum(y, this.timesScalar(f1, h * b41), this.timesScalar(f2, h * b42), this.timesScalar(f3, h * b43), this.timesScalar(f4, h * b44));
                var t5 = t + h * a5;
                var f5 = ode(t5, y5);

                var y6 = this.vectorSum(y, this.timesScalar(f1, h * b51), this.timesScalar(f2, h * b52), this.timesScalar(f3, h * b53), this.timesScalar(f4, h * b54), this.timesScalar(f5, h * b55));
                var t6 = t + h;
                var f6 = ode(t6, y6);

                var tnew = t + h;
                if (done) {
                    tnew = tfinal;   // Hit end point exactly.
                }
                h = tnew - t;      // Purify h.     

                var ynew = this.vectorSum(y, this.timesScalar(f1, h * b61), this.timesScalar(f3, h * b63), this.timesScalar(f4, h * b64), this.timesScalar(f5, h * b65), this.timesScalar(f6, h * b66));
                var f7 = ode(tnew, ynew);

                nfevals = nfevals + 6;

                // Estimate the error.
                var fE = this.vectorSum(this.timesScalar(f1, e1), this.timesScalar(f3, e3), this.timesScalar(f4, e4), this.timesScalar(f5, e5), this.timesScalar(f6, e6), this.timesScalar(f7, e7));

                var err = absh * this.maxInVec(this.vecAbs(this.vectorDiv(fE, this.vecScalarMax(this.vecMax(this.vecAbs(y), this.vecAbs(ynew)), threshold))));
                // console.log('err',err)
                let odeSucceeded = true;
                if (isNaN(err)) {
                    odeSucceeded = false;
                    err = 4 * rtol;
                }



                if (err > rtol) {                       // Failed step
                    nfailed = nfailed + 1;
                    let absh_init = absh;
                    if (nofailed) {
                        nofailed = false;
                        absh = absh * Math.max(0.1, Math.pow(0.8 * (rtol / err), pow));
                    } else {
                        absh = 0.5 * absh;
                    }

                    if (absh < hmin && odeSucceeded) {
                        absh = hmin;
                    }

                    // absh=absh_n;
                    h = absh;
                    if (absh <= hmin && absh_init <= hmin && odeSucceeded) {
                        // console.log('absh<=hmin','absh='+absh)
                        break;
                    } else {
                        done = false;
                        out_point = false;
                    }

                } else {                                // Successful step
                    break;
                }
            }
            nsteps = nsteps + 1;
            // nout_new = nout_new + 1;
            // if (tnew-last_output_t>=out_dt ){
            //     // tout.push(tnew);// = {tout, tnew};

            //     // for (let key in ynew){
            //     //   yout[key].push(ynew[key]);
            //     // }
            //     let t_int_new=Math.round((last_output_t+out_dt)/out_dt)*out_dt
            //     let y_int_new=vectorSum(y,this.timesScalar(vectorSum({...ynew},this.timesScalar(y,-1)),(t_int_new-t)/(tnew-t)));
            //     tout.push(t_int_new);// = {tout, tnew};
            //     hout.push(h);
            //     errout.push(err);

            //     for (let key in ynew){
            //         yout[key].push(y_int_new[key]);
            //     }

            //     last_output_t=t_int_new;
            // }

            // if (out_point || done){
            //     tout.push(tnew);
            //     for (let key in ynew){
            //         yout[key].push(ynew[key]);
            //     }
            //     next_output_t+=out_dt;
            // }   
            while (tnew > next_output_t) {
                out.tout.push(next_output_t);

                if (typeof out.yout['hout'] == 'undefined')
                    out.yout['hout'] = [h];
                else
                    out.yout['hout'].push(h);

                let int_x = (next_output_t - t) / (tnew - t);
                // console.log(int_x)
                for (let key in ynew) {
                    switch (key) {
                        case 'GBC':
                        case 'GBF':
                        case 'GH':
                        case 'GG':
                        case 'GL':
                        case 'GK':
                        case 'GPC':
                        case 'GPF':
                        case 'XGC':
                        case 'XGP':
                            out.yout[key].push((y[key] + int_x * (ynew[key] - y[key])) * 0.0555);
                            break;
                        default:
                            out.yout[key].push(y[key] + int_x * (ynew[key] - y[key]));
                            break;
                    }
                }
                // console.log('interp:',{next_output_t,t,tnew,int_x,y,ynew})



                if (Date.now() - last_graph_update > 1000.0 / opt.graphFrequency) {
                    last_graph_update = Date.now();

                    // find 'td' such that tout[td]==Math.max(Tstop[i]-1440,0)
                    let td = out.tout.findIndex((val) => val > next_output_t - 1440)
                    let GHavg = (out.yout['GHint'][out.yout['GHint'].length - 1] - out.yout['GHint'][td]) / (next_output_t - out.tout[td]);
                    let HbA1c_IFCC = (10.93 * (GHavg + 77.3) / (35.6)) - 23.5;
                    let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
                    out.ResponseStatistics = { GHavg: GHavg * 0.0555, HbA1c_IFCC: HbA1c_IFCC, eAG: eAG };

                    self.postMessage({ full: out, progTime: t })
                }




                next_output_t += out_dt;
            }
            // yout.push(ynew);// = {yout, ynew}; 
            if (done) {
                break
            }
            // If there were no failures compute a new h.
            if (nofailed) {
                // Note that absh may shrink by 0.8, and that err may be 0.
                var temp = 1.25 * (err / rtol) ** pow;
                var maxRatio = 2; // default 5
                if (temp > 1 / maxRatio) {
                    absh = Math.max(hmin, absh / temp);
                } else {
                    absh = maxRatio * absh;//5.0*absh;
                }
            }
            // Advance the integration one step.
            t = tnew;
            y = ynew;
            f1 = f7;  // Already have f(tnew,ynew)
            if (t - last_prog_report >= 10) {
                self.postMessage({ progTime: t })
            }
        }

        // console.log('nfailed='+nfailed)
        return {
            tout: out.tout,
            yout: out.yout,
            ResponseStatistics: out.ResponseStatistics,
            h: Math.max(hmin, absh),
            hout: hout,
            errout: errout,
            nfailed: nfailed,
            nsteps: nsteps,
            nfevals: nfevals,
            XStop: y,
            last_sample_time: next_output_t,
            last_graph_update: last_graph_update
        };
        // return {tout,yout,h: Math.max(hmin, absh),hout:hout};
    };
    JtoMat(J) {
        let keys = Object.keys(J);
        let n = keys.length;
        let A = [];
        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < n; j++)
                A[i][j] = J[keys[j]][keys[i]];
        }
        return A;
    };
    MatVecDivision(m, v) {
        var result = [];
        for (var i = 0; i < m.length; i++) { // rows
            result[i] = [];
            for (var j = 0; j < m[0].length; j++) { //cols
                result[i][j] = m[i][j] / v[0][j];
            }
        }
        return result;
    };
    multiplyMatScalar(m, a) {
        var result = [];
        for (var i = 0; i < m.length; i++) { // rows
            result[i] = [];
            for (var j = 0; j < m[0].length; j++) { //cols
                // console.log(i,j)
                result[i][j] = m[i][j] * a;
            }
        }
        return result;
    };
    multiplyMatrices(m1, m2) {
        var result = new Array(m1.length);
        for (var i = 0; i < m1.length; i++) {
            result[i] = new Array(m2[0].length);
            for (var j = 0; j < m2[0].length; j++) {
                var sum = 0;
                for (var k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    };
    matAddScalar(M, b) {
        let A = [];
        let n = M.length;
        let m = M[0].length;
        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < m; j++)
                A[i][j] = M[i][j] + b;
        }
        return A;
    };
    matAddVector(M, v) {
        let A = [];
        let n = M.length;
        let m = M[0].length;

        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < m; j++)
                A[i][j] = M[i][j] + v[0][i];
        }
        return A;
    };
    sumMats(...Ms) {
        let A = [];
        let n = Ms[0].length;
        let m = Ms[0][0].length;
        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < m; j++)
                A[i][j] = Ms[0][i][j];
        }
        for (let mat = 1; mat < Ms.length; mat++)
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++)
                    A[i][j] += Ms[mat][i][j];
            }
        return A;
    };
    Transpose(m) {
        let A = [];
        for (let i = 0; i < m[0].length; i++) { //from 0 to #m's cols
            A[i] = [];
            for (let j = 0; j < m.length; j++) // from 0 to #rows
                A[i][j] = m[j][i];
        }
        return A;
    }
    subMats(m1, m2) {
        return this.matElOp(m1, m2, (a, b) => a - b)
    }
    matElOp(m1, m2, op) {
        let A = [];
        for (let i = 0; i < m1.length; i++) {
            A[i] = [];
            for (let j = 0; j < m1[0].length; j++)
                A[i][j] = op(m1[i][j], m2[i][j]);
        }
        return A;
    }
    multMatStructMat(numMat, structMat) {
        var result = [];
        for (var i = 0; i < numMat.length; i++) {
            result[i] = {};
            for (var key in structMat[0]) {
                var sum = 0;
                // console.log(numMat[0].length)
                for (var k = 0; k < numMat[0].length; k++) {
                    sum += numMat[i][k] * structMat[k][key];
                }
                result[i][key] = sum;
            }
        }
        return result;
    };
    multSMandScalar(structMat, a) {
        var result = [];
        for (var i = 0; i < structMat.length; i++) {
            result[i] = {};
            // console.log('structMat[0]',structMat[0])
            for (var key in structMat[0]) {
                result[i][key] = structMat[i][key] * a;
            }
        }
        return result;
    };
    sumSMs(...sMs) {
        var result = [];
        for (var i = 0; i < sMs[0].length; i++) {
            result[i] = {};
            for (var key in sMs[0][0]) {
                result[i][key] = 0;
                for (var j = 0; j < sMs.length; j++)
                    result[i][key] += sMs[j][i][key];
            }
        }
        return result;
    };
    sMdiff(sm1, sm2) {
        var result = [];
        for (var i = 0; i < sm1.length; i++) {
            result[i] = {};
            for (var key in sm1[0]) {
                result[i][key] = sm1[i][key] - sm2[i][key];
            }
        }
        return result;
    };
    sMaddScalar(sm1, a) {
        var result = [];
        for (var i = 0; i < sm1.length; i++) {
            result[i] = {};
            for (var key in sm1[0]) {
                result[i][key] = sm1[i][key] + a;
            }
        }
        return result;
    };
    vecToStruct(Z) {
        let A = {};
        for (let i = 0; i < this.n; i++) {
            A[this.keys[i]] = Z[i];
        }
        return A;
    }
    eye(n) {
        let A = [];
        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < n; j++) {
                A[i][j] = (i == j) ? 1 : 0;
            }
        }
        return A;
    };
    constDiag(n, v) {
        let A = [];
        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < n; j++) {
                A[i][j] = (i == j) ? v : 0;
            }
        }
        return A;
    };
    emptyMat(n, m) {
        let A = [];
        for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < m; j++) {
                A[i][j] = 0;
            }
        }
        return A;
    };
    emptyStructMat(n) {
        let A = [];
        let obj = { ...this.X0 };
        for (let key in obj) {
            obj[key] = 0;
        }

        for (let i = 0; i < n; i++) {
            A[i] = { ...obj };
        }
        return A;
    };
    structToMat(s) {
        let v = [];
        // console.log(s)
        for (let i = 0; i < s.length; i++) {
            v[i] = [];
            for (let j = 0; j < this.keys.length; j++) {
                v[i][j] = s[i][this.keys[j]];
            }
        }
        return v;
    };
    /**
     * computes Frobenius norm
     * @param {*} A 
     * @returns |A|/sqrt(numel(A))
     */
    norm(A) {
        if (typeof A[0][0].length == 'undefined') {
            let nrm = 0;
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < A[i].length; j++) {
                    nrm += A[i][j] * A[i][j]
                }
            }
            return (nrm / (A.length * A[0].length)) ** 2
        } else {
            let nrm = 0;
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < A[i].length; j++) {
                    nrm += A[i][j][0] * A[i][j][0] + A[i][j][1] * A[i][j][1]
                }
            }
            return (nrm / (A.length * A[0].length)) ** 2
        }
    }
    predict_factor(h_abs, h_abs_old, error_norm, error_norm_old) {
        /*Predict by which factor to increase/decrease the step size.
        The algorithm is described in [1]_.
        Parameters
        ----------
        h_abs, h_abs_old : float
            Current and previous values of the step size, `h_abs_old` can be None
            (see Notes).
        error_norm, error_norm_old : float
            Current and previous values of the error norm, `error_norm_old` can
            be None (see Notes).
        Returns
        -------
        factor : float
            Predicted factor.
        Notes
        -----
        If `h_abs_old` and `error_norm_old` are both not None then a two-step
        algorithm is used, otherwise a one-step algorithm is used.
        References
        ----------
        .. [1] E. Hairer, S. P. Norsett G. Wanner, "Solving Ordinary Differential
            Equations II: Stiff and Differential-Algebraic Problems", Sec. IV.8.
        """
        */
        let multiplier = 1;
        if (typeof error_norm_old == 'undefined' || typeof h_abs_old == 'undefined' || error_norm == 0) {
            multiplier = 1
        } else {
            multiplier = h_abs / h_abs_old * (error_norm_old / error_norm) ** 0.25
        }

        return Math.min(1, multiplier) * error_norm ** -0.25;
    }
    /**
     * 
     * @param {(t,y)=>Object} fun callable, with signature 'fun(t: number,y: Object) Right-hand side of the system.
     * @param {*} t float Current time.
     * @param {*} y state Object
     * @param {*} h step to try
     * @param {*} Z0 (3,n) matrix Initial guess for the solution. It determines new values of `y` at ``t + h * C`` as ``y + Z0``, where ``C`` is the Radau method constants.
     * @param {*} scale (n,1) vec Problem tolerance scale, i.e. ``rtol * abs(y) + atol``.
     * @param {*} tol Tolerance to which solve the system. This value is compared with the normalized by `scale` error.
     * @param {*} LU_real LU decompositions of the system Jacobians.
     * @param {*} LU_complex LU decompositions of the system Jacobians.
     * @param {*} solve_lu callable, which solves a linear system given a LU decomposition. The signature is ``solve_lu(LU, b)``.
     * @returns converged : bool Whether iterations converged.
        n_iter : int Number of completed iterations.
        Z : array (3, n) Found solution.
        rate : float The rate of convergence.
     */
    solve_collocation_system(fun, t, y, h, Z0, scale, tol, LU_real, LU_complex, solve_lu) {
        /*Solve the collocation system.
        Parameters
        ----------
        fun : callable
            Right-hand side of the system.
        t : float
            Current time.
        y : ndarray, shape (n,)
            Current state.
        h : float
            Step to try.
        Z0 : ndarray, shape (3, n)
            Initial guess for the solution. It determines new values of `y` at
            ``t + h * C`` as ``y + Z0``, where ``C`` is the Radau method constants.
        scale : ndarray, shape (n)
            Problem tolerance scale, i.e. ``rtol * abs(y) + atol``.
        tol : float
            Tolerance to which solve the system. This value is compared with
            the normalized by `scale` error.
        LU_real, LU_complex
            LU decompositions of the system Jacobians.
        solve_lu : callable
            Callable which solves a linear system given a LU decomposition. The
            signature is ``solve_lu(LU, b)``.
        Returns
        -------
        converged : bool
            Whether iterations converged.
        n_iter : int
            Number of completed iterations.
        Z : ndarray, shape (3, n)
            Found solution.
        rate : float
            The rate of convergence.
        */
        let keys = Object.keys(y);
        let n = keys.length;
        let M_real = this.MU_REAL / h
        let M_complex = [this.MU_COMPLEX[0] / h, this.MU_COMPLEX[1] / h];
        // console.log('TI',this.TI,'Z0',Z0)
        // console.log('Z0[0].length',Z0[0].length)
        // var W = [];
        // for (var i = 0; i < this.TI.length; i++) {
        //     W[i] = [];
        //     for (var j = 0; j < Z0[0].length; j++) {
        //         var sum = 0;
        //         for (var k = 0; k < this.TI[0].length; k++) {
        //             sum += this.TI[i][k] * Z0[k][j];
        //         }
        //         W[i][j] = sum;
        //     }
        // }
        let W = this.multiplyMatrices(this.TI, Z0);
        // console.log('1758 W',W)
        let Z = [...Z0];

        let F = this.emptyMat(3, n);
        //ch = h * C // C is 1x3 mat
        let ch = this.multiplyMatScalar(this.C, h);

        let dW_norm_old = undefined;
        let dW = this.emptyMat(3, n);
        let converged = false;
        let rate = undefined;
        let k;
        for (k = 0; k < this.NEWTON_MAXITER; k++) { //
            for (let i = 0; i < 3; i++)
                F[i] = fun(t + ch[i], this.vectorSum(y, this.vecToStruct(Z[i])))
            F = this.structToMat(F);
            // if not np.all(np.isfinite(F)): // check if F has no nans or infinity then break
            // break

            let f_real = this.subMats(this.multiplyMatrices(this.TI_REAL, F), this.multiplyMatScalar([W[0]], M_real))
            // let f_real = this.structToMat(this.sMdiff(this.multMatStructMat(this.TI_REAL, F) , this.multSMandScalar([W[0]],M_real)));
            // f_complex = F.T.dot(TI_COMPLEX) - M_complex * (W[1] + 1j * W[2])
            // console.log()
            let f_complex_r = this.sumMats(this.multiplyMatrices([this.TI[1]], F), this.multiplyMatScalar([W[1]], -M_complex[0]), this.multiplyMatScalar([W[2]], M_complex[1]))

            // let f_complex_r=this.structToMat(this.sumSMs(this.multMatStructMat([this.TI[1]], F),this.multSMandScalar([W[1]],-M_complex[0]),this.multSMandScalar([W[2]],M_complex[1])));
            // let f_complex_im=this.structToMat(this.sumSMs(this.multMatStructMat([this.TI[2]], F),this.multSMandScalar([W[2]],-M_complex[0]),this.multSMandScalar([W[1]],-M_complex[1])));
            let f_complex_im = this.sumMats(this.multiplyMatrices([this.TI[2]], F), this.multiplyMatScalar([W[2]], -M_complex[0]), this.multiplyMatScalar([W[1]], -M_complex[1]));
            // console.log('f_complex_r',f_complex_r,'f_complex_im',f_complex_im)
            let f_complex = [];
            for (let i = 0; i < this.n; i++) {
                f_complex[i] = [];
                f_complex[i][0] = [f_complex_r[0][i], f_complex_im[0][i]];
            }
            // console.log('f_complex',f_complex)
            let dW_real = solve_lu(LU_real, this.Transpose(f_real))
            // console.log('dW_real',dW_real)
            let dW_complex = solve_lu(LU_complex, f_complex)
            let dW = [];
            // console.log('dW_real',dW_real)
            dW[0] = dW_real
            dW[1] = [];
            dW[2] = [];
            for (let i = 0; i < this.n; i++) {
                dW[1][i] = dW_complex[i][0];
                dW[2][i] = dW_complex[i][1];
            }
            // console.log('dW',dW,'scale',scale);
            // console.log('this.MatVecDivision(dW, scale)',this.MatVecDivision(dW, scale))
            let dW_norm = this.norm(this.MatVecDivision(dW, scale)) // dW/scale=[dW[0]./scale, dW[1]./scale, dW[2]./scale]
            // console.log(dW_norm)
            if (typeof dW_norm_old !== 'undefined')
                rate = dW_norm / dW_norm_old

            if (typeof rate !== 'undefined' && (rate >= 1 || rate ** (this.NEWTON_MAXITER - k) / (1 - rate) * dW_norm > tol))
                break

            // console.log('preSum W:',W,'preSum dW',dW)
            W = this.sumMats(W, dW);
            // console.log('post sum W',W)
            Z = this.multiplyMatrices(this.T, W);
            // console.log('Z',Z)
            if (dW_norm == 0 || typeof rate !== 'undefined' && rate / (1 - rate) * dW_norm < tol) {
                converged = true;
                break
            }

            dW_norm_old = dW_norm
        }
        return { converged, n_iter: k + 1, Z, rate }
    };
    /**
     * 
     * @param {(t,y)=>Object} fun callable, with signature 'fun(t: number,y: Object) Right-hand side of the system.
     * @param {*} t float Current time.
     * @param {*} y state Array
     * @param {*} h step to try
     * @param {*} Z0 (3,n) matrix Initial guess for the solution. It determines new values of `y` at ``t + h * C`` as ``y + Z0``, where ``C`` is the Radau method constants.
     * @param {*} scale (n,1) vec Problem tolerance scale, i.e. ``rtol * abs(y) + atol``.
     * @param {*} tol Tolerance to which solve the system. This value is compared with the normalized by `scale` error.
     * @param {*} LU_real LU decompositions of the system Jacobians.
     * @param {*} LU_complex LU decompositions of the system Jacobians.
     * @param {*} solve_lu callable, which solves a linear system given a LU decomposition. The signature is ``solve_lu(LU, b)``.
     * @returns converged : bool Whether iterations converged.
        n_iter : int Number of completed iterations.
        Z : array (3, n) Found solution.
        rate : float The rate of convergence.
     */
    solve_collocation_system_(fun, t, y, h, Z0, scale, tol, LU_real, LU_complex, solve_lu) {
        /*Solve the collocation system.
        Parameters
        ----------
        fun : callable
            Right-hand side of the system.
        t : float
            Current time.
        y : ndarray, shape (n,)
            Current state.
        h : float
            Step to try.
        Z0 : ndarray, shape (3, n)
            Initial guess for the solution. It determines new values of `y` at
            ``t + h * C`` as ``y + Z0``, where ``C`` is the Radau method constants.
        scale : ndarray, shape (n)
            Problem tolerance scale, i.e. ``rtol * abs(y) + atol``.
        tol : float
            Tolerance to which solve the system. This value is compared with
            the normalized by `scale` error.
        LU_real, LU_complex
            LU decompositions of the system Jacobians.
        solve_lu : callable
            Callable which solves a linear system given a LU decomposition. The
            signature is ``solve_lu(LU, b)``.
        Returns
        -------
        converged : bool
            Whether iterations converged.
        n_iter : int
            Number of completed iterations.
        Z : ndarray, shape (3, n)
            Found solution.
        rate : float
            The rate of convergence.
        */
        let keys = this.keys;
        let n = keys.length;
        let M_real = this.MU_REAL / h
        let M_complex = [this.MU_COMPLEX[0] / h, this.MU_COMPLEX[1] / h];
        // console.log('TI',this.TI,'Z0',Z0)
        // console.log('Z0[0].length',Z0[0].length)
        // var W = [];
        // for (var i = 0; i < this.TI.length; i++) {
        //     W[i] = [];
        //     for (var j = 0; j < Z0[0].length; j++) {
        //         var sum = 0;
        //         for (var k = 0; k < this.TI[0].length; k++) {
        //             sum += this.TI[i][k] * Z0[k][j];
        //         }
        //         W[i][j] = sum;
        //     }
        // }
        let W = this.multiplyMatrices(this.TI, Z0);
        // console.log('1758 W',W)
        let Z = Z0.map(row => row.map(el => el))

        let F = this.emptyMat(3, n);
        //ch = h * C // C is 1x3 mat
        let ch = this.multiplyMatScalar(this.C, h);

        let dW_norm_old = undefined;
        let dW = this.emptyMat(3, n);
        let converged = false;
        let rate = undefined;
        let k;
        for (k = 0; k < this.NEWTON_MAXITER; k++) { //
            // for (let i = 0; i < 3; i++) {
            //     // F[i] = fun(t + ch[i],this.vectorSum(y,this.vecToStruct(Z[i])))
            //     F[i] = fun(t + ch[i], y.map((y_j, j) => y_j + Z[i][j]));//this.vecToStruct(Z[i])))
            // }
            F = this.Transpose(fun(ch.map(x => t + x), this.Transpose(Z.map((Zrow, i) => Zrow.map((Zij, j) => Zij + y[j])))))
            // F=this.structToMat(F);
            // if not np.all(np.isfinite(F)): // check if F has no nans or infinity then break
            // break

            let f_real = this.subMats(this.multiplyMatrices(this.TI_REAL, F), this.multiplyMatScalar([W[0]], M_real))
            f_real = f_real[0];
            // let f_real = this.structToMat(this.sMdiff(this.multMatStructMat(this.TI_REAL, F) , this.multSMandScalar([W[0]],M_real)));
            // f_complex = F.T.dot(TI_COMPLEX) - M_complex * (W[1] + 1j * W[2])
            // console.log()
            let f_complex_r = this.sumMats(this.multiplyMatrices([this.TI[1]], F), this.multiplyMatScalar([W[1]], -M_complex[0]), this.multiplyMatScalar([W[2]], M_complex[1]))

            // let f_complex_r=this.structToMat(this.sumSMs(this.multMatStructMat([this.TI[1]], F),this.multSMandScalar([W[1]],-M_complex[0]),this.multSMandScalar([W[2]],M_complex[1])));
            // let f_complex_im=this.structToMat(this.sumSMs(this.multMatStructMat([this.TI[2]], F),this.multSMandScalar([W[2]],-M_complex[0]),this.multSMandScalar([W[1]],-M_complex[1])));
            let f_complex_im = this.sumMats(this.multiplyMatrices([this.TI[2]], F), this.multiplyMatScalar([W[2]], -M_complex[0]), this.multiplyMatScalar([W[1]], -M_complex[1]));
            // console.log('f_complex_r',f_complex_r,'f_complex_im',f_complex_im)
            let f_complex = new Array(n);
            for (let i = 0; i < this.n; i++) {
                f_complex[i] = [f_complex_r[0][i], f_complex_im[0][i]];
            }
            // console.log('f_complex',f_complex)
            let dW_real = solve_lu(LU_real, f_real)
            // console.log('dW_real',dW_real)
            let dW_complex = solve_lu(LU_complex, f_complex)
            let dW = [];
            // console.log('dW_real',dW_real)
            dW[0] = dW_real
            dW[1] = dW_complex.map(c => c[0]);
            dW[2] = dW_complex.map(c => c[1]);
            // for (let i=0;i<this.n;i++){
            //     dW[1][i] = dW_complex[i][0];
            //     dW[2][i] = dW_complex[i][1];
            // }
            // console.log('dW',dW,'scale',scale);
            // console.log('this.MatVecDivision(dW, scale)',this.MatVecDivision(dW, scale))
            // console.log('this.MatVecDivision(dW, scale)',dW.map(row=>row.map((el,i)=>el/scale[i])))

            let dW_norm = this.norm(dW.map(row => row.map((el, i) => el / scale[i]))) // dW/scale=[dW[0]./scale, dW[1]./scale, dW[2]./scale]
            // console.log('dW_norm',dW_norm)
            if (typeof dW_norm_old !== 'undefined')
                rate = dW_norm / dW_norm_old

            if (typeof rate !== 'undefined' && (rate >= 1 || rate ** (this.NEWTON_MAXITER - k) / (1 - rate) * dW_norm > tol))
                break

            // console.log('preSum W:',W,'preSum dW',dW)
            W = this.sumMats(W, dW);
            // console.log('post sum W',W)
            Z = this.multiplyMatrices(this.T, W);
            // console.log('Z',Z)
            if (dW_norm == 0 || typeof rate !== 'undefined' && rate / (1 - rate) * dW_norm < tol) {
                converged = true;
                break
            }

            dW_norm_old = dW_norm
        }
        return { converged, n_iter: k + 1, Z, rate }
    };
    /**
     * it's supposed to interpolate but i can't be bothered right now
     * @param {*} t_old 
     * @param {*} t 
     * @param {*} y_old 
     * @param {*} Q 
     * @returns callable function (t,t_old)
     */
    RadauDenseOutput(t_old, t_new, y_old, Z) {
        let h = t_new - t_old
        // Q = np.dot(self.Z.T, this.P)
        let Q = this.multiplyMatrices(this.Transpose(Z), this.P)
        // console.log('Q',Q)
        let order = Q[0].length - 1
        // console.log('order',order)

        return (t) => {
            let x = t.map(row => row.map(el => (el - t_old) / h));// this.multiplyMatScalar(this.matAddScalar(t, -t_old),1 / h);
            // console.log('x',x)
            // if t.ndim == 0:
            //     p = np.tile(x, self.order + 1)
            //     p = np.cumprod(p)
            // else:
            //     p = np.tile(x, (self.order + 1, 1))
            //     p = np.cumprod(p, axis=0)
            // p=[x,x**2,x**3]
            let p = [];
            p[0] = x[0];
            for (let i = 1; i < order + 1; i++) {
                p[i] = [];
                for (let j = 0; j < p[0].length; j++) {
                    p[i][j] = p[i - 1][j] * x[0][j];
                }
            }
            // Here we don't multiply by h, not a mistake.
            // y = np.dot(self.Q, p)
            // console.log('Q',Q,'p',p)
            let y = this.multiplyMatrices(Q, p);
            // console.log('y',y)
            // console.log('this.structToMat([y_old])',this.structToMat([y_old]))
            let out = y.map((row, i) => row.map((el, j) => el + y_old[i]));//this.matAddVector(y,y_old);
            // console.log('out',out)
            return out;
        }
    };
    /**
     * 
     * @param {function} ode callable ode(t:number,y:Array), returns Array
     * @param {*} t0 
     * @param {*} tfinal 
     * @param {Array} x0 
     * @param {*} h0 
     * @param {*} out_dt 
     * @param {*} last_output_t 
     * @param {*} opt 
     * @param {*} last_prog_report 
     * @param {*} last_graph_update 
     * @param {*} out 
     * @returns 
     */
    Radau5_(ode, stressv, t0, tfinal, x0, h0, out_dt, last_output_t, opt, last_prog_report, last_graph_update, out) {
        // out_dt=0.01;
        // last_output_t=0;
        this.f = ode(t0, x0.map(x => [x]));
        // let nj = this.num_jac_(ode, t0, x0, this.f, this.atol)
        // this.J = nj.J; this.jac_factor = nj.factor;
        console.log('x0', x0, 'h0', h0)
        this.J = this.jacobian_fode_pot(t0, x0, stressv);
        let nans = false;
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (isNaN(this.J[i][j])) {
                    nans = true;
                }
            }
        }

        this.current_jac = true;
        this.LU_real = undefined;
        this.LU_complex = undefined;
        this.Z = undefined;

        this.t = t0;
        this.y = x0;
        this.tFinal = tfinal;
        let next_output_t = last_output_t;
        while (this.t < tfinal) {
            // console.log('this.f',this.f)
            let message = this.Radau5_step_(this.t, this.y, this.f, ode, this.h_abs, stressv);
            // console.log(this.h_abs)
            let t = this.t_old
            let tnew = this.t;
            // console.log(t)
            let y = this.y
            // console.log('tnew='+tnew,'next_output_t='+next_output_t,'step',tnew-t)
            while (tnew > next_output_t) {
                out.tout.push(next_output_t);
                // out.tout.push(t);
                if (typeof out.yout['hout'] == 'undefined')
                    out.yout['hout'] = [this.h_abs];
                else
                    out.yout['hout'].push(this.h_abs);

                // let int_x=(next_output_t-t)/(tnew-t);
                let ynew = this.sol([[next_output_t]])
                // console.log(int_x)
                for (let i = 0; i < this.n; i++) {
                    switch (this.keys[i]) {
                        case 'GBC':
                        case 'GBF':
                        case 'GH':
                        case 'GG':
                        case 'GL':
                        case 'GK':
                        case 'GPC':
                        case 'GPF':
                        case 'XGC':
                        case 'XGP':
                            out.yout[this.keys[i]].push((ynew[i][0]) * 0.0555);
                            break;
                        default:
                            out.yout[this.keys[i]].push(ynew[i][0]);
                            break;
                    }
                }
                // console.log(Date.now()-last_graph_update,'>',1000.0/opt.graphFrequency)
                if (Date.now() - last_graph_update > 1000.0 / opt.graphFrequency) {
                    last_graph_update = Date.now();
                    console.log({ ...this.ncalls, rate: t / (Date.now() - this.simStartRT) })
                    //find 'td' such that tout[td]==Math.max(Tstop[i]-1440,0)
                    let td = out.tout.findIndex((val) => val > t - 1440)
                    let GHavg = (out.yout['GHint'][out.yout['GHint'].length - 1] - out.yout['GHint'][td]) / (t - out.tout[td]);
                    let HbA1c_IFCC = (10.93 * (GHavg + 77.3) / (35.6)) - 23.5;
                    let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
                    out.ResponseStatistics = { GHavg: GHavg, HbA1c_IFCC: HbA1c_IFCC, eAG: eAG };
                    // console.log('out',out)
                    self.postMessage({ full: out, progTime: t })
                }

                next_output_t += out_dt;
            }
            // self.postMessage({full: out,progTime: t})
            // while (t>next_output_t){
            //     out.tout.push(next_output_t);

            //     // let int_x=(next_output_t-t)/(tnew-t);
            //     // console.log(int_x)
            //     for (let key in ynew){
            //         switch (key){
            //             case 'GBC':
            //             case 'GBF':
            //             case 'GH':
            //             case 'GG':
            //             case 'GL':
            //             case 'GK':
            //             case 'GPC':
            //             case 'GPF':
            //             case 'XGC':
            //             case 'XGP':
            //                 out.yout[key].push((y[key]+int_x*(ynew[key]-y[key]))*0.0555);
            //                 break;
            //             default :
            //                 out.yout[key].push(y[key]+int_x*(ynew[key]-y[key]));
            //                 break;
            //         }
            //     }
            //     // console.log('interp:',{next_output_t,t,tnew,int_x,y,ynew})



            //     if (Date.now()-last_graph_update>1000.0/opt.graphFrequency){
            //         last_graph_update=Date.now();

            //         // find 'td' such that tout[td]==Math.max(Tstop[i]-1440,0)
            //         let td=out.tout.findIndex((val)=>val>next_output_t-1440)
            //         let GHavg=(out.yout['GHint'][out.yout['GHint'].length-1]-out.yout['GHint'][td])/(next_output_t-out.tout[td]);
            //         let HbA1c_IFCC=(10.93*(GHavg+77.3)/(35.6))-23.5;
            //         let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
            //         out.ResponseStatistics={GHavg:GHavg*0.0555,HbA1c_IFCC:HbA1c_IFCC,eAG:eAG};

            //         self.postMessage({full: out,progTime: t})
            //     }




            //     next_output_t+=out_dt;
            // }
        }
        return {
            tout: out.tout,
            yout: out.yout,
            ResponseStatistics: out.ResponseStatistics,
            h: this.h_abs,
            // hout:hout,
            // errout:errout,
            // nfailed:nfailed,
            // nsteps:nsteps,
            // nfevals:nfevals,
            XStop: this.y,
            last_sample_time: next_output_t,
            last_graph_update: last_graph_update
        };
    }
    Radau5(ode, t0, tfinal, x0, h0, out_dt, last_output_t, opt, last_prog_report, last_graph_update, out) {
        let nj = this.num_jac(ode, 0, x0, ode(0, x0), 1e-6, this.jac_factor)
        this.J = this.JtoMat(nj.J); this.jac_factor = nj.factor
        this.t = t0;
        this.y = x0;
        this.f =
            this.tFinal = tfinal;
        let next_output_t = last_output_t;
        while (this.t < tfinal) {
            let message = this.Radau5_step(this.t, this.y, this.f, ode, this.h_abs);
            // console.log(this.h_abs)
            let t_old = this.t_old
            let t = this.t;
            // console.log(t)
            let y = this.y
            out.tout.push(t);
            if (typeof out.yout['hout'] == 'undefined')
                out.yout['hout'] = [this.h_abs];
            else
                out.yout['hout'].push(this.h_abs);

            for (let key in y) {
                switch (key) {
                    case 'GBC':
                    case 'GBF':
                    case 'GH':
                    case 'GG':
                    case 'GL':
                    case 'GK':
                    case 'GPC':
                    case 'GPF':
                    case 'XGC':
                    case 'XGP':
                        out.yout[key].push((y[key]) * 0.0555);
                        break;
                    default:
                        out.yout[key].push(y[key]);
                        break;
                }
            }
            if (Date.now() - last_graph_update > 1000.0 / opt.graphFrequency) {
                last_graph_update = Date.now();

                // find 'td' such that tout[td]==Math.max(Tstop[i]-1440,0)
                let td = out.tout.findIndex((val) => val > t - 1440)
                let GHavg = (out.yout['GHint'][out.yout['GHint'].length - 1] - out.yout['GHint'][td]) / (t - out.tout[td]);
                let HbA1c_IFCC = (10.93 * (GHavg + 77.3) / (35.6)) - 23.5;
                let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
                out.ResponseStatistics = { GHavg: GHavg * 0.0555, HbA1c_IFCC: HbA1c_IFCC, eAG: eAG };

                self.postMessage({ full: out, progTime: t })
            }
            // self.postMessage({full: out,progTime: t})
            // while (t>next_output_t){
            //     out.tout.push(next_output_t);

            //     // let int_x=(next_output_t-t)/(tnew-t);
            //     // console.log(int_x)
            //     for (let key in ynew){
            //         switch (key){
            //             case 'GBC':
            //             case 'GBF':
            //             case 'GH':
            //             case 'GG':
            //             case 'GL':
            //             case 'GK':
            //             case 'GPC':
            //             case 'GPF':
            //             case 'XGC':
            //             case 'XGP':
            //                 out.yout[key].push((y[key]+int_x*(ynew[key]-y[key]))*0.0555);
            //                 break;
            //             default :
            //                 out.yout[key].push(y[key]+int_x*(ynew[key]-y[key]));
            //                 break;
            //         }
            //     }
            //     // console.log('interp:',{next_output_t,t,tnew,int_x,y,ynew})



            //     if (Date.now()-last_graph_update>1000.0/opt.graphFrequency){
            //         last_graph_update=Date.now();

            //         // find 'td' such that tout[td]==Math.max(Tstop[i]-1440,0)
            //         let td=out.tout.findIndex((val)=>val>next_output_t-1440)
            //         let GHavg=(out.yout['GHint'][out.yout['GHint'].length-1]-out.yout['GHint'][td])/(next_output_t-out.tout[td]);
            //         let HbA1c_IFCC=(10.93*(GHavg+77.3)/(35.6))-23.5;
            //         let eAG = 0.1455 * HbA1c_IFCC + 0.8285;
            //         out.ResponseStatistics={GHavg:GHavg*0.0555,HbA1c_IFCC:HbA1c_IFCC,eAG:eAG};

            //         self.postMessage({full: out,progTime: t})
            //     }




            //     next_output_t+=out_dt;
            // }
        }
        return {
            tout: out.tout,
            yout: out.yout,
            ResponseStatistics: out.ResponseStatistics,
            h: this.h_abs,
            // hout:hout,
            // errout:errout,
            // nfailed:nfailed,
            // nsteps:nsteps,
            // nfevals:nfevals,
            XStop: this.y,
            last_sample_time: next_output_t,
            last_graph_update: last_graph_update
        };
    }
    Radau5_step(t, y, f, fun, h_abs) {
        // t = this.t
        // y = this.y
        let keys = this.keys;
        let n = this.n;
        // f = this.f

        let max_step = this.max_step
        let atol = this.atol
        let rtol = this.rtol

        let min_step = 10 * (1.0e-8);// 10 * np.abs(np.nextafter(t, self.direction * np.inf) - t) = 10*eps(t) (in Matlab)
        let h_abs_old;
        let error_norm_old;
        let factor;
        // let h_abs;
        let h;
        if (this.h_abs > max_step) {
            h_abs = max_step;
            h_abs_old = undefined;
            error_norm_old = undefined;
        } else if (this.h_abs < min_step) {
            h_abs = min_step;
            h_abs_old = undefined;
            error_norm_old = undefined;
        } else {
            // h_abs = this.h_abs;
            h_abs_old = this.h_abs_old;
            error_norm_old = this.error_norm_old;
        }
        let J = this.J;
        let LU_real = this.LU_real;
        let LU_complex = this.LU_complex;

        let current_jac = this.current_jac;
        // let jac = this.jac;

        let rejected = false;
        let step_accepted = false;
        let message = undefined;
        let error_norm;
        let safety;
        let t_new;
        let y_new;
        let Z;
        while (step_accepted == false) {
            // console.log('2151')
            if (h_abs < min_step)
                return { status: false, message: this.TOO_SMALL_STEP }

            let h = h_abs;
            t_new = t + h;

            if ((t_new - this.tFinal) > 0)
                t_new = this.tFinal;

            h = t_new - t
            h_abs = Math.abs(h)

            let Z0 = [];
            if (typeof this.sol === 'undefined') {
                // Z0 = np.zeros((3, y.shape[0]))
                Z0 = this.emptyMat(3, n);//emptyMat(3,keys.length);
            } else {
                // console.log('this.sol(this.matAddScalar(this.multiplyMatScalar(this.C,h),t))=',this.sol(this.matAddScalar(this.multiplyMatScalar(this.C,h),t)))
                // console.log('this.structToMat([y])=',this.multiplyMatScalar(this.structToMat([y]),-1))
                Z0 = this.matAddVector(this.sol(this.matAddScalar(this.multiplyMatScalar(this.C, h), t)), this.multiplyMatScalar(this.structToMat([y]), -1))
                // console.log('dense Z0:',Z0)
                // console.log('check dense output for correct sol construction, should be (3 x n)')
                // break;
            }
            // let scale = atol + Math.abs(y) * rtol;
            // console.log('rtol',rtol)
            let scale = this.structToMat(this.sMaddScalar([this.timesScalar(this.vecAbs(y), rtol)], atol));
            let converged = false;
            let n_iter, rate;
            while (converged == false) {
                if (typeof LU_real === 'undefined' || typeof LU_complex === 'undefined') {
                    // console.log('h',h)
                    // console.log('this.constDiag(n,this.MU_REAL / h)',this.constDiag(n,this.MU_REAL / h));
                    // console.log('this.jac',this.jac)
                    LU_real = this.lu(this.subMats(this.constDiag(n, this.MU_REAL / h), J))
                    // console.log('LU_real',LU_real)
                    let Ar = this.subMats(this.constDiag(n, this.MU_COMPLEX[0] / h), J);
                    let Ai = this.subMats(this.constDiag(n, this.MU_COMPLEX[1] / h), J);
                    let Ac = [];
                    for (let i = 0; i < this.n; i++) {
                        Ac[i] = [];
                        for (let j = 0; j < this.n; j++)
                            Ac[i][j] = [Ar[i][j], Ai[i][j]];
                    }
                    LU_complex = this.lu(Ac)
                    // LU_real = self.lu(MU_REAL / h * self.I - J)
                    // LU_complex = self.lu(MU_COMPLEX / h * self.I - J)
                }
                // console.log('fun',fun,'t',t,'y',y,'h',h,'Z0',Z0,'scale',scale,'this.newton_tol',this.newton_tol,'LU_real',LU_real,'LU_complex',LU_complex,'this.solve_lu',this.solve_lu);
                let scs_sol = this.solve_collocation_system(fun, t, y, h, Z0, scale, this.newton_tol, LU_real, LU_complex, this.solve_lu);
                // console.log('scs_sol',scs_sol)
                converged = scs_sol.converged;
                n_iter = scs_sol.n_iter;
                Z = scs_sol.Z;
                rate = scs_sol.rate;
                if (converged == false) {
                    if (current_jac)
                        break

                    // J = self.jac(t, y, f)
                    let nj = this.num_jac(fun, t, y, f, atol, this.jac_factor);
                    this.jac = this.JtoMat(nj.J); this.jac_factor = nj.factor;
                    current_jac = true;
                    LU_real = undefined;
                    LU_complex = undefined;
                }
            }
            if (converged == false) {
                h_abs *= 0.5;
                LU_real = undefined;
                LU_complex = undefined;
                continue
            }
            // console.log('y',y)
            // console.log('Z[2]',Z[2])
            y_new = this.vectorSum(y, this.vecToStruct(Z[2]));
            // console.log('2225: y_new',y_new)
            // ZE = Z.T.dot(E) / h
            // console.log('Z',Z,'this.multiplyMatScalar(this.E,1/h)',this.multiplyMatScalar(this.E,1/h))
            let ZE = this.multiplyMatrices(this.multiplyMatScalar(this.E, 1 / h), Z);
            // console.log('ZE',ZE)
            // console.log('f',f)
            // console.log('this.structToMat(f)',this.structToMat([f]))
            // console.log('this.sumMats(this.structToMat(f) , ZE)',this.sumMats(this.structToMat([f]) , ZE))

            let error = this.solve_lu(LU_real, this.Transpose(this.sumMats(this.structToMat([f]), ZE)))
            // console.log('error',error)
            scale = this.structToMat(this.sMaddScalar([this.timesScalar(this.vecMax(this.vecAbs(y), this.vecAbs(y_new)), rtol)], atol));
            // console.log('scale',scale)
            error_norm = this.norm(this.MatVecDivision([error], scale))
            // console.log('error_norm',error_norm)
            safety = 0.9 * (2 * this.NEWTON_MAXITER + 1) / (2 * this.NEWTON_MAXITER + n_iter)
            // console.log('safety',safety)

            if (rejected && error_norm > 1) {
                error = this.solve_lu(LU_real, this.Transpose(this.sumMats(this.structToMat([fun(t, this.vectorSum(y, this.vecToStruct(error)))]), ZE)))
                error_norm = this.norm(this.MatVecDivision([error], scale))
            }
            if (error_norm > 1) {
                factor = this.predict_factor(h_abs, h_abs_old, error_norm, error_norm_old)
                h_abs *= Math.max(this.MIN_FACTOR, safety * factor)

                LU_real = undefined
                LU_complex = undefined
                rejected = true
            } else {
                step_accepted = true;
            }
        }
        let recompute_jac = (typeof jac !== 'undefined' && n_iter > 2 && rate > 1e-3);
        // console.log('recompute_jac',recompute_jac)
        factor = this.predict_factor(h_abs, h_abs_old, error_norm, error_norm_old)
        factor = Math.min(this.MAX_FACTOR, safety * factor)

        if (recompute_jac == false && factor < 1.2) {
            factor = 1
        } else {
            LU_real = undefined;
            LU_complex = undefined;
        }
        // console.log('y_new',y_new)
        let f_new = fun(t_new, y_new)
        if (recompute_jac) {
            let nj = this.num_jac(fun, t_new, y_new, f_new, atol, this.jac_factor);
            this.jac = this.JtoMat(nj.J); this.jac_factor = nj.factor;
            current_jac = true;
        } else { //if (typeof jac !=='undefined')
            current_jac = false;
        }
        // console.log('current_jac',current_jac)
        this.h_abs_old = this.h_abs
        this.error_norm_old = error_norm

        this.h_abs = h_abs * factor

        this.y_old = y

        this.t = t_new
        this.y = y_new
        this.f = f_new

        this.Z = Z

        this.LU_real = LU_real
        this.LU_complex = LU_complex
        this.current_jac = current_jac
        this.J = J

        this.t_old = t
        this.sol = this.RadauDenseOutput(this.t_old, this.t, this.y_old, Z);//self._compute_dense_output()
        // console.log('sol',this.sol)
        // console.log('step_accepted',step_accepted,'message',message)
        return { step_accepted, message }
    }
    Radau5_step_(t, y, f, fun, h_abs, stressv) {
        // t = this.t
        // y = this.y
        let keys = this.keys;
        let n = this.n;
        // f = this.f

        let max_step = this.max_step
        let atol = this.atol
        let rtol = this.rtol

        let min_step = 10 * (1.0e-7);// 10 * np.abs(np.nextafter(t, self.direction * np.inf) - t) = 10*eps(t) (in Matlab)
        let h_abs_old;
        let error_norm_old;
        let factor;
        // let h_abs;
        let h;
        if (this.h_abs > max_step) {
            h_abs = max_step;
            h_abs_old = undefined;
            error_norm_old = undefined;
        } else if (this.h_abs < min_step) {
            h_abs = min_step;
            h_abs_old = undefined;
            error_norm_old = undefined;
        } else {
            // h_abs = this.h_abs;
            h_abs_old = this.h_abs_old;
            error_norm_old = this.error_norm_old;
        }
        let J = this.J;
        let LU_real = this.LU_real;
        let LU_complex = this.LU_complex;

        let current_jac = this.current_jac;
        // let jac = this.jac;

        let rejected = false;
        let step_accepted = false;
        let message = undefined;
        let error_norm;
        let safety;
        let t_new;
        let y_new;
        let Z;
        let n_iter, rate;
        while (step_accepted == false) {
            // console.log('2151')
            if (h_abs < min_step)
                return { status: false, message: this.TOO_SMALL_STEP }

            let h = h_abs;
            t_new = t + h;

            if ((t_new - this.tFinal) > 0)
                t_new = this.tFinal;

            h = t_new - t
            h_abs = Math.abs(h)
            // console.log('h',h,'h_abs',h_abs)

            let Z0 = [];
            if (typeof this.sol === 'undefined') {
                // Z0 = np.zeros((3, y.shape[0]))
                Z0 = this.emptyMat(3, n);//emptyMat(3,keys.length);
            } else {
                // Z0 = self.sol(t + h * C).T - y
                //    let sol=this.sol(t+h*this.C);
                let t_interp = this.C[0].map(x => t + h * x);//this.C is 1x3 matrix, and C[0] is just an Array of length 3
                // console.log('t_interp',t_interp)
                let sl = this.Transpose(this.sol([t_interp]));
                // console.log('sl',[...sl])
                Z0 = sl.map((y_hat) => y_hat.map((y_i, i) => y_i - y[i]));
                // console.log('Z0',Z0)
                // let DT0=Date.now();
                // while (Date.now()<DT0+2000){

                // }
                //Z0 = this.matAddVector(this.sol(this.matAddScalar(this.multiplyMatScalar(this.C,h),t)) ,this.multiplyMatScalar(this.structToMat([y]),-1);
            }
            // let scale = atol + Math.abs(y) * rtol;
            // console.log('rtol',rtol)
            let scale = y.map(y_i => atol + y_i * rtol) //this.structToMat(this.sMaddScalar([this.timesScalar(this.vecAbs(y) , rtol)],atol)) ;
            let converged = false;

            while (converged == false) {
                if (typeof LU_real === 'undefined' || typeof LU_complex === 'undefined') {
                    // console.log('h',h)
                    // console.log('this.constDiag(n,this.MU_REAL / h)',this.constDiag(n,this.MU_REAL / h));
                    // console.log('J',J)
                    // LU_real = this.lu(this.subMats(this.constDiag(n,this.MU_REAL / h),J)) 
                    let MU_real_h = this.MU_REAL / h;
                    LU_real = this.lu(J.map((x, i) => x.map((y, j) => (i == j) ? MU_real_h - y : y))); //self.lu(MU_REAL / h * self.I - J)
                    // console.log('LU_real',LU_real)
                    let MU_COMPLEX0_h = this.MU_COMPLEX[0] / h;
                    let Ar = J.map((row, i) => row.map((el, j) => (i == j) ? MU_COMPLEX0_h - el : el))
                    let MU_COMPLEX1_h = this.MU_COMPLEX[1] / h;
                    let Ai = J.map((row, i) => row.map((el, j) => (i == j) ? MU_COMPLEX1_h - el : el))
                    let Ac = new Array(n);
                    for (let i = 0; i < n; i++) {
                        Ac[i] = new Array(n);
                        for (let j = 0; j < n; j++)
                            Ac[i][j] = [Ar[i][j], Ai[i][j]];
                    }
                    LU_complex = this.lu(Ac)
                    // LU_real = self.lu(MU_REAL / h * self.I - J)
                    // LU_complex = self.lu(MU_COMPLEX / h * self.I - J)
                }
                // console.log('LU_real',LU_real,'LU_complex',LU_complex)
                // console.log('fun',fun,'t',t,'y',y,'h',h,'Z0',Z0,'scale',scale,'this.newton_tol',this.newton_tol,'LU_real',LU_real,'LU_complex',LU_complex,'this.solve_lu',this.solve_lu);
                let scs_sol = this.solve_collocation_system_(fun, t, y, h, Z0, scale, this.newton_tol, LU_real, LU_complex, this.solve_lu);
                // console.log('scs_sol',scs_sol)
                converged = scs_sol.converged;
                n_iter = scs_sol.n_iter;
                // console.log('n_iter'+n_iter)
                Z = scs_sol.Z;
                rate = scs_sol.rate;
                if (converged == false) {
                    if (current_jac)
                        break

                    // J = self.jac(t, y, f)
                    // let nj = this.num_jac_(fun, t, y, f, atol);
                    // this.J = nj.J; J = nj.J;
                    J = this.jacobian_fode_pot(t, y, stressv)
                    current_jac = true;
                    LU_real = undefined;
                    LU_complex = undefined;
                }
            }
            if (converged == false) {
                h_abs *= 0.5;
                LU_real = undefined;
                LU_complex = undefined;
                continue
            }
            // console.log('y',y)
            // console.log('Z[2]',Z[2])
            // console.log('z',Z)
            y_new = y.map((y_i, i) => y_i + Z[2][i]);// this.vectorSum(y, this.vecToStruct(Z[2]));
            // console.log('2225: y_new',y_new)
            // ZE = Z.T.dot(E) / h
            // console.log('Z',Z,'this.multiplyMatScalar(this.E,1/h)',this.multiplyMatScalar(this.E,1/h))
            let ZE = this.multiplyMatrices([this.E[0].map(x => x / h)], Z);
            // console.log('ZE',ZE)
            // console.log('f',f)
            // console.log('this.structToMat(f)',this.structToMat([f]))
            // console.log('this.sumMats(this.structToMat(f) , ZE)',this.sumMats(this.structToMat([f]) , ZE))
            // console.log(f.map((f_i,i)=>f_i+ZE[0][i]))
            let error = this.solve_lu(LU_real, f.map((f_i, i) => f_i[0] + ZE[0][i]))
            // console.log('error',error)
            scale = y.map((y_i, i) => Math.max(Math.abs(y_i), Math.abs(y_new[i])) * rtol + atol)
            // scale =  this.structToMat(this.sMaddScalar([this.timesScalar(this.vecMax(this.vecAbs(y), this.vecAbs(y_new)), rtol)],atol));
            // console.log('scale',scale)
            // console.log('scaledError=',error.map((e_i,i)=>e_i/scale[i]))
            error_norm = this.norm([error.map((e_i, i) => e_i / scale[i])])
            // console.log('error_norm',error_norm)
            safety = 0.9 * (2 * this.NEWTON_MAXITER + 1) / (2 * this.NEWTON_MAXITER + n_iter)
            // console.log('safety',safety)

            if (rejected && error_norm > 1) {
                // f(t,y+error)+ZE
                let temp = fun(t, y.map((y_i, i) => [y_i + error[i]])).map((f_i, i) => f_i + ZE[0][i]);
                console.log('temp', temp)
                error = this.solve_lu(LU_real, temp)
                error_norm = this.norm([error.map((e_i, i) => e_i / scale[i])])
            }
            if (error_norm > 1) {
                factor = this.predict_factor(h_abs, h_abs_old, error_norm, error_norm_old)
                h_abs *= Math.max(this.MIN_FACTOR, safety * factor)

                LU_real = undefined
                LU_complex = undefined
                rejected = true
            } else {
                step_accepted = true;
            }
        }
        let recompute_jac = (n_iter > 2 && rate > 1e-3);// (typeof jac !=='undefined' && n_iter > 2 && rate > 1e-3);
        // console.log('recompute_jac',recompute_jac)
        factor = this.predict_factor(h_abs, h_abs_old, error_norm, error_norm_old)
        factor = Math.min(this.MAX_FACTOR, safety * factor)

        if (recompute_jac == false && factor < 1.2) {
            factor = 1
        } else {
            LU_real = undefined;
            LU_complex = undefined;
        }
        // console.log('y_new',y_new)
        let f_new = fun(t_new, y_new.map(x => [x]))
        if (recompute_jac) {
            // let nj = this.num_jac_(fun, t_new, y_new, f_new, atol);
            // J = nj.J; this.jac_factor = nj.factor;
            J = this.jacobian_fode_pot(t_new, y_new, stressv)
            current_jac = true;
        } else {//if (typeof jac !=='undefined'){
            current_jac = false;
        }
        // console.log('current_jac',current_jac)
        this.h_abs_old = this.h_abs
        this.error_norm_old = error_norm

        this.h_abs = h_abs * factor

        this.y_old = y

        this.t = t_new
        this.y = y_new
        this.f = f_new

        this.Z = Z

        this.LU_real = LU_real
        this.LU_complex = LU_complex
        this.current_jac = current_jac
        this.J = J

        this.t_old = t
        this.sol = this.RadauDenseOutput(this.t_old, this.t, this.y_old, Z);//self._compute_dense_output()
        // console.log('sol',this.sol)
        // console.log('step_accepted',step_accepted,'message',message)
        return { step_accepted, message }
    }
    ode15s(ode, t0, tFinal, y0, options) {
        let bdf = false;
        let MaxOrder = 5;
        let rtol = 1e-6;
        // Stats
        let nsteps = 0,
            nfailed = 0,
            nfevals = 0,
            npds = 0,
            ndecomps = 0,
            nsolves = 0;

        let t = t0;
        let y = y0;

        // Initialize method parameters.
        let G = [1, 3 / 2, 11 / 6, 25 / 12, 137 / 60];
        let alpha = [];
        if (bdf) {
            alpha = [0, 0, 0, 0, 0];
        } else {
            alpha = [-37 / 200, -1 / 9, -0.0823, -0.0415, 0];
        }
        let invGa = [];//1 ./ (G .* (1 - alpha));
        for (let i = 0; i < G.length; i++) {
            invGa[i] = 1 / (G[i] * (1 - alpha[i]));
        }
        // let erconst = alpha .* G + (1 ./ (2:6)')
        let difU = [[-1, -2, -3, -4, -5],           // difU is its own inverse!
        [0, 1, 3, 6, 10],
        [0, 0, -1, -4, -10],
        [0, 0, 0, 1, 5],
        [0, 0, 0, 0, -1]];
        // maxK = 1:maxk;
        // [kJ,kI] = meshgrid(maxK,maxK);
        // difU = difU(maxK,maxK);
        let maxit = 4;

        let f0 = ode(t0, y0);
        let nj = this.num_jac(ode, t0, y0, f0, 1e-6, null);
        let factor = nj.factor;
        let J = nj.J;
        let Jcurrent = true;
        let hmin = 16 * Number.EPSILON;//*Math.abs(t);

        let wt = this.vecScalarMax(this.vecAbs(y), threshold); // max(abs(y),threshold)
        // let rh = 1.25*this.vecNormInf(this.vectorDiv(f0,wt))/Math.sqrt(rtol);//1.25 * norm(yp ./ wt,inf) / sqrt(rtol);

        // let absh = Math.min(hmax, tFinal-t0);
        // if (absh * rh > 1){
        //     absh = 1 / rh;
        // }
        // absh = Math.max(absh, hmin); 
        // <--------------------------------rh and absh gets overwritten anyway

        // The error of BDF1 is 0.5*h^2*y''(t), so we can determine the optimal h.
        // let h = absh;
        // let tdel = (t + Math.min(sqrt(Number.EPSILON)*Math.max(Math.abs(t),Math.abs(t+h)),absh)) - t;
        //let f1 = ode(t+tdel,y);
        //nfevals = nfevals + 1;                
        //dfdt = (f1 - f0) ./ tdel;
        //DfDt = dfdt + dfdy*yp;
        // <------------------------------Skipped as our ode is time-invariant (i.e. f1-f0=0)
        DfDt = J * f0;
        rh = 1.25 * sqrt(0.5 * this.vecNormInf(this.vectorDiv(DfDt, wt)) / rtol);

        absh = Math.min(hmax, tFinal - t0);
        if (absh * rh > 1) {
            absh = 1 / rh;
        }
        absh = Math.max(absh, hmin);
        h = absh;

        // Initialize.
        let k = 1;                                  // start at order 1 with BDF1
        let K = 1;                                  // K = 1:k
        let klast = k;
        let abshlast = absh;

        let dif = [];//zeros(neq,maxk+2);
        dif[1] = this.timesScalar(f0, h); //dif(:,1) = h * yp;

        let hinvGak = h * invGa[0];
        let nconhk = 0;                             // steps taken with current h and k

        //         % THE MAIN LOOP

        let done = false;
        let at_hmin = false;
        while (~done) {
            done = true;
            //   hmin = 16*eps(t);
            absh = Math.min(hmax, Math.max(hmin, absh));
            if (absh == hmin) {
                if (at_hmin) {
                    absh = abshlast;  // required by stepsize recovery
                }
                at_hmin = true;
            } else {
                at_hmin = false;
            }
            h = absh;

            // Stretch the step if within 10% of tfinal-t.
            if (1.1 * absh >= abs(tFinal - t)) {
                h = tFinal - t;
                absh = abs(h);
                done = true;
            }

            // if ((absh != abshlast) || (k != klast)){
            //     difRU = cumprod((kI - 1 - kJ*(absh/abshlast)) ./ kI) * difU;
            //     dif(:,K) = dif(:,K) * difRU(K,K);

            //     hinvGak = h * invGa(k);
            //     nconhk = 0;
            //     Miter = Mt - hinvGak * dfdy;
            //     if Mtype == 4
            //         Miter = Miter + dMpsidy;
            //     end    
            //     if DAE
            //         RowScale = 1 ./ max(abs(Miter),[],2);
            //         Miter = sparse(one2neq,one2neq,RowScale) * Miter;
            //     end
            //     if issparse(Miter)
            //         [L,U,P,Q,R] = lu(Miter);
            //     else  
            //         [L,U,p] = lu(Miter,'vector');
            //     end  
            //     ndecomps = ndecomps + 1;            
            //     havrate = false;
            // }

            //   % LOOP FOR ADVANCING ONE STEP.
            //   nofailed = true;                      % no failed attempts
            //   while true                            % Evaluate the formula.

            //     gotynew = false;                    % is ynew evaluated yet?
            //     while ~gotynew

            //       % Compute the constant terms in the equation for ynew.
            //       psi = dif(:,K) * (G(K) * invGa(k));

            //       % Predict a solution at t+h.
            //       tnew = t + h;
            //       if done
            //         tnew = tfinal;   % Hit end point exactly.
            //       end
            //       h = tnew - t;      % Purify h.
            //       pred = y + sum(dif(:,K),2);
            //       ynew = pred;

            //       % The difference, difkp1, between pred and the final accepted 
            //       % ynew is equal to the backward difference of ynew of order
            //       % k+1. Initialize to zero for the iteration to compute ynew.
            //       difkp1 = zeros(neq,1); 
            //       if normcontrol
            //         normynew = norm(ynew);
            //         invwt = 1 / max(max(normy,normynew),threshold);
            //         minnrm = 100*eps*(normynew * invwt);
            //       else
            //         invwt = 1 ./ max(max(abs(y),abs(ynew)),threshold);
            //         minnrm = 100*eps*norm(ynew .* invwt,inf);
            //       end

            //       % Mtnew is required in the RHS function evaluation.
            //       if Mtype == 2  % state-independent
            //         if odeIsFuncHandle
            //           Mtnew = Mfun(tnew,Margs{:}); % mass(t,p1,p2...)
            //         else                                     
            //           Mtnew = Mfun(tnew,ynew,Margs{:}); % mass(t,y,'mass',p1,p2...)
            //         end
            //       end

            //       % Iterate with simplified Newton method.
            //       tooslow = false;
            //       for iter = 1:maxit
            //         if Mtype >= 3 
            //           Mtnew = Mfun(tnew,ynew,Margs{:}); % state-dependent
            //         end
            //         rhs = hinvGak*ode(tnew,ynew) -  Mtnew*(psi+difkp1);
            //         if DAE                          % Account for row scaling.
            //           rhs = RowScale .* rhs;
            //         end

            //         % use overloaded subfunction mldivide which throws no warning.
            //         if issparse(Miter)
            //           del = Q * (U \ (L \ (P * (R \ rhs))));
            //         else  
            //           del = U \ (L \ rhs(p));
            //         end  

            //         if normcontrol
            //           newnrm = norm(del) * invwt;
            //         else
            //           newnrm = norm(del .* invwt,inf);
            //         end
            //         difkp1 = difkp1 + del;
            //         ynew = pred + difkp1;

            //         if newnrm <= minnrm
            //           gotynew = true;
            //           break;
            //         elseif iter == 1
            //           if havrate
            //             errit = newnrm * rate / (1 - rate);
            //             if errit <= 0.05*rtol       % More stringent when using old rate.
            //               gotynew = true;
            //               break;
            //             end
            //           else
            //             rate = 0;
            //           end
            //         elseif newnrm > 0.9*oldnrm
            //           tooslow = true;
            //           break;
            //         else
            //           rate = max(0.9*rate, newnrm / oldnrm);
            //           havrate = true;                 
            //           errit = newnrm * rate / (1 - rate);
            //           if errit <= 0.5*rtol             
            //             gotynew = true;
            //             break;
            //           elseif iter == maxit            
            //             tooslow = true;
            //             break;
            //           elseif 0.5*rtol < errit*rate^(maxit-iter)
            //             tooslow = true;
            //             break;
            //           end
            //         end

            //         oldnrm = newnrm;
            //       end                               % end of Newton loop
            //       nfevals = nfevals + iter;         
            //       nsolves = nsolves + iter;         

            //       if tooslow
            //         nfailed = nfailed + 1;          
            //         % Speed up the iteration by forming new linearization or reducing h.
            //         if ~Jcurrent || ~Mcurrent
            //           if ~Jcurrent  
            //             if Janalytic
            //               dfdy = Jac(t,y,Jargs{:});
            //             else
            //               f0 = ode(t,y);
            //               [dfdy,Joptions.fac,nF] = odenumjac(ode, {t,y}, f0, Joptions);
            //               nfevals = nfevals + nF + 1; 
            //             end             
            //             npds = npds + 1;            
            //             Jcurrent = true;
            //           end
            //           if ~Mcurrent
            //             Mt = Mfun(t,y,Margs{:});
            //             Mcurrent = true;
            //             if Mtype == 4
            //               [dMpsidy,dMoptions.fac] = odenumjac(@odemxv, {Mfun,t,y,psi,Margs{:}}, Mt*psi, ...
            //                                                   dMoptions); %#ok<CCAT>
            //             end
            //           end                       
            //         elseif absh <= hmin
            //           warning(message('MATLAB:ode15s:IntegrationTolNotMet', sprintf( '%e', t ), sprintf( '%e', hmin )));         
            //           solver_output = odefinalize(solver_name, sol,...
            //                                       outputFcn, outputArgs,...
            //                                       printstats, [nsteps, nfailed, nfevals,...
            //                                                    npds, ndecomps, nsolves],...
            //                                       nout, tout, yout,...
            //                                       haveEventFcn, teout, yeout, ieout,...
            //                                       {kvec,dif3d,idxNonNegative});
            //           if nargout > 0
            //             varargout = solver_output;
            //           end  
            //           return;
            //         else
            //           abshlast = absh;
            //           absh = max(0.3 * absh, hmin);
            //           h = tdir * absh;
            //           done = false;

            //           difRU = cumprod((kI - 1 - kJ*(absh/abshlast)) ./ kI) * difU;
            //           dif(:,K) = dif(:,K) * difRU(K,K);

            //           hinvGak = h * invGa(k);
            //           nconhk = 0;
            //         end
            //         Miter = Mt - hinvGak * dfdy;
            //         if Mtype == 4
            //           Miter = Miter + dMpsidy;
            //         end
            //         if DAE
            //           RowScale = 1 ./ max(abs(Miter),[],2);
            //           Miter = sparse(one2neq,one2neq,RowScale) * Miter;
            //         end
            //         if issparse(Miter)
            //           [L,U,P,Q,R] = lu(Miter);
            //         else  
            //           [L,U,p] = lu(Miter,'vector');
            //         end  
            //         ndecomps = ndecomps + 1;        
            //         havrate = false;
            //       end   
            //     end     % end of while loop for getting ynew

            //     % difkp1 is now the backward difference of ynew of order k+1.
            //     if normcontrol
            //       err = (norm(difkp1) * invwt) * erconst(k);
            //     else
            //       err = norm(difkp1 .* invwt,inf) * erconst(k);
            //     end
            //     if nonNegative && (err <= rtol) && any(ynew(idxNonNegative)<0)
            //       if normcontrol
            //         errNN = norm( max(0,-ynew(idxNonNegative)) ) * invwt;
            //       else
            //         errNN = norm( max(0,-ynew(idxNonNegative)) ./ thresholdNonNegative, inf);
            //       end
            //       if errNN > rtol
            //         err = errNN;
            //       end
            //     end

            //     if err > rtol                       % Failed step
            //       nfailed = nfailed + 1;            
            //       if absh <= hmin
            //         warning(message('MATLAB:ode15s:IntegrationTolNotMet', sprintf( '%e', t ), sprintf( '%e', hmin )));
            //         solver_output = odefinalize(solver_name, sol,...
            //                                     outputFcn, outputArgs,...
            //                                     printstats, [nsteps, nfailed, nfevals,...
            //                                                  npds, ndecomps, nsolves],...
            //                                     nout, tout, yout,...
            //                                     haveEventFcn, teout, yeout, ieout,...
            //                                     {kvec,dif3d,idxNonNegative});          
            //         if nargout > 0
            //           varargout = solver_output;
            //         end  
            //         return;
            //       end

            //       abshlast = absh;
            //       if nofailed
            //         nofailed = false;
            //         hopt = absh * max(0.1, 0.833*(rtol/err)^(1/(k+1))); % 1/1.2
            //         if k > 1
            //           if normcontrol
            //             errkm1 = (norm(dif(:,k) + difkp1) * invwt) * erconst(k-1);
            //           else
            //             errkm1 = norm((dif(:,k) + difkp1) .* invwt,inf) * erconst(k-1);
            //           end
            //           hkm1 = absh * max(0.1, 0.769*(rtol/errkm1)^(1/k)); % 1/1.3
            //           if hkm1 > hopt
            //             hopt = min(absh,hkm1);      % don't allow step size increase
            //             k = k - 1;
            //             K = 1:k;
            //           end
            //         end
            //         absh = max(hmin, hopt);
            //       else
            //         absh = max(hmin, 0.5 * absh);
            //       end
            //       h = tdir * absh;
            //       if absh < abshlast
            //         done = false;
            //       end

            //       difRU = cumprod((kI - 1 - kJ*(absh/abshlast)) ./ kI) * difU;
            //       dif(:,K) = dif(:,K) * difRU(K,K);

            //       hinvGak = h * invGa(k);
            //       nconhk = 0;
            //       Miter = Mt - hinvGak * dfdy;
            //       if Mtype == 4
            //         Miter = Miter + dMpsidy;
            //       end      
            //       if DAE
            //         RowScale = 1 ./ max(abs(Miter),[],2);
            //         Miter = sparse(one2neq,one2neq,RowScale) * Miter;
            //       end
            //       if issparse(Miter)
            //         [L,U,P,Q,R] = lu(Miter);
            //       else   
            //         [L,U,p] = lu(Miter,'vector');
            //       end
            //       ndecomps = ndecomps + 1;          
            //       havrate = false;

            //     else                                % Successful step
            //       break;

            //     end
            //   end % while true
            //   nsteps = nsteps + 1;                  

            //   dif(:,k+2) = difkp1 - dif(:,k+1);
            //   dif(:,k+1) = difkp1;
            //   for j = k:-1:1
            //     dif(:,j) = dif(:,j) + dif(:,j+1);
            //   end

            //   NNreset_dif = false;
            //   if nonNegative && any(ynew(idxNonNegative) < 0)
            //     NNidx = idxNonNegative(ynew(idxNonNegative) < 0); % logical indexing
            //     ynew(NNidx) = 0;
            //     if normcontrol
            //       normynew = norm(ynew);
            //     end
            //     NNreset_dif = true;
            //   end   

            //   if haveEventFcn
            //     [te,ye,ie,valt,stop] = odezero(@ntrp15s,eventFcn,eventArgs,valt,...
            //                                    t,y,tnew,ynew,t0,h,dif,k,idxNonNegative);
            //     if ~isempty(te)
            //       if output_sol || (nargout > 2)
            //         teout = [teout, te]; %#ok<AGROW>
            //         yeout = [yeout, ye]; %#ok<AGROW>
            //         ieout = [ieout, ie]; %#ok<AGROW>
            //       end
            //       if stop               % Stop on a terminal event. 
            //         % Adjust the interpolation data to [t te(end)].                 
            //         taux = te(end) - (0:k)*(te(end) - t);
            //         yaux = ntrp15s(taux,t,y,tnew,ynew,h,dif,k,idxNonNegative);
            //         for j=2:k+1
            //           yaux(:,j:k+1) = yaux(:,j-1:k) - yaux(:,j:k+1);
            //         end
            //         dif(:,1:k) = yaux(:,2:k+1);        
            //         tnew = te(end);
            //         ynew = ye(:,end);
            //         h = tnew - t;
            //         done = true;
            //       end
            //     end
            //   end

            //   if output_sol
            //     nout = nout + 1;
            //     if nout > length(tout)
            //       tout = [tout, zeros(1,chunk)]; %#ok<AGROW>  requires chunk >= refine
            //       yout = [yout, zeros(neq,chunk)]; %#ok<AGROW> 
            //       kvec = [kvec, zeros(1,chunk)]; %#ok<AGROW>
            //       dif3d = cat(3,dif3d, zeros(neq,maxk+2,chunk));
            //     end
            //     tout(nout) = tnew; %#ok<AGROW>
            //     yout(:,nout) = ynew; %#ok<AGROW>
            //     kvec(nout) = k; %#ok<AGROW>
            //     dif3d(:,:,nout) = dif; %#ok<AGROW>
            //   end   

            //   if output_ty || haveOutputFcn 
            //     switch outputAt
            //      case 'SolverSteps'        % computed points, no refinement
            //       nout_new = 1;
            //       tout_new = tnew;
            //       yout_new = ynew;
            //      case 'RefinedSteps'       % computed points, with refinement
            //       tref = t + (tnew-t)*S;
            //       nout_new = refine;
            //       tout_new = [tref, tnew];
            //       yout_new = [ntrp15s(tref,[],[],tnew,ynew,h,dif,k,idxNonNegative), ynew];
            //      case 'RequestedPoints'    % output only at tspan points
            //       nout_new =  0;
            //       tout_new = [];
            //       yout_new = [];
            //       while next <= ntspan  
            //         if tdir * (tnew - tspan(next)) < 0
            //           if haveEventFcn && stop     % output tstop,ystop
            //             nout_new = nout_new + 1;
            //             tout_new = [tout_new, tnew]; %#ok<AGROW>
            //             yout_new = [yout_new, ynew]; %#ok<AGROW>
            //           end
            //           break;
            //         end
            //         nout_new = nout_new + 1;       
            //         tout_new = [tout_new, tspan(next)]; %#ok<AGROW>
            //         if tspan(next) == tnew
            //           yout_new = [yout_new, ynew]; %#ok<AGROW>
            //         else  
            //           yout_new = [yout_new, ntrp15s(tspan(next),[],[],tnew,ynew,h,dif,k,...
            //               idxNonNegative)]; %#ok<AGROW>
            //         end  
            //         next = next + 1;
            //       end
            //     end

            //     if nout_new > 0
            //       if output_ty
            //         oldnout = nout;
            //         nout = nout + nout_new;
            //         if nout > length(tout)
            //           tout = [tout, zeros(1,chunk)]; %#ok<AGROW> requires chunk >= refine
            //           yout = [yout, zeros(neq,chunk)]; %#ok<AGROW>
            //         end
            //         idx = oldnout+1:nout;        
            //         tout(idx) = tout_new; %#ok<AGROW>
            //         yout(:,idx) = yout_new; %#ok<AGROW>
            //       end
            //       if haveOutputFcn
            //         stop = feval(outputFcn,tout_new,yout_new(outputs,:),'',outputArgs{:});
            //         if stop
            //           done = true;
            //         end  
            //       end     
            //     end  
            //   end

            //   if done
            //     break
            //   end

            //   klast = k;
            //   abshlast = absh;
            //   nconhk = min(nconhk+1,maxk+2);
            //   if nconhk >= k + 2
            //     temp = 1.2*(err/rtol)^(1/(k+1));
            //     if temp > 0.1
            //       hopt = absh / temp;
            //     else
            //       hopt = 10*absh;
            //     end
            //     kopt = k;
            //     if k > 1
            //       if normcontrol
            //         errkm1 = (norm(dif(:,k)) * invwt) * erconst(k-1);
            //       else
            //         errkm1 = norm(dif(:,k) .* invwt,inf) * erconst(k-1);
            //       end
            //       temp = 1.3*(errkm1/rtol)^(1/k);
            //       if temp > 0.1
            //         hkm1 = absh / temp;
            //       else
            //         hkm1 = 10*absh;
            //       end
            //       if hkm1 > hopt 
            //         hopt = hkm1;
            //         kopt = k - 1;
            //       end
            //     end
            //     if k < maxk
            //       if normcontrol
            //         errkp1 = (norm(dif(:,k+2)) * invwt) * erconst(k+1);
            //       else
            //         errkp1 = norm(dif(:,k+2) .* invwt,inf) * erconst(k+1);
            //       end
            //       temp = 1.4*(errkp1/rtol)^(1/(k+2));
            //       if temp > 0.1
            //         hkp1 = absh / temp;
            //       else
            //         hkp1 = 10*absh;
            //       end
            //       if hkp1 > hopt 
            //         hopt = hkp1;
            //         kopt = k + 1;
            //       end
            //     end
            //     if hopt > absh
            //       absh = hopt;
            //       if k ~= kopt
            //         k = kopt;
            //         K = 1:k;
            //       end
            //     end
            //   end

            //   % Advance the integration one step.
            //   t = tnew;
            //   y = ynew;
            //   if NNreset_dif  
            //     % Used dif for unperturbed solution to select order and interpolate.  
            //     % In perturbing ynew, defined NNidx.  Use now to reset dif to move along 
            //     % constraint.
            //     dif(NNidx,:) = 0;      
            //   end
            //   if normcontrol
            //     normy = normynew;
            //   end
            //   Jcurrent = Jconstant;
            //   switch Mtype
            //   case {0,1}
            //     Mcurrent = true;                    % Constant mass matrix I or M.
            //   case 2
            //     % M(t) has already been evaluated at tnew in Mtnew.
            //     Mt = Mtnew;
            //     Mcurrent = true;
            //   case {3,4}  % state dependent
            //     % M(t,y) has not yet been evaluated at the accepted ynew.
            //     Mcurrent = false;
            //   end

        } //% while ~done
    };
    /**
     * LU decomposition of square matrix A
     * for complex valued system All entries MUST be vectors i.e., A[i][j]=[a,b], b[i]=[c,d], representing complex numbers a+bi and c+di
     * for real valued systems ALL entries MUST be numbers A[i][j]=a, b[i]=c
     * @param {number[]} A 
     * @returns [L,U,P]
     */
    lu(A) {
        /**
         * LU decomposition of square matrix A
         * @param {number[]} A 
         * @returns [L,U,P]
         */
        this.ncalls['lu'] += 1;
        //  this.ncalls['num_jac_']+=1;
        function lu_real(A) {
            const mult = (a, b) => {
                let res = new Array(a.length);
                for (let r = 0; r < a.length; ++r) {
                    res[r] = new Array(b[0].length);
                    for (let c = 0; c < b[0].length; ++c) {
                        res[r][c] = 0;
                        for (let i = 0; i < a[0].length; ++i)
                            res[r][c] += a[r][i] * b[i][c];
                    }
                }
                return res;
            }

            const lu = (mat) => {
                let lower = [], upper = [], n = mat.length;
                for (let i = 0; i < n; i++) {
                    lower.push([]);
                    upper.push([]);
                    for (let j = 0; j < n; j++) {
                        lower[i].push(0);
                        upper[i].push(0);
                    }
                }
                for (let i = 0; i < n; i++) {
                    for (let k = i; k < n; k++) {
                        let sum = 0;
                        for (let j = 0; j < i; j++)
                            sum += (lower[i][j] * upper[j][k]);
                        upper[i][k] = mat[i][k] - sum;
                    }
                    for (let k = i; k < n; k++) {
                        if (i == k)
                            lower[i][i] = 1;
                        else {
                            let sum = 0;
                            for (let j = 0; j < i; j++)
                                sum += (lower[k][j] * upper[j][i]);
                            lower[k][i] = (mat[k][i] - sum) / upper[i][i];
                        }
                    }
                }
                return [lower, upper];
            }

            const pivot = (m) => {
                let n = m.length;
                let id = [];
                for (let i = 0; i < n; i++) {
                    id.push([]);
                    for (let j = 0; j < n; j++) {
                        if (i === j)
                            id[i].push(1);
                        else
                            id[i].push(0);
                    }
                }
                for (let i = 0; i < n; i++) {
                    let maxm = m[i][i];
                    let row = i;
                    for (let j = i; j < n; j++)
                        if (Math.abs(m[j][i]) > Math.abs(maxm)) {
                            maxm = m[j][i];
                            row = j;
                        }
                    if (i != row) {
                        let tmp = id[i];
                        id[i] = id[row];
                        id[row] = tmp;
                    }
                }
                return id;
            }

            const P = pivot(A);
            A = mult(P, A);
            return [...lu(A), P];
        };
        /**
     * LU decomposition of square matrix A
     * @param {number[]} A , a matrix where each entry A[i][j]=[a,b] corresponding to complex number a+ib
     * @returns [L,U,P]
     */
        function lu_complex(A) {
            const cmult = (a, b) => {
                return [a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]];
            };
            const cadd = (a, b) => {
                return [a[0] + b[0], a[1] + b[1]];
            }
            const csub = (a, b) => {
                return [a[0] - b[0], a[1] - b[1]];
            }
            const cdiv = (a, b) => {
                let blen2 = b[0] ** 2 + b[1] ** 2;
                return [(a[0] * b[0] + a[1] * b[1]) / (blen2), (a[1] * b[0] - a[0] * b[1]) / (blen2)];
            }
            const clen2 = (a) => {
                return a[0] ** 2 + a[1] ** 2;
            }
            const mult = (a, b) => {
                let res = new Array(a.length);
                for (let r = 0; r < a.length; ++r) {
                    res[r] = new Array(b[0].length);
                    for (let c = 0; c < b[0].length; ++c) {
                        res[r][c] = [0, 0];
                        for (let i = 0; i < a[0].length; ++i)
                            res[r][c] = cadd(res[r][c], cmult(a[r][i], b[i][c]));
                    }
                }
                return res;
            }

            const lu = (mat) => {
                let lower = [], upper = [], n = mat.length;;
                for (let i = 0; i < n; i++) {
                    lower.push([]);
                    upper.push([]);
                    for (let j = 0; j < n; j++) {
                        lower[i].push([0, 0]);
                        upper[i].push([0, 0]);
                    }
                }
                for (let i = 0; i < n; i++) {
                    for (let k = i; k < n; k++) {
                        let sum = [0, 0];
                        for (let j = 0; j < i; j++)
                            sum = cadd(sum, cmult(lower[i][j], upper[j][k]));
                        upper[i][k] = csub(mat[i][k], sum);
                    }
                    for (let k = i; k < n; k++) {
                        if (i == k)
                            lower[i][i] = [1, 0];
                        else {
                            let sum = [0, 0];
                            for (let j = 0; j < i; j++)
                                sum = cadd(sum, cmult(lower[k][j], upper[j][i]));
                            lower[k][i] = cdiv(csub(mat[k][i], sum), upper[i][i]);
                        }
                    }
                }
                return [lower, upper];
            }

            const pivot = (m) => {
                let n = m.length;
                let id = [];
                for (let i = 0; i < n; i++) {
                    id.push([]);
                    for (let j = 0; j < n; j++) {
                        if (i === j)
                            id[i].push([1, 0]);
                        else
                            id[i].push([0, 0]);
                    }
                }
                for (let i = 0; i < n; i++) {
                    let maxm = m[i][i];
                    let row = i;
                    for (let j = i; j < n; j++)
                        if (clen2(m[j][i]) > clen2(maxm)) {
                            maxm = m[j][i];
                            row = j;
                        }
                    if (i != row) {
                        let tmp = id[i];
                        id[i] = id[row];
                        id[row] = tmp;
                    }
                }
                return id;
            }

            const P = pivot(A);
            A = mult(P, A);
            return [...lu(A), P];
        };
        if (typeof A[0][0].length == 'undefined')
            return lu_real(A);
        else
            return lu_complex(A);
    }



    /**
     * solves a linear system (with complex numbers or Real number) given an LU decomposition
     * for complex valued system All entries must be vectors i.e., A[i][j]=[a,b], b[i]=[c,d], representing complex numbers a+bi and c+di
     * for real valued systems ALL entries must be numbers A[i][j]=a, b[i]=c
     * @param {*} LU , in the form [L,U,P]
     * @param {*} b 
     */
    solve_lu(LU, b) {
        /**
        * solves a linear system (with REAL numbers) given a LU decomposition.
        * @param {Array[3]} LU, in the form [L,U,P]
        * @param {*} b 
        */
        function solve_lu_real(LU, b) {
            const mult = (a, b) => { // a-Matrix, b-Vector
                // console.log('a',a,'b',b)
                let res = new Array(a.length);
                for (let r = 0; r < a.length; ++r) {
                    //    res[r] = new Array(b.length);
                    //    for (let c = 0; c < b.length; ++c) {
                    res[r] = 0;
                    for (let i = 0; i < a[0].length; ++i)
                        res[r] += a[r][i] * b[i];
                    //    }
                }
                return res;
            }
            // console.log('LU',LU,'b',b)
            let Pb = mult(LU[2], b);
            let n = b.length;
            let y = new Array(n);
            for (let m = 0; m < n; m++) {
                let s = 0;
                for (let i = 0; i < (m); i++) {
                    s += LU[0][m][i] * y[i];
                }
                y[m] = (Pb[m] - s) / (LU[0][m][m]);
            }
            let x = new Array(n);
            for (let m = n - 1; m >= 0; m--) {
                let s = 0;
                for (let i = n - 1; i > m; i--) {
                    s += LU[1][m][i] * x[i];
                }
                x[m] = (y[m] - s) / (LU[1][m][m]);
            }
            return x;
        };
        /**
      * solves a linear system (with complex numbers) given an LU decomposition.
      * @param {Array[3]} LU, in the form [L,U,P]
      * @param {*} b 
      */
        function solve_lu_complex(LU, b) {
            const cmult = (a, b) => {
                return [a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]];
            };
            const cadd = (a, b) => {
                return [a[0] + b[0], a[1] + b[1]];
            }
            const csub = (a, b) => {
                return [a[0] - b[0], a[1] - b[1]];
            }
            const cdiv = (a, b) => {
                let blen2 = b[0] ** 2 + b[1] ** 2;
                return [(a[0] * b[0] + a[1] * b[1]) / (blen2), (a[1] * b[0] - a[0] * b[1]) / (blen2)];
            }
            const clen2 = (a) => {
                return a[0] ** 2 + a[1] ** 2;
            }
            const mult = (a, b) => {
                let res = new Array(a.length);
                for (let r = 0; r < a.length; ++r) {
                    res[r] = [0, 0];
                    for (let i = 0; i < a[0].length; ++i)
                        res[r] = cadd(res[r], cmult(a[r][i], b[i]));

                }
                return res;
            }
            let Pb = mult(LU[2], b);
            // console.log('Pb=',Pb)
            let n = b.length;
            let y = [];
            for (let m = 0; m < n; m++) {
                let s = [0, 0];
                for (let i = 0; i < (m); i++) {
                    s = cadd(s, cmult(LU[0][m][i], y[i]))
                }
                // console.log('m=',m,'Pb[m][0]=',Pb[m][0],'LU[0][m][m]',LU[0][m][m])
                y[m] = cdiv(csub(Pb[m], s), LU[0][m][m]);
            }
            // console.log('y=',y)
            let x = [];
            for (let m = n - 1; m >= 0; m--) {
                let s = [0, 0];
                for (let i = n - 1; i > m; i--) {
                    s = cadd(s, cmult(LU[1][m][i], x[i]))
                }
                x[m] = cdiv(csub(y[m], s), LU[1][m][m]);
            }
            return x;
        };
        if (typeof b[0].length == 'undefined') // if complex then b[0]=[u,v], and b[0].length=2, if real then b[0]=a, and b[0].length=undefined
            return solve_lu_real(LU, b);
        else
            return solve_lu_complex(LU, b);
    };
    /**
    *  Returns a finite difference jacobian
    *  ( J[x_i][y_i]=dy_i/dx_i ) 
    *  see https://github.com/scipy/scipy/blob/4cf21e753cf937d1c6c2d2a0e372fbc1dbbeea81/scipy/integrate/_ivp/common.py#L248
    * @param {*} fun 
    * @param {*} t 
    * @param {*} y_ 
    * @param {*} f 
    * @param {*} threshold 
    * @param {*} factor 
    * @returns {J:diff, factor}
    */
    num_jac(fun, t, y_, f, threshold, factor) {
        /*Finite differences Jacobian approximation tailored for ODE solvers.
        This function computes finite difference approximation to the Jacobian
        matrix of `fun` with respect to `y` using forward differences.
        The Jacobian matrix has shape (n, n) and its element (i, j) is equal to
        ``d f_i / d y_j``.
        A special feature of this function is the ability to correct the step
        size from iteration to iteration. The main idea is to keep the finite
        difference significantly separated from its round-off error which
        approximately equals ``EPS * np.abs(f)``. It reduces a possibility of a
        huge error and assures that the estimated derivative are reasonably close
        to the true values (i.e., the finite difference approximation is at least
        qualitatively reflects the structure of the true Jacobian).
        Parameters
        ----------
        fun : callable
            Right-hand side of the system implemented in a vectorized fashion.
        t : float
            Current time.
        y : ndarray, shape (n,)
            Current state.
        f : ndarray, shape (n,)
            Value of the right hand side at (t, y).
        threshold : float
            Threshold for `y` value used for computing the step size as
            ``factor * np.maximum(np.abs(y), threshold)``. Typically, the value of
            absolute tolerance (atol) for a solver should be passed as `threshold`.
        factor : ndarray with shape (n,) or None
            Factor to use for computing the step size. Pass None for the very
            evaluation, then use the value returned from this function.
        sparsity : tuple (structure, groups) or None
            Sparsity structure of the Jacobian, `structure` must be csc_matrix.
        Returns
        -------
        J : ndarray or csc_matrix, shape (n, n)
            Jacobian matrix.
        factor : ndarray, shape (n,)
            Suggested `factor` for the next evaluation.
        */
        const NUM_JAC_DIFF_REJECT = Number.EPSILON ** 0.875;// = Math.pow(EPS,0.875)
        const NUM_JAC_DIFF_SMALL = Number.EPSILON ** 0.75;
        const NUM_JAC_DIFF_BIG = Number.EPSILON ** 0.25;
        const NUM_JAC_MIN_FACTOR = 1e3 * Number.EPSILON;
        const NUM_JAC_FACTOR_INCREASE = 10;
        const NUM_JAC_FACTOR_DECREASE = 0.1;
        let y = { ...y_ };
        let n = Object.keys(y_).length;
        let keys = Object.keys(y_);

        if (typeof factor === 'undefined' || factor == null) {
            factor = {};//np.full(n, EPS ** 0.5)
            for (let key of keys) {
                factor[key] = Math.sqrt(Number.EPSILON);
            }
        }
        // console.log('factor',{...factor})
        /* Direct the step as ODE dictates, hoping that such a step won't lead to
        # a problematic region. For complex ODEs it makes sense to use the real
        # part of f as we use steps along real axis. */
        let y_scale = {};
        let h = {};
        let zero_h_keys = [];
        for (let key of keys) {
            y_scale[key] = (2 * (f[key] >= 0) - 1) * Math.max(Math.abs(y[key]), threshold);//this.vecScalarMax(this.vecAbs(y),threshold);
            h[key] = (y[key] + factor[key] * y_scale[key]) - y[key];
            if (h[key] == 0) {
                zero_h_keys.push(key)
            }
        }
        // console.log('f=',{...f})
        // console.log('y_scale',{...y_scale})
        // console.log('y=',{...y});
        // console.log('pre h=',{...h})

        // Make sure that the step is not 0 to start with. Not likely it will be executed often.
        for (let i = 0; i < zero_h_keys.length; i++) {
            // console.log('h["'+zero_h_keys[i]+'"]=0')
            while (h[zero_h_keys[i]] == 0) {
                factor[zero_h_keys[i]] *= 10;
                h[zero_h_keys[i]] = (y[zero_h_keys[i]] + factor[zero_h_keys[i]] * y_scale[zero_h_keys[i]]) - y[zero_h_keys[i]];
                // console.log('h["'+zero_h_keys[i]+'"]='+h[zero_h_keys[i]])
            }
        }
        // console.log('post h=',{...h})

        // h_vecs = np.diag(h)
        let f_new = {};
        for (let key of keys) {
            let y_new = { ...y };
            y_new[key] += h[key];
            f_new[key] = fun(t, y_new)
        }
        // console.log('fnew=',f_new)
        let diff = {};
        let max_abs_ind = {};
        let max_diff = {};
        let scale = {};
        let diff_too_small = {};
        let any_diff_too_small = false;
        for (let dx of keys) {
            diff[dx] = this.vectorDiff(f_new[dx], f); // returns f_new[i]-f
            let max_arg = keys[0];
            let max_val = Math.abs(diff[max_arg]);
            for (let dy of keys) {
                let val = Math.abs(diff[dx][dy]);
                if (val > max_val) {
                    max_arg = dy;
                    max_val = val;
                }
            }
            max_abs_ind[dx] = (max_arg);
            max_diff[dx] = (max_val);
            scale[dx] = Math.max(Math.abs(f[max_arg]), Math.abs(f_new[dx][max_arg]));
            diff_too_small[dx] = max_val < (NUM_JAC_DIFF_REJECT * scale[dx]);
            if (diff_too_small[dx]) {
                any_diff_too_small = true;
            }
        }


        // diff_too_small = max_diff < NUM_JAC_DIFF_REJECT * scale
        if (any_diff_too_small) {
            let new_factor = { ...factor };
            for (let dx of keys) {
                if (diff_too_small[dx]) {
                    new_factor[dx] *= NUM_JAC_FACTOR_INCREASE;
                    let h_new_i = (y[dx] + new_factor[dx] * y_scale[dx]) - y[dx]

                    let y_new = { ...y };
                    y_new[dx] += h_new_i;
                    f_new[dx] = fun(t, y_new)

                    let diff_new = this.vectorDiff(f_new[dx], f);
                    let max_arg = keys[0];
                    let max_val = Math.abs(diff_new[max_arg]);
                    for (let dy of keys) {
                        let val = Math.abs(diff_new[dx][dy]);
                        if (val > max_val) {
                            max_arg = dy;
                            max_val = val;
                        }
                    }
                    let scale_new_dx = Math.max(Math.abs(f[max_arg]), f_new[dx][max_arg]);
                    if ((max_diff[dx] * scale_new_dx) < (max_val * scale[dx])) {
                        factor[dx] = new_factor[dx];
                        h[dx] = h_new_i;
                        diff[dx] = { ...diff_new };
                        scale[dx] = scale_new_dx;
                        max_diff[dx] = max_val;
                    }
                }
            }
        }
        // console.log('diff=',diff);
        // console.log('h=',h)

        for (let dx of keys) {
            diff[dx] = this.timesScalar(diff[dx], 1.0 / h[dx]);
            if (max_diff[dx] < NUM_JAC_DIFF_SMALL * scale[dx]) {
                factor[dx] *= NUM_JAC_FACTOR_INCREASE;
            } else if (max_diff[dx] > NUM_JAC_DIFF_BIG * scale[dx]) {
                factor[dx] *= NUM_JAC_FACTOR_DECREASE;
            }
            factor[dx] = Math.max(factor[dx], NUM_JAC_MIN_FACTOR);
        }

        return { J: diff, factor }
    };
    /**
     * Fully Array based, Finite differences Jacobian approximation
     * @param {function} fun 
     * @param {number} t 
     * @param {Array} y_ 
     * @param {Array} f 
     * @param {number} threshold 
     * @param {Array} factor 
     * @returns 
     */
    num_jac_(fun, t, y_, f, threshold) {
        this.ncalls['num_jac_'] += 1;
        let factor = this.jac_factor ? this.jac_factor.map(x => Math.min(x, 1e5)) : null;
        // console.log(factor)
        // console.log('num_jac_ called')
        /*Finite differences Jacobian approximation tailored for ODE solvers.
        This function computes finite difference approximation to the Jacobian
        matrix of `fun` with respect to `y` using forward differences.
        The Jacobian matrix has shape (n, n) and its element (i, j) is equal to
        ``d f_i / d y_j``.
        A special feature of this function is the ability to correct the step
        size from iteration to iteration. The main idea is to keep the finite
        difference significantly separated from its round-off error which
        approximately equals ``EPS * np.abs(f)``. It reduces a possibility of a
        huge error and assures that the estimated derivative are reasonably close
        to the true values (i.e., the finite difference approximation is at least
        qualitatively reflects the structure of the true Jacobian).
        Parameters
        ----------
        fun : callable
            Right-hand side of the system implemented in a vectorized fashion.
        t : float
            Current time.
        y : ndarray, shape (n,)
            Current state.
        f : ndarray, shape (n,)
            Value of the right hand side at (t, y).
        threshold : float
            Threshold for `y` value used for computing the step size as
            ``factor * np.maximum(np.abs(y), threshold)``. Typically, the value of
            absolute tolerance (atol) for a solver should be passed as `threshold`.
        factor : ndarray with shape (n,) or None
            Factor to use for computing the step size. Pass None for the very
            evaluation, then use the value returned from this function.
        sparsity : tuple (structure, groups) or None
            Sparsity structure of the Jacobian, `structure` must be csc_matrix.
        Returns
        -------
        J : ndarray or csc_matrix, shape (n, n)
            Jacobian matrix.
        factor : ndarray, shape (n,)
            Suggested `factor` for the next evaluation.
        */
        const NUM_JAC_DIFF_REJECT = Number.EPSILON ** 0.875;// = Math.pow(EPS,0.875)
        const NUM_JAC_DIFF_SMALL = Number.EPSILON ** 0.75;
        const NUM_JAC_DIFF_BIG = Number.EPSILON ** 0.25;
        const NUM_JAC_MIN_FACTOR = 1e3 * Number.EPSILON;
        const NUM_JAC_FACTOR_INCREASE = 10;
        const NUM_JAC_FACTOR_DECREASE = 0.1;
        let y = (typeof y_[0].length === 'undefined') ? y_.map(x => x) : y_.map(x => x.map(y => y));
        let keys = this.keys;
        let n = this.keys.length;

        if (typeof factor === 'undefined' || factor == null) {
            factor = new Array(n);//np.full(n, EPS ** 0.5)
            for (let i = 0; i < n; i++) {
                factor[i] = Math.sqrt(Number.EPSILON);
            }
        }
        // console.log('factor',{...factor})
        /* Direct the step as ODE dictates, hoping that such a step won't lead to
        # a problematic region. For complex ODEs it makes sense to use the real
        # part of f as we use steps along real axis. */
        let y_scale = new Array(n);
        let h = new Array(n);
        let zero_h_keys = [];
        for (let i = 0; i < n; i++) {
            y_scale[i] = (2 * (f[i] >= 0) - 1) * Math.max(Math.abs(y[i]), threshold);//this.vecScalarMax(this.vecAbs(y),threshold);
            h[i] = (y[i] + factor[i] * y_scale[i]) - y[i];
            if (h[i] == 0) {
                zero_h_keys.push(i)
            }
        }
        // console.log('f=',{...f})
        // console.log('y_scale',{...y_scale})
        // console.log('y=',{...y});
        // console.log('pre h=',{...h})

        // Make sure that the step is not 0 to start with. Not likely it will be executed often.
        for (let i = 0; i < zero_h_keys.length; i++) {
            // console.log('h["'+zero_h_keys[i]+'"]=0')
            while (h[zero_h_keys[i]] == 0) {
                factor[zero_h_keys[i]] *= 10;
                h[zero_h_keys[i]] = (y[zero_h_keys[i]] + factor[zero_h_keys[i]] * y_scale[zero_h_keys[i]]) - y[zero_h_keys[i]];
                // console.log('h["'+zero_h_keys[i]+'"]='+h[zero_h_keys[i]])
            }
        }
        // console.log('post h=',{...h})

        // h_vecs = np.diag(h)
        // let f_new = new Array(n);
        let y_news = new Array(n);
        for (let i = 0; i < n; i++) {
            y_news[i] = (typeof y[0].length === 'undefined') ? y.map(x => x) : y.map(x => x.map(y => y));
            y_news[i][i] += h[i];
        }
        let f_new = this.Transpose(fun(t, this.Transpose(y_news)));
        // console.log('fnew=',f_new)
        let diff = new Array(n);
        // for (let i=0;i<n;i++)
        //     diff[i]=new Array(n);
        let max_abs_ind = new Array(n);
        let max_diff = new Array(n);
        let scale = new Array(n);
        let diff_too_small = {};
        let any_diff_too_small = false;
        for (let i = 0; i < n; i++) {//let dx of keys
            // diff[i] = this.vectorDiff(f_new[i] , f); // returns f_new[i]-f
            diff[i] = f_new[i].map((x, i) => x - f[i]) // returns f_new[i]-f in a new Arrray
            let max_arg = 0;
            let max_val = Math.abs(diff[i][0]);
            for (let j = 0; j < n; j++) {
                let val = Math.abs(diff[i][j]);
                if (val > max_val) {
                    max_arg = j;
                    max_val = val;
                }
            }
            max_abs_ind[i] = (max_arg);
            max_diff[i] = (max_val);
            scale[i] = Math.max(Math.abs(f[i]), Math.abs(f_new[i][max_arg]));
            diff_too_small[i] = max_val < (NUM_JAC_DIFF_REJECT * scale[i]);
            if (diff_too_small[i]) {
                any_diff_too_small = true;
            }
        }
        // console.log('diff',diff)
        // console.log('abs ind',max_abs_ind)
        // console.log('max diff',max_diff);
        // console.log('scale',scale)
        // console.log('diff_too_small',diff_too_small)

        // diff_too_small = max_diff < NUM_JAC_DIFF_REJECT * scale
        if (any_diff_too_small) {
            let new_factor = factor.map(x => x);//{...factor};
            for (let i = 0; i < n; i++) {
                if (diff_too_small[i]) {
                    new_factor[i] *= NUM_JAC_FACTOR_INCREASE;
                    let h_new_i = (y[i] + new_factor[i] * y_scale[i]) - y[i]

                    let y_new = (typeof y[0].length === 'undefined') ? y.map(x => [x]) : y.map(x => x.map(y => y));
                    y_new[i] += h_new_i;
                    f_new[i] = this.Transpose(fun(t, y_new))[0]

                    let diff_new = f_new[i].map((x, i) => x - f[i]);// this.vectorDiff(f_new[dx] , f);
                    let max_arg = 0;
                    let max_val = Math.abs(diff_new[0]);
                    for (let j = 0; j < n; j++) {
                        let val = Math.abs(diff_new[j]);
                        if (val > max_val) {
                            max_arg = j;
                            max_val = val;
                        }
                    }
                    let scale_new_dx = Math.max(Math.abs(f[max_arg]), f_new[i][max_arg]);
                    if ((max_diff[i] * scale_new_dx) < (max_val * scale[i])) {
                        factor[i] = new_factor[i];
                        h[i] = h_new_i;
                        diff[i] = diff_new;
                        scale[i] = scale_new_dx;
                        max_diff[i] = max_val;
                    }
                }
            }
        }
        // console.log('factor',factor)
        // console.log('diff=',diff);
        // console.log('h=',h)

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                diff[i][j] = diff[i][j] / h[i];//this.timesScalar(diff[dx],1.0 / h[dx]);
            }

            if (max_diff[i] < NUM_JAC_DIFF_SMALL * scale[i]) {
                factor[i] *= NUM_JAC_FACTOR_INCREASE;
            } else if (max_diff[i] > NUM_JAC_DIFF_BIG * scale[i]) {
                factor[i] *= NUM_JAC_FACTOR_DECREASE;
            }
            factor[i] = Math.max(factor[i], NUM_JAC_MIN_FACTOR);
        }
        this.jac_factor = factor;
        return { J: this.Transpose(diff), factor }
    }
    // jacobian_fode_pot(t, x, stressv) {
    //     this.ncalls['jacobian_fode_pot'] ? this.ncalls['jacobian_fode_pot'] += 1 : this.ncalls['jacobian_fode_pot'] = 1;
    //     // Extract the parameters from the parameter vector:
    //     const basal = this.Basal;
    //     const param = this.Params;
    //     const Stress = stressv;
    //     //Glucose absorption model: 
    //     const k12 = param.k12, Kq1 = param.Kq1, Kq2 = param.Kq2, kmin = param.kmin,
    //         kmax = param.kmax, kabs = param.kabs, fg = param.fg,

    //         k12GIH = param.k12GIH, kabsGIH = param.kabsGIH,

    //         k12GIM = param.k12GIM, kabsGIM = param.kabsGIM,

    //         k12GIL = param.k12GIL, kabsGIL = param.kabsGIL,

    //         k12GIvL = param.k12GIvL, kabsGIvL = param.kabsGIvL,
    //         //Metformin submodel:
    //         kgo = param.kgo, kgg = param.kgg, kpg = param.kpg, kgl = param.kgl, kpl = param.kpl,
    //         klp = param.klp, vGWmax = param.vGWmax, vLmax = param.vLmax, vPmax = param.vPmax,
    //         nGW = param.nGW, nL = param.nL, nP = param.nP, phiGW50 = param.phiGW50,
    //         phiL50 = param.phiL50, phiP50 = param.phiP50, rhoO1 = param.rhoalpha, rhoO2 = param.rhobeta,
    //         alpham = param.alpham, betam = param.betam, kpo = param.kpo,

    //         //Vildagliptin submodel: 
    //         ka1 = param.ka1, ka2 = param.ka2, CL = param.CL, CLic = param.CLic, Vc = param.Vc,
    //         Vp = param.Vp, RmaxC = param.RmaxC, kdvil = param.kvd, k2vil = param.k2v,
    //         koff = param.koff, RmaxP = param.RmaxP, kdeg = param.kdeg,

    //         //Physical activity model:
    //         tHR = param.tHR, HRb = param.HRb, ne = param.ne, ae = param.ae, te = param.te,
    //         ce1 = param.ce1, ce2 = param.ce2,
    //         //Fast acting insulin:
    //         pfa = param.pfa, rfa = param.rfa, qfa = param.qfa, bfa = param.bfa,
    //         kclf = param.kclf,

    //         //Long acting insulin:
    //         pla = param.pla, rla = param.rla, qla = param.qla, bla = param.bla,
    //         Cmax = param.Cmax, kla = param.kla, kcll = param.kcll,

    //         //Pancreas submodel
    //         zeta1 = param.zeta1, zeta2 = param.zeta2, kdmdpan = param.ml0 * param.Kl,
    //         Kpan = param.Ks, //Kpan
    //         gammapan = param.gammapan,
    //         alphapan = param.alphapan,
    //         betapan = param.betapan, N1 = param.N1, N2 = param.N2,
    //         KILLPAN = param.KILLPAN,
    //         Sfactor = param.Sfactor,
    //         //Insulin submodel:
    //         VIB = param.VIB, VIH = param.VIH, QIB = param.QIB, QIL = param.QIL,
    //         QIK = param.QIK, QIP = param.QIP, QIH = param.QIH,
    //         QIG = param.QIG, VIG = param.VIG, VIL = param.VIL, QIA = param.QIA, VIK = param.VIK,
    //         VIPC = param.VIPC, VIPF = param.VIPF, TIP = param.TIP,


    //         //Glucose submodel:
    //         VGBC = param.VGBC, QGB = param.QGB, VGBF = param.VGBF, TGB = param.TGB,
    //         VGH = param.VGH, QGL = param.QGL,
    //         QGK = param.QGK, QGP = param.QGP, QGH = param.QGH, VGG = param.VGG,
    //         QGG = param.QGG, VGL = param.VGL, QGA = param.QGA, VGK = param.VGK,
    //         VGPC = param.VGPC, VGPF = param.VGPF, TGP = param.TGP, alphae = param.alphae,
    //         betae = param.betae,

    //         //Glucagon submodel:
    //         VGamma = param.VGamma,


    //         //GLP-1 submodel:
    //         VPSI = param.VPSI, Kout = param.Kout, CF2 = param.CF2,
    //         tpsi = param.tpsi, kpsi = param.zeta,

    //         //GLP-1 agonists:
    //         ah2 = param.ah2, bh2 = param.bh2, ch2 = param.ch2,
    //         ah24 = param.ah24, bh24 = param.bh24, ch24 = param.ch24,

    //         //rates:
    //         cIPGU = param.c1, cIHGPinft = param.c2,
    //         cGHGP = param.c3, cIHGUinft = param.c4, cGHGU = param.c5,
    //         dIPGU = param.d1, dIHGPinft = param.d2, dGHGP = param.d3,
    //         dIHGUinft = param.d4, dGHGU = param.d5,
    //         SHGP = param.SHGP,
    //         SHGU = param.SHGU,
    //         SPGU = param.SPGU,

    //         // Extract states from state vector:
    //         //Glucose absorption model: 
    //         qss = x[15], qsl = x[16], qint = x[17],
    //         De = x[46], DNq = x[47],
    //         qssGIH = x[57], qslGIH = x[58], qintGIH = x[59],
    //         qssGIM = x[60], qslGIM = x[61], qintGIM = x[62],
    //         qssGIL = x[63], qslGIL = x[64], qintGIL = x[65],
    //         qssGIvL = x[66], qslGIvL = x[67], qintGIvL = x[68],

    //         //Metformin submodel:
    //         MO1 = x[18], MO2 = x[19], MGl = x[20], MGW = x[21], ML = x[22],
    //         MP = x[23],

    //         //Vildagliptin submodel: 
    //         AG1 = x[24], AG2 = x[25], Ac = x[26], Ap = x[27], DRc = x[28],
    //         DRp = x[29],

    //         //Physical activity model:
    //         E1 = x[30], E2 = x[31],
    //         TE = x[48],
    //         //Fast acting insulin:
    //         Hfa = x[32], Dfa = x[33], Ifa = x[55],

    //         //Long acting insulin:
    //         Bla = x[34], Hla = x[35], Dla = x[36], Ila = x[54],

    //         //Pancreas submodel
    //         ml = x[37], P = x[38], R = x[39],

    //         //Insulin submodel:
    //         IB = x[8], IH = x[9], IG = x[10], IL = x[11], IK = x[12],
    //         IPC = x[13], IPF = x[14],

    //         //Glucose submodel:
    //         GBC = x[0], GBF = x[1], GH = x[2], GG = x[3], GL = x[4],
    //         GK = x[5], GPC = x[6], GPF = x[7],

    //         //Glucagon submodel:
    //         Gamma = x[40],

    //         //GLP-1 submodel:    
    //         psi = x[41], PSI = x[42],

    //         //GLP-1 agonists

    //         //Daily GLP-1
    //         psih2 = x[69], PSIh2 = x[70],

    //         //Weekly GLP-1
    //         psih24 = x[71], PSIh24 = x[72],

    //         //rates:
    //         MIHGP = x[43],
    //         fr = x[44],
    //         MIHGU = x[45],

    //         //Total glucose consumption: 
    //         XGC = x[49],
    //         //Total Glucose production and appearance: 
    //         XGP = x[50],
    //         //Total insulin consumption: 
    //         XIC = x[51],
    //         //Secreted inuslin: 
    //         XIS = x[52],
    //         //Injected insulin: 
    //         XIinj = x[53],

    //         //Integrated hepatic glucose
    //         GHint = x[56],
    //         // Basal values and constant rates:
    //         GBPF = basal.GPF, IBPF = basal.IPF, IBL = basal.IL, GBL = basal.GL,
    //         GammaB = basal.Gamma,

    //         SB = basal.SB,
    //         GBH = basal.GH,
    //         IBH = basal.IH,
    //         rBPIR = basal.rPIR,
    //         rBGU = basal.rBGU,
    //         rRBCU = basal.rRBCU,
    //         rGGU = basal.rGGU,
    //         rBPGU = basal.rPGU,
    //         rBHGP = basal.rHGP,
    //         rBHGU = basal.rHGU;


    //     let t2 = E2 * alphae,
    //         t3 = PSIh2 * ch2,
    //         t4 = PSIh24 * ch24,
    //         t5 = MGW ** nGW,
    //         t6 = ML ** nL,
    //         t7 = MP ** nP,
    //         t8 = N1 * zeta1,
    //         t9 = ch2 * zeta2,
    //         t10 = ch24 * zeta2,
    //         t11 = phiGW50 ** nGW,
    //         t12 = phiL50 ** nL,
    //         t13 = phiP50 ** nP,
    //         t14 = Dfa ** 2,
    //         t15 = Dla ** 2,
    //         t16 = Hla + 1.0,
    //         t17 = IPF + 1.0,
    //         t18 = Ifa + 1.0,
    //         t19 = Ila + 1.0,
    //         t20 = Stress + 1.0,
    //         t21 = DNq * Kq1,
    //         t22 = DNq * Kq2,
    //         t25 = 1.0 / DNq,
    //         t27 = 1.0 / GBH,
    //         t28 = 1.0 / GBL,
    //         t29 = 1.0 / GBPF,
    //         t30 = 1.0 / GammaB,
    //         t31 = 1.0 / HRb,
    //         t32 = 1.0 / IBH,
    //         t33 = 1.0 / IBL,
    //         t34 = 1.0 / IBPF,
    //         t35 = Kq1 - 1.0,
    //         t36 = 1.0 / Kq2,
    //         t37 = 1.0 / QIP,
    //         t38 = -RmaxC,
    //         t39 = -RmaxP,
    //         t40 = 1.0 / SB,
    //         t41 = 1.0 / TGB,
    //         t42 = 1.0 / TGP,
    //         t43 = 1.0 / TIP,
    //         t44 = 1.0 / VGBC,
    //         t45 = 1.0 / VGG,
    //         t46 = 1.0 / VGH,
    //         t47 = 1.0 / VGK,
    //         t48 = 1.0 / VGL,
    //         t49 = 1.0 / VGPC,
    //         t50 = 1.0 / VGPF,
    //         t51 = 1.0 / VGamma,
    //         t52 = 1.0 / VIB,
    //         t53 = 1.0 / VIG,
    //         t54 = 1.0 / VIH,
    //         t55 = 1.0 / VIK,
    //         t56 = 1.0 / VIL,
    //         t57 = 1.0 / VIPC,
    //         t58 = 1.0 / VIPF,
    //         t59 = 1.0 / VPSI,
    //         t60 = 1.0 / Vc,
    //         t62 = 1.0 / Vp,
    //         t64 = 1.0 / ae,
    //         t65 = dGHGP - 1.0,
    //         t66 = dGHGU - 1.0,
    //         t67 = dIPGU - 1.0,
    //         t68 = -kmin,
    //         t69 = -koff,
    //         t70 = nGW - 1.0,
    //         t71 = nL - 1.0,
    //         t72 = nP - 1.0,
    //         t73 = ne - 1.0,
    //         t74 = Stress - 1.0,
    //         t75 = 1.0 / te,
    //         t76 = 1.0 / tpsi,
    //         t79 = R / 2.0,
    //         t80 = kmax / 2.0,
    //         t81 = kmin / 2.0,
    //         t111 = qsl + qslGIH + qslGIL + qslGIM + qslGIvL,
    //         t112 = GK / 2.0e+1,
    //         t136 = GH ** (1.51e+2 / 5.0e+1),
    //         t140 = GH ** (2.27e+2 / 1.0e+2),
    //         t141 = GH ** (3.27e+2 / 1.0e+2),
    //         t142 = GK * (1.09e+2 / 1.25e+2),
    //         t143 = GK * (1.1e+1 / 1.0e+3),
    //         t157 = GH ** (5.29e+2 / 1.0e+2),
    //         t23 = ch2 * t8,
    //         t24 = ch24 * t8,
    //         t26 = t25 ** 2,
    //         t61 = t60 ** 2,
    //         t63 = t62 ** 2,
    //         t77 = t8 + zeta2,
    //         t78 = t2 + 1.0,
    //         t82 = -t21,
    //         t83 = -t22,
    //         t84 = 1.0 / t16,
    //         t86 = 1.0 / t17,
    //         t88 = 1.0 / t18,
    //         t90 = 1.0 / t19,
    //         t92 = GL * t28,
    //         t93 = IL * t33,
    //         t94 = IPF * t34,
    //         t95 = DRc + t38,
    //         t96 = DRp + t39,
    //         t97 = Ac * t60,
    //         t98 = Ap * t62,
    //         t99 = CLic * t62,
    //         t100 = t2 - 1.0,
    //         t101 = QGG * t45,
    //         t102 = QIB * t52,
    //         t103 = QIG * t53,
    //         t104 = VIPF * t43,
    //         t105 = MGW ** t70,
    //         t106 = ML ** t71,
    //         t107 = MP ** t72,
    //         t108 = cGHGP * t65,
    //         t109 = cGHGU * t66,
    //         t110 = cIPGU * t67,
    //         t113 = -t79,
    //         t114 = -t81,
    //         t115 = 1.0 / t35,
    //         t116 = t58 * 2.0e+1,
    //         t117 = -t75,
    //         t118 = -t112,
    //         t119 = t5 + t11,
    //         t120 = t6 + t12,
    //         t121 = t7 + t13,
    //         t122 = pfa * qfa * t14 * 3.0,
    //         t123 = pla * qla * t15 * 3.0,
    //         t127 = t25 * (5.0 / 2.0),
    //         t137 = PSI + t3 + t4,
    //         t138 = t37 * (1.7e+1 / 3.0),
    //         t145 = t112 - 2.3e+1,
    //         t146 = E1 * t31 * t64,
    //         t160 = GH * t27 * (5.3e+1 / 5.0e+1),
    //         t167 = Gamma * t30 * (3.9e+1 / 1.0e+2),
    //         t168 = IH * t32 * (2.09e+2 / 5.0e+1),
    //         t174 = t142 + 3.3e+2,
    //         t199 = t136 * (5.93e+2 / 1.0e+2),
    //         t200 = t143 - 2.53e+2 / 5.0e+1,
    //         t85 = t84 ** 2,
    //         t87 = t86 ** 2,
    //         t89 = t88 ** 2,
    //         t91 = t90 ** 2,
    //         t124 = Math.tanh(t108),
    //         t125 = Math.tanh(t109),
    //         t126 = Math.tanh(t110),
    //         t128 = -t116,
    //         t129 = kdvil + t97,
    //         t130 = kdvil + t98,
    //         t131 = t9 + t23,
    //         t132 = t10 + t24,
    //         t133 = -t92,
    //         t134 = -t93,
    //         t135 = -t94,
    //         t139 = Cmax * kla * t84,
    //         t144 = t118 + 2.3e+1,
    //         t150 = 1.0 / t119,
    //         t152 = 1.0 / t120,
    //         t154 = 1.0 / t121,
    //         t158 = t137 * zeta1,
    //         t159 = t137 * zeta2,
    //         t162 = Math.exp(t145),
    //         t172 = t146 ** ne,
    //         t173 = t80 + t114,
    //         t178 = Math.tanh(t167),
    //         t186 = t146 ** t73,
    //         t196 = Kq1 * t115 * t127,
    //         t197 = qss + qssGIH + qssGIL + qssGIM + qssGIvL + t82 + t111,
    //         t198 = qss + qssGIH + qssGIL + qssGIM + qssGIvL + t83 + t111,
    //         t210 = Math.tanh(t200),
    //         t223 = t160 - 4.982e-1,
    //         t234 = t168 - 2.5916,
    //         t270 = t199 + 2.479001303020554,
    //         t147 = dGHGP + t133,
    //         t148 = dGHGU + t133,
    //         t149 = dIPGU + t135,
    //         t151 = t150 ** 2,
    //         t153 = t152 ** 2,
    //         t155 = t154 ** 2,
    //         t156 = Bla * Cmax * kla * t85,
    //         t161 = Math.exp(t144),
    //         t163 = 1.0 / t129,
    //         t165 = 1.0 / t130,
    //         t180 = t162 + 1.0,
    //         t181 = t172 + 1.0,
    //         t182 = t125 * (2.83e+2 / 5.0e+1),
    //         t183 = t6 * t152 * vLmax,
    //         t184 = t7 * t154 * vPmax,
    //         t185 = t178 ** 2,
    //         t187 = t124 * (1.41e+2 / 1.0e+2),
    //         t191 = SPGU * t126 * (1.63e+2 / 2.5e+1),
    //         t212 = t128 + t138,
    //         t213 = t178 * (2.7e+1 / 1.0e+1),
    //         t214 = nGW * t105 * t150 * vGWmax,
    //         t215 = nL * t106 * t152 * vLmax,
    //         t216 = nP * t107 * t154 * vPmax,
    //         t219 = t210 ** 2,
    //         t226 = t210 * 7.1e+1,
    //         t231 = Math.tanh(t223),
    //         t235 = Math.tanh(t234),
    //         t248 = (t198 * (5.0 / 2.0)) / t22,
    //         t249 = (t127 * t198) / t22,
    //         t255 = t115 * t127 * t197,
    //         t256 = t26 * t115 * t197 * (5.0 / 2.0),
    //         t272 = 1.0 / t270,
    //         t164 = t163 ** 2,
    //         t166 = t165 ** 2,
    //         t169 = cGHGP * t147,
    //         t170 = cGHGU * t148,
    //         t171 = cIPGU * t149,
    //         t179 = t161 + 1.0,
    //         t193 = 1.0 / t180,
    //         t201 = t184 + 1.0,
    //         t202 = 1.0 / t181,
    //         t207 = k2vil * t97 * t163,
    //         t208 = k2vil * t98 * t165,
    //         t209 = t183 - 1.0,
    //         t211 = t185 - 1.0,
    //         t217 = -t213,
    //         t221 = 1.0 / t212,
    //         t224 = t187 + 7.1e+1 / 5.0e+1,
    //         t225 = t182 - 2.83e+2 / 5.0e+1,
    //         t228 = nGW * t5 * t105 * t151 * vGWmax,
    //         t229 = nL * t6 * t106 * t153 * vLmax,
    //         t230 = nP * t7 * t107 * t155 * vPmax,
    //         t232 = k2vil * t60 * t95 * t163,
    //         t233 = k2vil * t62 * t96 * t165,
    //         t242 = t191 - 7.03e+2 / 1.0e+2,
    //         t245 = t226 + 7.1e+1,
    //         t251 = Math.tanh(t248),
    //         t252 = t219 * (7.81e+2 / 1.0e+3),
    //         t257 = Math.tanh(t255),
    //         t260 = t127 + t249,
    //         t269 = t196 + t256,
    //         t273 = t272 ** 2,
    //         t282 = t141 * t272,
    //         t289 = t140 * t272 * (3.27e+2 / 1.0e+2),
    //         t290 = t140 * t272 * (3.27e+2 / 2.0e+2),
    //         t175 = Math.tanh(t169),
    //         t176 = Math.tanh(t170),
    //         t177 = Math.tanh(t171),
    //         t192 = 1.0 / t179,
    //         t195 = t193 ** 2,
    //         t203 = t202 ** 2,
    //         t227 = fr + t217,
    //         t237 = Ac * k2vil * t61 * t95 * t164,
    //         t238 = Ap * k2vil * t63 * t96 * t166,
    //         t239 = -t228,
    //         t240 = -t229,
    //         t241 = -t230,
    //         t243 = 1.0 / t224,
    //         t244 = 1.0 / t225,
    //         t250 = 1.0 / t242,
    //         t253 = t251 ** 2,
    //         t258 = t257 ** 2,
    //         t262 = t252 - 7.81e+2 / 1.0e+3,
    //         t263 = ne * t31 * t64 * t186 * t202,
    //         t283 = t251 + t257 - 2.0,
    //         t284 = -t282,
    //         t285 = t282 / 2.0,
    //         t291 = t282 ** (1.1e+1 / 1.0e+2),
    //         t294 = t282 ** (1.11e+2 / 1.0e+2),
    //         t299 = t157 * t273 * 1.79086e+1,
    //         t303 = t157 * t273 * 8.9543,
    //         t188 = t175 ** 2,
    //         t189 = t176 ** 2,
    //         t190 = t177 ** 2,
    //         t194 = t192 ** 2,
    //         t218 = t176 * (2.83e+2 / 5.0e+1),
    //         t220 = t175 * (1.41e+2 / 1.0e+2),
    //         t222 = SPGU * t177 * (1.63e+2 / 2.5e+1),
    //         t236 = t192 * (1.09e+2 / 1.25e+2),
    //         t259 = t253 - 1.0,
    //         t261 = t258 - 1.0,
    //         t264 = t214 + t239,
    //         t265 = t215 + t240,
    //         t266 = t216 + t241,
    //         t274 = ne * t31 * t64 * t172 * t186 * t203,
    //         t277 = t193 * t262,
    //         t278 = (t162 * t195 * t245) / 2.0e+1,
    //         t286 = R + t284,
    //         t287 = -t285,
    //         t295 = t113 + t285,
    //         t302 = -t299,
    //         t304 = t173 * t283,
    //         t305 = -t303,
    //         t314 = t158 + t294,
    //         t204 = t188 - 1.0,
    //         t205 = t189 - 1.0,
    //         t206 = t190 - 1.0,
    //         t246 = t220 + 7.1e+1 / 5.0e+1,
    //         t247 = t218 - 2.83e+2 / 5.0e+1,
    //         t254 = t222 - 7.03e+2 / 1.0e+2,
    //         t267 = (t161 * t174 * t194) / 2.0e+1,
    //         t268 = (t259 * (5.0 / 2.0)) / t22,
    //         t271 = t115 * t127 * t261,
    //         t275 = -t274,
    //         t279 = -t278,
    //         t280 = -t277,
    //         t288 = N2 * t286,
    //         t292 = t259 * t260,
    //         t296 = t79 + t287,
    //         t297 = Math.exp(t295),
    //         t306 = -t304,
    //         t315 = N1 * t314,
    //         t318 = t261 * t269,
    //         t339 = t289 + t302,
    //         t340 = t290 + t305,
    //         t276 = MIHGU * alphae * rBHGU * t244 * t247,
    //         t281 = MIHGU * cGHGU * rBHGU * t28 * t78 * t205 * t244 * (2.83e+2 / 5.0e+1),
    //         t293 = -t288,
    //         t298 = Math.exp(t296),
    //         t300 = t297 + 1.0,
    //         t311 = kmin + t306,
    //         t319 = rBPGU * t29 * t78 * t201 * t250 * t254,
    //         t324 = t159 + t315,
    //         t325 = t268 + t271,
    //         t326 = MIHGP * alphae * rBHGP * t20 * t209 * t227 * t243 * t246,
    //         t327 = MIHGP * cGHGP * rBHGP * t20 * t28 * t100 * t204 * t209 * t227 * t243 * (1.41e+2 / 1.0e+2),
    //         t341 = N2 * t339,
    //         t342 = t292 + t318,
    //         t360 = N1 * t291 * t339 * (1.11e+2 / 1.0e+2),
    //         t301 = t298 + 1.0,
    //         t307 = 1.0 / t300,
    //         t313 = kpsi * t311,
    //         t328 = qsl * t173 * t325,
    //         t329 = qslGIH * t173 * t325,
    //         t330 = qslGIL * t173 * t325,
    //         t331 = qslGIM * t173 * t325,
    //         t332 = qslGIvL * t173 * t325,
    //         t338 = kpsi * t111 * t173 * t325,
    //         t343 = t293 + t324,
    //         t345 = qsl * t173 * t342,
    //         t346 = qslGIH * t173 * t342,
    //         t347 = qslGIL * t173 * t342,
    //         t348 = qslGIM * t173 * t342,
    //         t349 = qslGIvL * t173 * t342,
    //         t366 = t341 + t360,
    //         t308 = 1.0 / t301,
    //         t309 = t307 ** 2,
    //         t316 = t77 * t307,
    //         t320 = t131 * t307,
    //         t322 = t132 * t307,
    //         t333 = -t328,
    //         t334 = -t329,
    //         t335 = -t330,
    //         t336 = -t331,
    //         t337 = -t332,
    //         t350 = t307 * t324,
    //         t359 = t313 + t338,
    //         t364 = t307 * t360,
    //         t310 = t308 ** 2,
    //         t312 = N2 * t308,
    //         t317 = t77 * t308,
    //         t321 = t131 * t308,
    //         t323 = t132 * t308,
    //         t361 = t308 * t343,
    //         t362 = (t297 * t309 * t324) / 2.0,
    //         t367 = t297 * t309 * t324 * t340,
    //         t372 = t308 * t366,
    //         t344 = t316 + t317,
    //         t351 = t320 + t321,
    //         t352 = t322 + t323,
    //         t363 = -t362,
    //         t365 = (t298 * t310 * t343) / 2.0,
    //         t368 = -t367,
    //         t369 = t350 + t361,
    //         t373 = t298 * t310 * t340 * t343,
    //         t353 = Sfactor * ml * rBPIR * t40 * t344 * (2.0 / 5.0),
    //         t354 = Sfactor * ml * rBPIR * t40 * t74 * t344,
    //         t355 = Sfactor * ml * rBPIR * t40 * t351 * (2.0 / 5.0),
    //         t356 = Sfactor * ml * rBPIR * t40 * t352 * (2.0 / 5.0),
    //         t357 = Sfactor * ml * rBPIR * t40 * t74 * t351,
    //         t358 = Sfactor * ml * rBPIR * t40 * t74 * t352,
    //         t370 = Sfactor * rBPIR * t40 * t369 * (2.0 / 5.0),
    //         t371 = Sfactor * rBPIR * t40 * t74 * t369,
    //         t374 = t312 + t363 + t365,
    //         t377 = t364 + t368 + t372 + t373,
    //         t375 = Sfactor * ml * rBPIR * t40 * t374 * (2.0 / 5.0),
    //         t376 = Sfactor * ml * rBPIR * t40 * t74 * t374,
    //         t378 = Sfactor * ml * rBPIR * t40 * t377 * (2.0 / 5.0),
    //         t379 = Sfactor * ml * rBPIR * t40 * t74 * t377,
    //         mt = [-k12, k12 + t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t338, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, 0, t336, t331, 0, t335, t330, 0, t337, t332, 0, 0, 0, 0, 0, t68 + t304 + t333, t311 + t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t359, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, 0, t336, t331, 0, t335, t330, 0, t337, t332, 0, 0, 0, 0, 0, 0, -kabs, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabs * t45, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabs, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -alpham, 0, rhoO1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -betam, rhoO2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //         -kgg - kgo, kgg, 0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -kgl, kgl, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -rGGU * t45 * t264, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, rGGU * t264, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -klp, klp, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //         -MIHGP * rBHGP * t20 * t48 * t100 * t227 * t243 * t246 * t265, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -MIHGP * rBHGP * t20 * t100 * t227 * t243 * t246 * t265, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, kpg, kpl, -kpg - kpl - kpo, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -GPF * rBPGU * t29 * t50 * t78 * t250 * t254 * t266, 0, 0, 0, 0, 0, 0, 0, 0, 0, GPF * rBPGU * t29 * t78 * t250 * t254 * t266, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -ka1, ka1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -ka2, ka2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t232 - t237 - t60 * (CL + CLic), CLic * t60, -t232 + t237, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t99, -t99 + t233 - t238, 0, -t233 + t238, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, koff + t207, 0, kdeg + t69 - t207, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, CF2 * PSI * t59, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, koff + t208, 0,
    //         -kdeg + t69 - t208, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1.0 / tHR, t263 + t275 - E2 * (t263 + t275), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -GPF * betae * t42, 0, 0, 0, 0, 0, 0, 0, 0, t75 * (ce1 * t263 + ce1 * t275), GPF * QGP * betae, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t117 - t172 * t202, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t48 * (t276 + t326), 0, 0, -GPF * alphae * rBPGU * t29 * t50 * t201 * t250 * t254, 0, 0, 0, 0, 0, 0, 0, 0, 0, t276 + GPF * alphae * rBPGU * t29 * t201 * t250 * t254, -t326, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -pfa, pfa, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t122, -t122 - bfa * t88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, VIPF * bfa * rfa * t86, 0, bfa * rfa * t88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t139, t139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t156, -pla - t156, pla, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t123, -t123 - bla * t90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, VIPF * bla * rla * t86, bla * rla * t90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -Kpan - Sfactor * t369, 0, 0, 0, 0, 0, -t56 * (t370 + t371), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t370, -t371, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, gammapan, -alphapan, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Sfactor * ml * t374, 0, -betapan, 0, 0, 0, t56 * (t375 + t376), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t375, t376, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t102, QIB * t54, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t102, -QIH * t54, t103, QIA * t56 * (3.0 / 5.0), QIK * t55, QIP * t57, 0, 0, 0, 0, 0, 0, 0, 0, 0, t20 * t32 * t51 * (t231 * (6.1e+1 / 1.0e+2) - 1.31e+2 / 1.0e+2) * (t235 ** 2 - 1.0) * (-7.949942e+1), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QIA * (2.0 / 5.0), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t103, QIG * t56 * (3.0 / 5.0), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QIG * (2.0 / 5.0), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QIL * t54, 0, -QIL * t56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (SHGP * cIHGPinft * t33 * (Math.tanh(cIHGPinft * (dIHGPinft + t134)) ** 2 - 1.0) * 4.56e-2) / (SHGP * Math.tanh(cIHGPinft * (dIHGPinft - 1.0)) * (5.7e+1 / 5.0e+1) + 1.21e+2 / 1.0e+2), 0, (cIHGUinft * t33 * (Math.tanh(cIHGUinft * (dIHGUinft + t134)) ** 2 - 1.0)) / (Math.tanh(cIHGUinft * (dIHGUinft - 1.0)) * 2.5e+1), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QIK * t54, 0, 0, QIK * t55 * (-1.3e+1 / 1.0e+1), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QIK * (3.0 / 1.0e+1), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t57 * (QIP + t104), t43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QIP * t54, 0, 0, 0, t57 * t104, -t58 * (t104 + t221), 0, 0, 0,
    //             0, 0, 0, 0, GPF * SPGU * cIPGU * rBPGU * t29 * t34 * t50 * t78 * t201 * t206 * t250 * (-1.63e+2 / 2.5e+1), 0, 0, 0, 0, 0, 0, 0, 0, 0, GPF * SPGU * cIPGU * rBPGU * t29 * t34 * t78 * t201 * t206 * t250 * (1.63e+2 / 2.5e+1), 0, t221, 0, -Dfa * VIPF * bfa * rfa * t87 - Dla * VIPF * bla * rla * t87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t44 * (QGB + VGBF * t41), t41, QGB * t46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, VGBF * t41 * t44, -t41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -Sfactor * ml * t377, alphapan * t291 * t339 * (1.11e+2 / 1.0e+2), betapan * t339, 0, 0, 0, -t56 * (t378 + t379), 0, 0, 0, QGB * t44, 0, -QGH * t46, t101, QGA * t48, QGK * t47, QGP * t49, 0, t20 * t27 * t51 * (t235 * (2.09e+2 / 1.0e+2) - 2.93e+2 / 1.0e+2) * (t231 ** 2 - 1.0) * (-5.88406), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t378, -t379, 0, 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t101, QGG * t48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QGL * t46, 0, -t48 * (QGL + t281 + t327), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t281, -t327, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //         QGK * t46, 0, 0, -t47 * (QGK + t236 + t267 + t279 + t280), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t236 + t267 + t279 + t280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, QGP * t46, 0, 0, 0, -t49 * (QGP + VGPF * t42), t42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, VGPF * t42 * t49, -t50 * (t319 + VGPF * t42 * (E1 * betae + 1.0)), 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, t319 + E1 * QGP * betae, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, MIHGP * rBHGP * t20 * t30 * t48 * t100 * t209 * t211 * t243 * t246 * (-1.053), 0, 0, 0, t51 * (-9.1e+1 / 1.0e+1), 0, 0, 0, t30 * t211 * (-8.1081e-3), 0, 0, 0, 0, 0, MIHGP * rBHGP * t20 * t30 * t100 * t209 * t211 * t243 * t246 * (-1.053), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t76, t59 * t76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -Sfactor * ml * t344, alphapan * zeta1, 0, 0, 0, 0, -t56 * (t353 + t354), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -t59 * (Kout - CF2 * t95), 0, 0, 0, 0, 0, 0, 0, 0, t353, -t354, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -rBHGP * t20 * t48 * t100 * t209 * t227 * t243 * t246, 0, 0, 0, 0, 0, 0,
    //         -1.0 / 2.5e+1, 0, 0, 0, 0, 0, 0, -rBHGP * t20 * t100 * t209 * t227 * t243 * t246, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -MIHGP * rBHGP * t20 * t48 * t100 * t209 * t243 * t246, 0, 0, 0, 0, 0, 0, 0, -1.54e-2, 0, 0, 0, 0, 0, -MIHGP * rBHGP * t20 * t100 * t209 * t243 * t246, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -rBHGU * t48 * t78 * t244 * t247, 0, 0, 0, 0, 0, 0, 0, 0, -1.0 / 2.5e+1,
    //             0, 0, 0, rBHGU * t78 * t244 * t247, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t345, -t345, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -kpsi * t111 * t173 * t342, 0, 0, 0, 0, 0, t68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t346, -t346, 0, t348, -t348, 0, t347, -t347, 0, t349, -t349, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t117, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Dla * bla * t91, 0, 0, 0, 0, 0, 0, 0, 0, 1.0e+1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -kcll - Dla * bla * rla * t91, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Dfa * bfa * t89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.0e+1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -kclf - Dfa * bfa * rfa * t89, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t338, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k12GIH, k12GIH + t334, t329, 0, t336, t331, 0, t335, t330, 0, t337, t332, 0, 0, 0, 0, 0, t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, t359, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t68 + t304 + t334, t311 + t329, 0, t336, t331, 0, t335, t330, 0, t337, t332, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabsGIH * t45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabsGIH, 0, 0, 0, 0, 0, 0, 0, 0, -kabsGIH, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t338, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, -k12GIM, k12GIM + t336, t331, 0, t335, t330, 0, t337, t332, 0, 0, 0, 0,
    //             0, t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t359, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, 0, t68 + t304 + t336, t311 + t331, 0, t335, t330, 0, t337, t332, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabsGIM * t45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabsGIM, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -kabsGIM, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             t338, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, 0, t336, t331, -k12GIL, k12GIL + t335, t330, 0, t337, t332, 0, 0, 0, 0, 0, t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t359, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, 0, t336, t331, 0, t68 + t304 + t335, t311 + t330, 0, t337, t332, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabsGIL * t45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabsGIL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -kabsGIL, 0, 0, 0, 0, 0, 0, 0, 0, t333, t328, 0,
    //             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t338, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, 0, t336, t331, 0, t335, t330, -k12GIvL, k12GIvL + t337, t332, 0, 0, 0, 0, 0, t333, t328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t359, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t334, t329, 0, t336, t331, 0, t335, t330, 0, t68 + t304 + t337, t311 + t332, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fg * kabsGIvL * t45, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //             0, 0, 0, 0, 0, fg * kabsGIvL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -kabsGIvL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -ah2, ah2 * bh2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -Sfactor * ml * t351, alphapan * ch2 * zeta1, 0, 0, 0, 0, -t56 * (t355 + t357), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t355, -t357, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //         -bh2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -ah24, ah24 * bh24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -Sfactor * ml * t352, alphapan * ch24 * zeta1, 0, 0, 0, 0, -t56 * (t356 + t358), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, t356, -t358, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -bh24];
    //     //J = reshape([mt1, mt2, mt3, mt4, mt5, mt6, mt7, mt8, mt9, mt10, mt11, mt12, mt13, mt14, mt15, mt16, mt17, mt18, mt19, mt20, mt21, mt22, mt23, mt24, mt25, mt26, mt27, mt28, mt29, mt30, mt31, mt32], 73, 73);
    //     let k = 0;
    //     let J = new Array(this.n);
    //     for (let row = 0; row < this.n; row++)
    //         J[row] = new Array(this.n);

    //     let nans = false;
    //     for (let col = 0; col < this.n; col++)
    //         for (let row = 0; row < this.n; row++) {
    //             J[row][col] = mt[k]
    //             if (isNaN(J[row][col])) {
    //                 nans = true;
    //             }
    //             k++;
    //         }
    //     return J;
    // }

    // def _dense_num_jac(fun, t, y, f, h, factor, y_scale):
    //     n = y.shape[0]
    //     h_vecs = np.diag(h)
    //     f_new = fun(t, y[:, None] + h_vecs)
    //     diff = f_new - f[:, None]
    //     max_ind = np.argmax(np.abs(diff), axis=0)
    //     r = np.arange(n)
    //     max_diff = np.abs(diff[max_ind, r])
    //     scale = np.maximum(np.abs(f[max_ind]), np.abs(f_new[max_ind, r]))

    //     diff_too_small = max_diff < NUM_JAC_DIFF_REJECT * scale
    //     if np.any(diff_too_small):
    //         ind, = np.nonzero(diff_too_small)
    //         new_factor = NUM_JAC_FACTOR_INCREASE * factor[ind]
    //         h_new = (y[ind] + new_factor * y_scale[ind]) - y[ind]
    //         h_vecs[ind, ind] = h_new
    //         f_new = fun(t, y[:, None] + h_vecs[:, ind])
    //         diff_new = f_new - f[:, None]
    //         max_ind = np.argmax(np.abs(diff_new), axis=0)
    //         r = np.arange(ind.shape[0])
    //         max_diff_new = np.abs(diff_new[max_ind, r])
    //         scale_new = np.maximum(np.abs(f[max_ind]), np.abs(f_new[max_ind, r]))

    //         update = max_diff[ind] * scale_new < max_diff_new * scale[ind]
    //         if np.any(update):
    //             update, = np.nonzero(update)
    //             update_ind = ind[update]
    //             factor[update_ind] = new_factor[update]
    //             h[update_ind] = h_new[update]
    //             diff[:, update_ind] = diff_new[:, update]
    //             scale[update_ind] = scale_new[update]
    //             max_diff[update_ind] = max_diff_new[update]

    //     diff /= h

    //     factor[max_diff < NUM_JAC_DIFF_SMALL * scale] *= NUM_JAC_FACTOR_INCREASE
    //     factor[max_diff > NUM_JAC_DIFF_BIG * scale] *= NUM_JAC_FACTOR_DECREASE
    //     factor = np.maximum(factor, NUM_JAC_MIN_FACTOR)

    //     return diff, factor

    // }
}

export default Sim;