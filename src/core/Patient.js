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
// const pmol_per_U = 6000;

// physiological model of virtual patient
class Patient {
	
	constructor(params) {
		super(params);
		this.id = "Patient 1";
		// list of state variables
		this.stateList = {
			"HBA1C": { unit: "[mmol/mol]" , html: "HBA1C"},
			"qss":{ unit: "[mg]" , html: "qss"},
			"qsl"  :  { unit: "[mg]" , html: "qsl"},
			"qint"  :  { unit: "[mg]" , html: "qint"},
			"De"  :  { unit: "[mg]" , html: "De"},
			"DNq"  :  { unit: "[mg]" , html: "DNq"},
			"GBC"  :  { unit: "[mmol/L]" , html: "GBC"},
			"GBF"  :  { unit: "[mmol/L]" , html: "GBF"},
			"GH"  :  { unit: "[mmol/L]" , html: "GH"},
			"GG"  :  { unit: "[mmol/L]" , html: "GG"},
			"GL"  :  { unit: "[mmol/L]" , html: "GL"},
			"GK"  :  { unit: "[mmol/L]" , html: "GK"},
			"GPC"  :  { unit: "[mmol/L]" , html: "GPC"},
			"GPF"  :  { unit: "[mmol/L]" , html: "GPF"},
			"MO1"  :  { unit: "[μg]" , html: "MO1"},
			"MO2"  :  { unit: "[μg]" , html: "MO2"},
			"MGl"  :  { unit: "[μg]" , html: "MGl"},
			"MGW"  :  { unit: "[μg]" , html: "MGW"},
			"ML"  :  { unit: "[μg]" , html: "ML"},
			"MP"  :  { unit: "[μg]" , html: "MP"},
			"AG1"  :  { unit: "[nmol]" , html: "AG1"},
			"AG2"  :  { unit: "[nmol]" , html: "AG2"},
			"Ac"  :  { unit: "[nmol]" , html: "Ac"},
			"Ap"  :  { unit: "[nmol]" , html: "Ap"},
			"DRc"  :  { unit: "[nmol]" , html: "DRc"},
			"DRp"  :  { unit: "[nmol]" , html: "DRp"},
			"E1"  :  { unit: "[bpm]" , html: "E1"},
			"E2"  :  { unit: "[·]" , html: "E2"},
			"Ifa"  :  { unit: "[mU/dL]" , html: "Ifa"},
			"Hfa"  :  { unit: "[mU/dL]" , html: "Hfa"},
			"Dfa"  :  { unit: "[mU/dL]" , html: "Dfa"},
			"Ila"  :  { unit: "[mU/dL]" , html: "Ila"},
			"Bla"  :  { unit: "[mU/dL]" , html: "Bla"},
			"Hla"  :  { unit: "[mU/dL]" , html: "Hla"},
			"Dla"  :  { unit: "[mU/dL]" , html: "Dla"},
			"ml"  :  { unit: "[μg]" , html: "ml"},
			"P"  :  { unit: "[·]" , html: "P"},
			"R"  :  { unit: "[·]" , html: "R"},
			"IB"  :  { unit: "[mU/L]" , html: "IB"},
			"IH"  :  { unit: "[mU/L]" , html: "IH"},
			"IG"  :  { unit: "[mU/L]" , html: "IG"},
			"IL"  :  { unit: "[mU/L]" , html: "IL"},
			"IK"  :  { unit: "[mU/L]" , html: "IK"},
			"IPC"  :  { unit: "[mU/L]" , html: "IPC"},
			"IPF"  :  { unit: "[mU/L]" , html: "IPF"},
			"Gamma"  :  { unit: "[·]" , html: "Gamma"},
			"phi"  :  { unit: "[pmol/dL]" , html: "phi"},
			"PHI"  :  { unit: "[pmol/dL]" , html: "PHI"},
			"MIHGP"  :  { unit: "[·]" , html: "MIHGP"},
			"fr"  :  { unit: "[·]" , html: "fr"},
			"MIHGU"  :  { unit: "[·]" , html: "MIHGU"},
			"XGC"  :  { unit: "[mmol]" , html: "XGC"},
			"XGP"  :  { unit: "[mmol]" , html: "XGP"},
			"XIC"  :  { unit: "[mU]" , html: "XIC"},
			"XIS"  :  { unit: "[mU]" , html: "XIS"},
			"XIinj"  :  { unit: "[mU]" , html: "XIinj"},
		};

		
		// list of inputs
		this.inputList = {
			"meal"	: {	unit: "g/min"					, html: "meal"					},
		};
		
		// list of outputs
		this.outputList = {
			"G"		: {unit: "mg/dl"					, html: "G"						},
		};
		
		// list of model parameters
		this.paramList = {
			"VGBC": { unit: "dL", html: "VGBC"},
			"VGBF": { unit: "dL", html: "VGBF"},
			"VGH": { unit: "dL", html: "VGH"},
			"VGL": { unit: "dL", html: "VGL"},
			"VGG": { unit: "dL", html: "VGG"},
			"VGK": { unit: "dL", html: "VGK"},
			"VGPC": { unit: "dL", html: "VGPC"},
			"VGPF": { unit: "dL", html: "VGPF"},
			"QGB": { unit: "dL min⁻¹", html: "QGB"},
			"QGH": { unit: "dL min⁻¹", html: "QGH"},
			"QGA": { unit: "dL min⁻¹", html: "QGA"},
			"QGL": { unit: "dL min⁻¹", html: "QGL"},
			"QGG": { unit: "dL min⁻¹", html: "QGG"},
			"QGK": { unit: "dL min⁻¹", html: "QGK"},
			"QGP": { unit: "dL min⁻¹", html: "QGP"},
			"TGB": { unit: "min", html: "TGB"},
			"TGP": { unit: "min", html: "TGP"},
			"VIB": { unit: "L", html: "VIB"},
			"VIH": { unit: "L", html: "VIH"},
			"VIG": { unit: "L", html: "VIG"},
			"VIL": { unit: "L", html: "VIL"},
			"VIK": { unit: "L", html: "VIK"},
			"VIPF": { unit: "L", html: "VIPF"},
			"QIB": { unit: "L min⁻¹", html: "QIB"},
			"QIH": { unit: "L min⁻¹", html: "QIH"},
			"QIA": { unit: "L min⁻¹", html: "QIA"},
			"QIK": { unit: "L min⁻¹", html: "QIK"},
			"QIP": { unit: "L min⁻¹", html: "QIP"},
			"QIG": { unit: "L min⁻¹", html: "QIG"},
			"TIP": { unit: "min", html: "TIP"},
			"ml0": { unit: "U", html: "ml0"},
			"QIL": { unit: "L min⁻¹", html: "QIL"},
			"VIPC": { unit: "L", html: "VIPC"},
			"VGamma": { unit: "mL", html: "VGamma"},
			"fg": { unit: ".", html: "fg"},
			"Kq1": { unit: ".", html: "Kq1"},
			"Kq2": { unit: ".", html: "Kq2"},
			"k12": { unit: "min⁻¹", html: "k12"},
			"kmin": { unit: "min⁻¹", html: "kmin"},
			"kmax": { unit: "min⁻¹", html: "kmax"},
			"kabs": { unit: "min⁻¹", html: "kabs"},
			"c1": { unit: ".", html: "c1"},
			"c2": { unit: ".", html: "c2"},
			"c3": { unit: ".", html: "c3"},
			"c4": { unit: ".", html: "c4"},
			"c5": { unit: ".", html: "c5"},
			"d1": { unit: ".", html: "d1"},
			"d2": { unit: ".", html: "d2"},
			"d3": { unit: ".", html: "d3"},
			"d4": { unit: ".", html: "d4"},
			"d5": { unit: ".", html: "d5"},
			"SPGU": { unit: ".", html: "SPGU"},
			"SHGP": { unit: ".", html: "SHGP"},
			"zeta1": { unit: "L pmol⁻¹", html: "zeta1"},
			"zeta2": { unit: "L (pmol min)⁻¹", html: "zeta2"},
			"ml0": { unit: "U", html: "ml0"},
			"Kl": { unit: "min⁻¹", html: "Kl"},
			"Ks": { unit: "min⁻¹", html: "Ks"},
			"gammapan": { unit: "μg min⁻¹", html: "gammapan"},
			"alphapan": { unit: "min⁻¹", html: "alphapan"},
			"betapan": { unit: "min⁻¹", html: "betapan"},
			"N1": { unit: "min⁻¹", html: "N1"},
			"N2": { unit: "min⁻¹", html: "N2"},
			"VPHI": { unit: "dL", html: "VPHI"},
			"Kout": { unit: "min⁻¹", html: "Kout"},
			"CF2": { unit: "min⁻¹ nmol⁻¹", html: "CF2"},
			"tphi": { unit: "min⁻¹", html: "tphi"},
			"zeta": { unit: ".", html: "zeta"},
			"RmaxC": { unit: "nmol", html: "RmaxC"},
			"Fv": { unit: ".", html: "Fv"},
			"ka1": { unit: "min⁻¹", html: "ka1"},
			"ka2": { unit: "min⁻¹", html: "ka2"},
			"CL": { unit: "L min⁻¹", html: "CL"},
			"CLic": { unit: "L min⁻¹", html: "CLic"},
			"Vp": { unit: "L", html: "Vp"},
			"Vc": { unit: "L", html: "Vc"},
			"kvd": { unit: "nmol L⁻¹", html: "kvd"},
			"k2v": { unit: "min⁻¹", html: "k2v"},
			"koff": { unit: "min⁻¹", html: "koff"},
			"RmaxP": { unit: "nmol", html: "RmaxP"},
			"kdeg": { unit: "min⁻¹", html: "kdeg"},
			"kgo": { unit: "min⁻¹", html: "kgo"},
			"kgg": { unit: "min⁻¹", html: "kgg"},
			"kpg": { unit: "min⁻¹", html: "kpg"},
			"kgl": { unit: "min⁻¹", html: "kgl"},
			"kpl": { unit: "min⁻¹", html: "kpl"},
			"klp": { unit: "min⁻¹", html: "klp"},
			"kpo": { unit: "min⁻¹", html: "kpo"},
			"vGWmax": { unit: ".", html: "vGWmax"},
			"vLmax": { unit: ".", html: "vLmax"},
			"vPmax": { unit: ".", html: "vPmax"},
			"nGW": { unit: ".", html: "nGW"},
			"nL": { unit: ".", html: "nL"},
			"nP": { unit: ".", html: "nP"},
			"phiGW50": { unit: ".", html: "phiGW50"},
			"phiL50": { unit: ".", html: "phiL50"},
			"phiP50": { unit: ".", html: "phiP50"},
			"rhoalpha": { unit: "min⁻¹", html: "rhoalpha"},
			"rhobeta": { unit: "min⁻¹", html: "rhobeta"},
			"alpham": { unit: "min⁻¹", html: "alpham"},
			"betam": { unit: "min⁻¹", html: "betam"},
			"pla": { unit: "min⁻¹", html: "pla"},
			"rla": { unit: ".", html: "rla"},
			"qla": { unit: "dL²mU⁻²", html: "qla"},
			"bla": { unit: "min⁻¹", html: "bla"},
			"Cmax": { unit: ".", html: "Cmax"},
			"kla": { unit: "min⁻¹", html: "kla"},
			"kcll": { unit: "mU min⁻¹", html: "kcll"},
			"pfa": { unit: "min⁻¹", html: "pfa"},
			"rfa": { unit: ".", html: "rfa"},
			"qfa": { unit: "dL²mU⁻²", html: "qfa"},
			"kclf": { unit: "mU min⁻¹", html: "kclf"},
			"bfa": { unit: "min⁻¹", html: "bfa"},
			"bfa": { unit: "min⁻¹", html: "bfa"},
			"tHR": { unit: "min", html: "tHR"},
			"ne": { unit: ".", html: "ne"},
			"ae": { unit: ".", html: "ae"},
			"te": { unit: "min", html: "te"},
			"alphae": { unit: ".", html: "alphae"},
			"betae": { unit: "bpm⁻¹", html: "betae"},
			"HRb": { unit: "bpm", html: "HRb"},
		};
        this.basal={
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
		// default parameters
		this.defaults = {
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
			"VPHI": 11.310000,
			"Kout": 68.304114,
			"CF2": 21.151177,
			"tphi": 35.100000,
			"zeta": 8.248000,
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
			"vGWmax": 0.972000,
			"vLmax": 0.756000,
			"vPmax": 0.296000,
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
			"qfa": -0.000000,
			"bfa": 0.350073,
			"kclf": 0.031322,
			"tHR": 5.000000,
			"ne": 4.000000,
			"ae": 0.350000,
			"te": 600.000000,
			"alphae": 0.250000,
			"betae": 0.000339,
			"HRb": 80.000000,
			"ce1": 500.000000,
			"ce2": 100.000000,
			"sigsmbg": 0.100000,
		};
		
		// load parameters handed over to this instance
		if (typeof params === "undefined") {
			params = {};
		}
		this.params = Object.assign(params, this.defaults);
		this.computeSteadyState();

	};
		
	// set or change parameters (params as object)
	setParameters(params) {
		// import parameters
		for (const key in params) {
			this.params[key] = params[key];
		}
		this.computeSteadyState();
	}
	
	// compute equilibrium
	computeSteadyState() {
		let params = this.params;
		// Hardcoded initial state!!!!
		
		this.xeq = {
			"qss": 0.000000,
			"qsl": 0.000000,
			"qint": 0.000000,
			"De": 0.000000,
			"DNq": 0.000000,
			"MO1": 0.000000,
			"MO2": 0.000000,
			"MGl": 0.000000,
			"MGW": 0.000000,
			"ML": 0.000000,
			"MP": 0.000000,
			"AG1": 0.000000,
			"AG2": 0.000000,
			"Ac": 0.000000,
			"Ap": 0.000000,
			"DRc": 0.000000,
			"DRp": 0.000000,
			"E1": 0.000000,
			"E2": 0.000000,
			"TE": 0.000000,
			"Hfa": 0.000000,
			"Dfa": 0.000000,
			"Ifa": 0.000000,
			"Bla": 0.000000,
			"Hla": 0.000000,
			"Dla": 0.000000,
			"Ila": 0.000000,
			"ml": 19.377319,
			"P": 0.533430,
			"R": 0.567706,
			"IB": 2.613416,
			"IH": 2.613416,
			"IG": 2.613416,
			"IL": 4.978212,
			"IK": 2.010320,
			"IPC": 2.221404,
			"IPF": 1.000000,
			"GBC": 116.579600,
			"GBF": 83.912933,
			"GH": 128.444007,
			"GG": 126.463809,
			"GL": 137.570991,
			"GK": 128.444007,
			"GPC": 126.126126,
			"GPF": 123.529687,
			"GHint": 0.000000,
			"Gamma": 1.000000,
			"phi": 0.000000,
			"PHI": 0.000000,
			"MIHGP": 1.000000,
			"fr": 0.002700,
			"MIHGU": 1.000000,
			"XGC": 0.000000,
			"XGP": 0.000000,
			"XIC": 0.000000,
			"XIS": 0.000000,
			"XIinj": 0.000000,
		};
		
		// verify equilibrium
		// console.log(this.derivatives(0, this.xeq, {carbs: 0, iir: this.IIReq, ibolus: 0}));
		
	}
	
	getInitialState() {
		return this.xeq;
	}
	
	derivatives(_t, x, u,ks) {
		// console.log(_t)
		// console.log(x)

		let x_temp={};
		for (let i = 0; i < x.length; i++) {
		  x_temp[ks[i]]=x[i];
		}
		x=x_temp;
		// console.log('x:')
		// console.log(x)







		let params = this.params;
		let param=params;
        let basal=this.basal;
		// inputs
		// let M = u["carbs"]*1000;				// meal ingestion in g/min
		// let IIR = u["iir"] * pmol_per_U / 60;	// insulin infusion rate in pmol/min
		// let bolus = u["ibolus"] * pmol_per_U;	// insulin bolus in pmol
		
		
		// Glucose absorption model: 
		let k12=param.k12,Kq1=param.Kq1,Kq2=param.Kq2,kmin=param.kmin,kmax=param.kmax,kabs=param.kabs;
		let fg=param.fg;

		// Metformin submodel:
		let kgo=param.kgo, kgg=param.kgg, kpg=param.kpg, kgl=param.kgl, kpl=param.kpl,
		    klp=param.klp, vGWmax=param.vGWmax, vLmax=param.vLmax, vPmax=param.vPmax,
		    nGW=param.nGW, nL=param.nL, nP=param.nP, phiGW50=param.phiGW50,
		    phiL50=param.phiL50, phiP50=param.phiP50, rhoO1=param.rhoalpha, rhoO2=param.rhobeta,
		    alpham=param.alpham, betam=param.betam, kpo=param.kpo;

		// Vildagliptin submodel: 
		let ka1=param.ka1, ka2=param.ka2, CL=param.CL, CLic=param.CLic, Vc=param.Vc,
		    Vp=param.Vp, RmaxC=param.RmaxC, kdvil=param.kvd, k2vil=param.k2v,
		    koff=param.koff, RmaxP=param.RmaxP, kdeg=param.kdeg;
		    
		// Physical activity model:
		let tHR=param.tHR, HRb=param.HRb, ne=param.ne, ae=param.ae, te=param.te,
		    ce1=param.ce1, ce2=param.ce2;
		// Fast acting insulin:
		let pfa=param.pfa, rfa=param.rfa, qfa=param.qfa, bfa=param.bfa,
		    kclf = param.kclf;
		    
		// Long acting insulin:
		let pla=param.pla, rla=param.rla, qla=param.qla, bla=param.bla,
		    Cmax=param.Cmax, kla=param.kla, kcll = param.kcll;

		// Pancreas submodel
		let zeta1=param.zeta1, zeta2=param.zeta2, kdmdpan=param.ml0*param.Kl,
		    Kpan=param.Ks, //Kpan
		    gammapan=param.gammapan,
		    alphapan=param.alphapan,
		    betapan=param.betapan, N1=param.N1, N2=param.N2, 
		    KILLPAN = param.KILLPAN,
		    Sfactor = param.Sfactor;
		// Insulin submodel:
		let VIB=param.VIB, VIH=param.VIH, QIB=param.QIB, QIL=param.QIL,
		    QIK=param.QIK, QIP=param.QIP, QIH=param.QIH,
		    QIG=param.QIG, VIG=param.VIG, VIL=param.VIL, QIA=param.QIA, VIK=param.VIK,
		    VIPC=param.VIPC, VIPF=param.VIPF, TIP=param.TIP;


		// Glucose submodel:
		let VGBC=param.VGBC, QGB=param.QGB, VGBF=param.VGBF, TGB=param.TGB,
		    VGH=param.VGH,  QGL=param.QGL,
		    QGK=param.QGK,  QGP=param.QGP, QGH=param.QGH,  VGG=param.VGG,
		    QGG=param.QGG,  VGL=param.VGL, QGA=param.QGA,  VGK=param.VGK,
		    VGPC=param.VGPC, VGPF=param.VGPF, TGP=param.TGP, alphae=param.alphae,
		    betae=param.betae;
		    
		// Glucagon submodel:
		let VGamma=param.VGamma;

		    
		// GLP-1 submodel:
		let VPHI=param.VPHI, Kout=param.Kout, CF2=param.CF2,
		    tphi=param.tphi, kphi=param.zeta;
		    
		// rates:
		let cIPGU=param.c1, cIHGPinft=param.c2, 
		    cGHGP=param.c3, cIHGUinft=param.c4, cGHGU=param.c5,
		    dIPGU=param.d1, dIHGPinft=param.d2, dGHGP=param.d3,
		    dIHGUinft=param.d4, dGHGU=param.d5,
		    SHGP = param.SHGP, 
		    SHGU = param.SHGU, 
		    SPGU = param.SPGU; 
		    
		//  Extract states from state vector:
		// Glucose absorption model: 
		let qss=x["qss"], qsl=x["qsl"], qint=x["qint"],
		    De=x["De"], DNq=x["DNq"];    

		//Metformin submodel:
		let MO1=x["MO1"], MO2=x["MO2"], MGl=x["MGl"], MGW=x["MGW"], ML=x["ML"],
		    MP=x["MP"];

		//Vildagliptin submodel: 
		let AG1=x["AG1"], AG2=x["AG2"], Ac=x["Ac"], Ap=x["Ap"], DRc=x["DRc"],
		    DRp=x["DRp"];
		    
		//Physical activity model:
		let E1=x["E1"], E2=x["E2"],
		    TE=x["TE"];
		//Fast acting insulin:
		let Hfa=x["Hfa"], Dfa=x["Dfa"], Ifa = x["Ifa"];

		// Long acting insulin:
		let Bla= x["Bla"], Hla= x["Hla"], Dla= x["Dla"], Ila = x["Ila"];

		// Pancreas submodel
		let ml= x["ml"], P= x["P"], R= x["R"];
		    
		// Insulin submodel:
		let IB= x["IB"],   IH= x["IH"], IG= x["IG"], IL= x["IL"], IK= x["IK"],
		    IPC= x["IPC"], IPF= x["IPF"];

		// Glucose submodel:
		let GBC= x["GBC"], GBF= x["GBF"], GH= x["GH"], GG= x["GG"], GL= x["GL"],
		    GK= x["GK"], GPC= x["GPC"], GPF= x["GPF"];
		    
		// Glucagon submodel:
		let Gamma= x["Gamma"];
		    
		// GLP-1 submodel:    
		let phi= x["phi"], PHI= x["PHI"];
		    
		// rates:
		let MIHGP= x["MIHGP"];
		let fr= x["fr"];
		let MIHGU= x["MIHGU"];
		    
		// Total glucose consumption: 
		let XGC = x["XGC"];
		// Total Glucose production and appearance: 
		let XGP = x["XGP"];
		// Total insulin consumption: 
		let XIC = x["XIC"];
		// Secreted inuslin: 
		let XIS = x["XIS"];
		// Injected insulin: 
		let XIinj = x["XIinj"];
		    
		// Integrated hepatic glucose
		let GHint = x["GHint"];
		// Basal values and constant rates:
		let GBPF = basal.GPF, IBPF = basal.IPF, IBL = basal.IL, GBL = basal.GL,
		    GammaB = basal.Gamma, SB = basal.SB,GBH = basal.GH,IBH = basal.IH,rBPIR = basal.rPIR, rBGU = basal.rBGU, rRBCU = basal.rRBCU, rGGU = basal.rGGU, rBPGU = basal.rPGU, rBHGP = basal.rHGP, rBHGU = basal.rHGU;
		// Glucose Absorption submodel
		    
		// The model equations
		// declare vector of derivatives dx/dt
		let dx_dt = {};
		
		// dx_dt["GH"] = val;

	    dx_dt["De"] = -kmin*De;
	    dx_dt["DNq"] = kmin*(u.Dg-DNq);
	    dx_dt["qss"] = -k12*qss;
	    let QA1 = 5/(2*DNq*(1-Kq1));
	    let QA2 = 5/(2*DNq*Kq2);
	    // console.log(Math.tanh(QA2*(qss+qsl-Kq2*DNq)))
	    // console.log(Kq1)
	    let kempt = kmin+((kmax-kmin)/2)*(Math.tanh(QA1*(qss+qsl-Kq1*DNq))-Math.tanh(QA2*(qss+qsl-Kq2*DNq))+2);
	    // console.log(kempt)
	    dx_dt["qsl"] = -kempt*qsl+k12*qss;
	    dx_dt["qint"] = -kabs*qint+kempt*qsl;
	    
	    let Ra = fg*kabs*qint;

		// Stress:
		// Stress is a parameter that takes values between 1 and 0.
		// It is defined as a vector of a sepcific time step for the simulation.
		// Therefore, it is necessary to interpolate it here:
		let stress = 0; // interp1(0:obj.dt:(length(stressv)*obj.dt-obj.dt),stressv,t); %Interpolates (T,stressv) at time t

		// Metformin submodel: 

		// Model equations:
	    dx_dt["MO1"] =  -alpham*MO1;
	    dx_dt["MO2"] =  -betam*MO2;
	    dx_dt["MGl"] =  -(kgo+kgg)*MGl+rhoO1*MO1+rhoO2*MO2;
	    dx_dt["MGW"] =  MGl*kgg+MP*kpg-MGW*kgl;
	    dx_dt["ML"] =  MGW*kgl+MP*kpl-ML*klp;
	    dx_dt["MP"] = ML*klp-(kpl+kpg+kpo)*MP+MGl;

		 let EGW = (vGWmax*Math.pow(MGW,nGW))/(Math.pow(phiGW50,nGW)+Math.pow(MGW,nGW));
		 let EL = (vLmax*Math.pow(ML,nL))/(Math.pow(phiL50,nL)+Math.pow(ML,nL));
		 let EP = (vPmax*Math.pow(MP,nP))/(Math.pow(phiP50,nP)+Math.pow(MP,nP));

		// Vildagliptin submodel:
		// The model equations:
	    dx_dt["AG1"] = -ka1*AG1;
	    dx_dt["AG2"] = ka1*AG1-ka2*AG2;
	    dx_dt["Ac"] = ka2*AG2-((CL+CLic)/Vc)*Ac+(CLic/Vp)*Ap-((RmaxC-DRc)*k2vil*(Ac/Vc))/(kdvil+Ac/Vc)+koff*DRc;
	    dx_dt["Ap"] = CLic*(Ac/Vc-Ap/Vp)-((RmaxP-DRp)*k2vil*(Ap/Vp))/(kdvil+Ap/Vp)+koff*DRp;
	    dx_dt["DRc"] = (RmaxC-DRc)*k2vil*(Ac/Vc)/(kdvil+Ac/Vc)-(koff-kdeg)*DRc;
	    dx_dt["DRp"] = (RmaxP-DRp)*k2vil*(Ap/Vp)/(kdvil+Ap/Vp)-(koff+kdeg)*DRp;

		// Physical activity submodel
		let HR = 0; // interp1(0:obj.dt:(length(HRv)*obj.dt-obj.dt),HRv,t); %Interpolates (T,HRv) at time t
		// The model equations:
		    dx_dt["E1"] = (1/tHR)*(HR-HRb-E1);
		let gE = Math.pow(E1/(ae*HRb),ne)/(1+Math.pow(E1/(ae*HRb),ne));
		    dx_dt["TE"]  =  (1/te)*(ce1*gE+ce2-TE);
		// dE2  =  -(gE+1/TE)*E2+(gE*TE)/(ce1+ce2);
		    dx_dt["E2"] = -(gE+1/te)*E2+gE;

		// Glucose submodel rates: 
		    
		let MIPGU = (7.03+SPGU*6.52*Math.tanh(cIPGU*(IPF/IBPF-dIPGU)))/(7.03+SPGU*6.52*Math.tanh(cIPGU*(1-dIPGU)));
		    
		let MGPGU = GPF/GBPF;
		    
		let rPGU = MIPGU*MGPGU*rBPGU;
		    
		    
		let MIHGPinft = (1.21-SHGP*1.14*Math.tanh(cIHGPinft*(IL/IBL-dIHGPinft)))/(1.21-SHGP*1.14*Math.tanh(cIHGPinft*(1-dIHGPinft)));
		    
		let MGHGP = (1.42-1.41*Math.tanh(cGHGP*(GL/GBL-dGHGP)))/(1.42-1.41*Math.tanh(cGHGP*(1-dGHGP)));
		    
		let MgammaHGP = 2.7*Math.tanh(0.39*Gamma/GammaB)-fr;
		    
		let rHGP = MIHGP*MGHGP*MgammaHGP*rBHGP;
		        
		let MIHGUinft = (Math.tanh(cIHGUinft*(IL/IBL-dIHGUinft)))/(Math.tanh(cIHGUinft*(1-dIHGUinft)));

		let MGHGU = (5.66+5.66*Math.tanh(cGHGU*(GL/GBL-dGHGU)))/(5.66+5.66*Math.tanh(cGHGU*(1-dGHGU)));
		    
		let rHGU = MIHGU*MGHGU*rBHGU;

		let rKGE=330;
	    if (GK>=460){
	        rKGE = 330+0.872*GK;
	    }
	    else{
	        rKGE = 71+71*Math.tanh(0.011*(GK-460));
	    }
		// Effect of Metformin:
		rHGP = rHGP*(1-EL);
		rGGU = rGGU*(1+EGW);
		rPGU = rPGU*(1+EP);
		//  Rates dynamic model
		    
		dx_dt["MIHGP"] = 0.04*(MIHGPinft-MIHGP);
		dx_dt["fr"] = 0.0154*(0.5*(2.7*Math.tanh(0.39*Gamma/GammaB)-1)-fr);
		dx_dt["MIHGU"] = 0.04*(MIHGUinft-MIHGU);

		//  Glucose submodel:
		// +564.4444
		dx_dt["GBC"] = (1/VGBC)*(QGB*(GH-GBC)-(VGBF/TGB)*(GBC-GBF));
		dx_dt["GBF"] = (1/VGBF)*((VGBF/TGB)*(GBC-GBF)-rBGU);
		dx_dt["GH"] = (1/VGH)*(QGB*GBC+QGL*GL+QGK*GK+QGP*GPC-QGH*GH-rRBCU);
		// console.log(x)
		dx_dt["GG"] = (1/VGG)*(QGG*(GH-GG)-rGGU+Ra);
		dx_dt["GL"] = (1/VGL)*(QGA*GH+QGG*GG-QGL*GL+((1+stress)*(1-alphae*E2)*rHGP-(1+alphae*E2)*rHGU));
		dx_dt["GK"] = (1/VGK)*(QGK*(GH-GK)-rKGE);
		dx_dt["GPC"] = (1/VGPC)*(QGP*(GH-GPC)-(VGPF/TGP)*(GPC-GPF));
		dx_dt["GPF"] = (1/VGPF)*((VGPF/TGP)*(GPC-(1+betae*E1)*GPF)-(1+alphae*E2)*rPGU);
		dx_dt["XGC"] = (rBGU)+rRBCU+rGGU+(1+alphae*E2)*rHGU+rKGE+betae*E1*GPF*QGP+(1+alphae*E2)*rPGU;
		dx_dt["XGP"] = Ra + (1+stress)*(1-alphae*E2)*rHGP;
		dx_dt["GHint"] = GH;
		// Glucagon submodel:
		   
		// Basal values: 
		let rBPGammaR = 9.1;
		   
		let MGPGammaR = 1.31-0.61*Math.tanh(1.06*((GH/GBH)-0.47));
		let MIPGammaR = 2.93-2.09*Math.tanh(4.18*((IH/IBH)-0.62));
		   
		let rPGammaR = MGPGammaR*MIPGammaR*rBPGammaR;
		   
		dx_dt["Gamma"] = (1/VGamma)*((1+stress)*rPGammaR-9.1*Gamma);

		// GLP-1 submodel
		dx_dt["phi"] = kphi*kempt*qsl-phi/tphi;
		dx_dt["PHI"] = (1/VPHI)*(phi/tphi-(Kout+(RmaxC-DRc)*CF2)*PHI);

		// Pancreas submodel

		// The model equations:
		// 1.32^3.27 = 2.4790
		let XG = Math.pow(GH,3.27)/(2.4790+5.93*Math.pow(GH,3.02));
		let Pinft = Math.pow(XG,1.11)+zeta1*PHI;
		let Y = Pinft;

		let S = Sfactor;
	    if (XG>R){
	        S = Sfactor*ml*(N1*Y+N2*(XG-R)+zeta2*PHI);
	    }
	    else{
	        S = Sfactor*ml*(N1*Y+zeta2*PHI);
	    }

		dx_dt["ml"] = kdmdpan-Kpan*ml+gammapan*P-S;
		dx_dt["P"] = alphapan*(Pinft-P);
		dx_dt["R"] = betapan*(XG-R);
		    
		// Insulin submodel rates:
		let rPIR = (S/SB)*rBPIR;
		let rLIC = 0.4*(QIA*IH+QIG*IG+rPIR);
		let rKIC = 0.3*QIK*IK;
		let rPIC = IPF/((0.85)/(0.15*QIP)-20/VIPF);
		// Long-acting Insulin:

		// Model equations:
		dx_dt["Bla"] = -kla*Bla*(Cmax/(1+Hla));
		dx_dt["Hla"] = -pla*(Hla-qla*Math.pow(Dla,3))+kla*Bla*(Cmax/(1+Hla));
		dx_dt["Dla"] = pla*(Hla-qla*Math.pow(Dla,3))-bla*Dla/(1+Ila);
		dx_dt["Ila"] = rla*bla*Dla/(1+(Ila)) - kcll*(Ila);
		// Fast-acting Insulin 

		// Model equations:
		dx_dt["Hfa"] = -pfa*(Hfa-qfa*Math.pow(Dfa,3));
		dx_dt["Dfa"] = pfa*(Hfa-qfa*Math.pow(Dfa,3))-bfa*Dfa/(1+Ifa);
		dx_dt["Ifa"]  =   rfa*bfa*Dfa/(1+(Ifa)) - kclf*(Ifa);
		// Insulin submodel: 

		// Model equations:
		dx_dt["IB"] = (QIB/VIB)*(IH-IB);
		dx_dt["IH"] = (1/VIH)*(QIB*IB+QIL*IL+QIK*IK+QIP*IPF-QIH*IH);
		dx_dt["IG"] = (QIG/VIG)*(IH-IG);
		dx_dt["IL"] = (1/VIL)*(QIA*IH+QIG*IG-QIL*IL+(1-stress)*rPIR-rLIC);
		dx_dt["IK"] = (1/VIK)*(QIK*(IH-IK)-rKIC);
		dx_dt["IPC"] = (1/VIPC)*(QIP*(IH-IPC)-(VIPF/TIP)*(IPC-IPF))+10*Ifa+10*Ila;
		dx_dt["IPF"] = (1/VIPF)*((VIPF/TIP)*(IPC-IPF)-rPIC);
		dx_dt["XIC"] = rLIC+rKIC+rPIC;
		dx_dt["XIS"] = (1-stress)*rPIR;
		dx_dt["XIinj"] = VIPF*rla*bla*Dla/(1+IPF)+VIPF*rfa*bfa*Dfa/(1+IPF);
		// console.log('dxdt:')
		// console.log(dx_dt)
		let dx_dt_val=[];
		for (let i = 0; i < ks.length; i++) {
		  dx_dt_val.push(dx_dt[ks[i]]);
		}
		// console.log(dx_dt_val)
		return dx_dt_val;
	};
	
	
	// compute outputs (returns object)
	outputs(_, x, _u) {
		return {
			"G": x["GH"]*0.055
		}
	};
	
}

export default Patient;
