<template>
  <button class="debug" @click="debugContent">Debug</button>
  <!-- 
    Input parameters (left side)
   -->
  <div id="left-container" :class="{'hide': !maximized, 'expanded': maximized}" >
    <!-- TODO removed advanced button -->
    <!-- <div class="btns">
      <TextIconButton @click="toggleVisiblePar" v-if="!advanced" icon="fa-chevron-right">Advanced </TextIconButton>
      <TextIconButton @click="toggleVisiblePar" v-if="advanced" icon="fa-chevron-right">Normal </TextIconButton>
      <TextIconButton @click="toggleVisible" class="toggleVisible" icon="fa-chart-line">Show Graph </TextIconButton>
    </div> -->
    <CollapseSide>
    <div id="left-params" v-if="!advanced">
      <div :key="type" v-for="type in getTypes">
      <ParameterHeader :text="type" :displayIcon=true @iconClick="openPopup"/>

        <Param :key="par.Name" v-for="(par, index) in getParametersInType(type)"
          @add-param="addParam"
          @deleteParam="deleteParam"
          @updateValue="updateValueParam"
          @updateRepeat="updateRepeat"
          @updateInsulin="updateInsulin"
          :param="patient[index]"
          :four-option="par.Duration"
          :paramType="par.Name"
          :paramOption="par.Unit"
          :parRepeat="simPar.repeat[index]"
          :Types="Types[index]"
          :typeName="TypeNames[index]"
          :Insulin='par.Insulin'
          :SelectedInsulin='simPar.selectedInsulin[index]'
          :InsulinList="InsulinTypes[index]"
          :predefinedDose="par.predefinedDose"
          :Index="index"/>
      </div>

      <!-- TODO removed physiological for now -->
      <!-- <Physiological
        @updateValueSlider="updateValueSlider"
        :ins_sens='patient.ins_sens'
        :ins_secr='patient.ins_secr'
        :glu_prod='patient.glu_prod'
        :glu_upta='patient.glu_upta'/> -->
      
        <!-- TODO Inital Cond component removed -->
      <!-- <InitialCond
        @updateInitCond="updateInitCond"
        :initCond="simPar.initCond"/> -->

      <div id="left-tuned-patients">
        <ParameterHeader text="Tuned patients"/>
        <TextIconButton @click="tunedPatient" :class="{'active':isActivePatient('')}">Default
        </TextIconButton>
        <TextIconButton @click="tunedPatient" class="tooltip" :class="{'active':isActivePatient('Patient 1')}">Patient 1
          <span class="tooltiptext">The following parameters will change value to: 
            <span>k12 → 0.5 • k12</span>
            <span>kabs → 0.5 • kabs</span>
            <span>c2 → 1.2 </span>
            <span>d2 → 1 </span>
            <span>GBPC0 → 9.5</span>
            <span>Insulin Sensitivity → 5 </span>
          </span>
        </TextIconButton>
        <TextIconButton @click="tunedPatient" class="tooltip" :class="{'active':isActivePatient('Patient 2')}">Patient 2
          <span class="tooltiptext">The following parameters will change value to: 
            <span>k12 → 0.375 • k12</span>
            <span>kabs → 0.375 • kabs</span>
            <span>zeta1 → 0.002</span>
            <span>c2 → 6 </span>
            <span>c3 → 0.7 </span>
            <span>d2 → 2 </span>
            <span>GBPC0 → 14</span>
            <span>IPBF0 → 0.5</span>
            <span>Insulin Sensitivity → 3 </span>
          </span>
        </TextIconButton>
        <TextIconButton @click="tunedPatient" class="tooltip" :class="{'active':isActivePatient('Patient 3')}">Patient 3
          <span class="tooltiptext">The following parameters will change value to: 
            <span>k12 → 0.375 • k12</span>
            <span>kabs → 0.375 • kabs</span>
            <span>c2 → 1.2 </span>
            <span>c3 → 0.7 </span>
            <span>d2 → 2 </span>
            <span>GBPC0 → 18</span>
            <span>IPBF0 → 0.35</span>
            <span>Insulin Sensitivity → 3 </span>
            <span>Insulin Secretion rate → 0 </span>
          </span>
        </TextIconButton>
      </div>
    </div>
    
    <!-- TODO removed advanced parameters container for now -->
    <!-- <div v-else class="container">
      <div class="header">
        <h2>Advanced Parameters</h2>
      </div>
    
      <AdvancedParameters
        @updateParam="updateParam"
        @updateBasal="updateBasal"
        :Submodels="AdvancedSubModel"
        :Parameters="AdvancedParameter"
        :Params="this.sim.Params"
        :Basal="this.sim.Basal"/>
    </div> -->
    </CollapseSide>
  </div>
  
  
  <!-- 
    Graph area (right side)
   -->
  <div id="right-container">
  <div v-show="showGraph" id="graph" :class="{maximized: maximized }">
    <Graph
      @simulate="simulate"
      @cancelSim="cancelSimulation"
      @updateSimTime="updateSimTime"
      @updateGraphContent="updateDisplayParameters"
      @updateAdvancedSimPar="updateAdvancedSimPar"
      @stateDisplayChange="stateDisplayChange"
      @saveNewResponse="saveNewResponse"
      @changeCompare="changeCompare"
      @importFile="importFile"
      @exportFile="exportFile"
      @toMaximize="toMaximize"
      @updateGlycemiaInterval="updateGlycemiaInterval"
      @DownloadResponse="downloadPopup=!downloadPopup"
      @updateOde="updateOde"
      @DeleteResponse="DeleteResponse"
      @closeOverlay="closeGraphOverlay"
      @toggleVisible="toggleVisible"
      :graphData="graphInfo"
      :simPar="simPar"
      :display="display"
      :maximized="maximized"
      :displayStates="displayStates"
      :simRunning="simRunning"
      :simProg="simProg"
      :response="Response"
      :subModel="statesSubModel"
      :tooltips="tooltips"
      :showSecondAxis="showSecondAxis"
      :showGlycemia="showGlycemia"
      :GlycemiaInterval="GlycemiaInterval"
      :axisTitleChange="axisTitleChange"
      :AxisTitle="AxisTitle"
      :graphScroll="graphScroll"
      :selected_solver="simPar.simSettings.selected_solver"
      :solverList="simPar.simSettings.solverList"
      :activePatient="ActivePatient"
      :newSimRequired="newSimRequired"
      :compare="compare"
      :compareTo="compareTo"
      :parameters="getParameters"/>
  </div>
</div>
  <!-- 
    Pop-up
   -->
  <div v-show="savePopup" class="save-popup popup" @click="closePopupOutside">
    <div class="content">
      <span>Save or import</span>
      <h2>{{getName}}</h2>
      <IconButton @click="closePopup" class="close" icon="xmark" />
      
      <div class="row">
        <label>Save as: </label><input @keydown.enter="saveNewParameters" ref="newParameterName" type="text" placeholder="Name"/>
        <IconButton @click="saveNewParameters" icon="fa-floppy-disk" />
      </div>
      <div class="row">
        <label for="select">Import: </label>
        <select ref="selectedParameter" id="select">
          <option>None</option>
          <option :key="item.name" v-for="item in getImport">
            {{item.name}}
          </option>
        </select>
        <IconButton @click="importParameters" icon="fa-upload" />
      </div>
      <span ref="popupInfo"></span>
    </div>
  </div>

  <div v-show="downloadPopup" class="download-popup popup" @click="closeDownload">
    <div class="content">
      <h2>Download Response</h2>
      <IconButton @click="downloadPopup=!downloadPopup" class="close" icon="xmark" />
        <p>Choose a response to be downloaded</p>
        <div class="row">
          <select ref="selectedDownload" id="select">
            <option :key="item.name" v-for="item in Response">
              {{item.name}}
            </option>
          </select>
          <IconButton @click="DownloadResponse" icon="fa-download" />
        </div>
      <span ref="popupInfoDownload"></span>
    </div>
  </div>

  <div v-show="InfoPopup" class="info-popup popup" @click="closeInfo">
    <div class="content">
      <h2>Browser info</h2>
      <IconButton @click="InfoPopup=!InfoPopup" class="close" icon="xmark" />
        <p>You are currently using Internet Explorer, which is not supported properly. We advice you to update your browser to Microsoft Edge.</p>
    </div>
  </div>

  <div v-show="EULAPopup" class="EULA-popup popup">
    <div class="content">
      <h2>Legal</h2>
        <EULA></EULA>
      <div class="options">
        <TextIconButton @click="EULAClick" class="EULAbtn" icon="check" color="hsl(124, 100%, 50%)">I consent</TextIconButton>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; //ajax
import Graph from '../components/Graph.vue'
import Param from '../components/Param.vue'
import Physiological from '../components/Physiological.vue'
import InitialCond from '../components/InitialCond.vue'
import AdvancedParameters from '../components/AdvancedParameters.vue'

import parFunction from '../core/Functions.js'
import States from '../core/States.js'
import Parameters from '../core/Parameters.js'
import Display from '../core/Display.js'
import TunedPatients from '../core/TunedPatients.js'
import AdvancedParameterList from '../core/AdvancedParameterList'
import Sim from '../core/Sim.js'
import SimWorker from '../core/SimWorker-api.js'
import CollapseSide from '../components/Transitions/CollapseSide.vue'
import Collapse from '../components/Transitions/Collapse.vue'
import Footer from '../components/Footer.vue'
import TextIconButton from '../components/TextIconButton.vue'
import IconButton from '../components/IconButton.vue'
import ParameterHeader from '../components/ParameterHeader.vue'
import ImportantInfo from '../components/ImportantInfo.vue'
import EULA from '../components/EULA.vue'

export default {
  name: 'App',
  props: {
      version: String,
      statPath: String
  },
  components: {
    Graph,
    Param,
    Physiological,
    InitialCond,
    AdvancedParameters,
    CollapseSide,
    Collapse,
    Footer,
    TextIconButton,
    IconButton,
    ParameterHeader,
    ImportantInfo,
    EULA,
},
  data(){
    return {
      simWorker: SimWorker,
      tooltips: States.tooltips,
      statesSubModel: States.subModel,
      displayStates: States.displayStates,
      AdvancedSubModel: AdvancedParameterList.Submodel,
      AdvancedParameter: AdvancedParameterList.Parameters,
      advanced: false,
      maximized: false,
      savePopup: false,
      downloadPopup: false,
      InfoPopup: false,
      EULAPopup: true,
      newSimRequired: false,
      simRunning: false,
      simProg: false,
      showGraph: true,
      showSecondAxis: false,
      graphScroll: true,
      axisTitleChange: 0,
      AxisTitle: ['TBD', 'TBD'],
      showGlycemia: 0,
      GlycemiaInterval: {lower:3.9, upper:10},
      compare: "None",
      compareTo: "None",
      Types: Parameters.ParameterTypes,
      TypeNames: Parameters.TypeNames,
      InsulinTypes: Parameters.InsulinTypes,
      savedParameters:{
        External: {},
        Treatment: {}
      },
      selectedSavedParameter: 'External',
      patient: {  // The arrays for the input parameters is initialized in the created hook
        ins_sens: 1,
        ins_secr: 0,
        glu_prod: 0,
        glu_upta: 0,
      },
      sim: new Sim(),// should this die? Maybe, for now i think it holds Params
      graphInfo: {
        datasets: []
      },
      // Holds the information needed to display parameters
      displayArray: {}, // Initalized in created hook
      // The booleans for if the parameters are displayed or not
      display: {}, // Initalized in created hook
      simPar: {
        time: 1,
        initCond: {
          GBPC0: 10,
          IBPF0: 1
        },
        parVector: {}, // Is initialized in the created hook
        repeat: {}, // Is initialized in the created hook
        simSettings: {
          selected_solver: "ode45-ish",
          solverList: ["ode45-ish", "implicit (Radau5)"],
          rtol: 1e-6,
          hmin: 1e-4,
          dataFrequencyRatio: 1,
          graphFrequency: 1,
          clStr: "// The 202 algorithm \nvar BG=GH*0.0555;\nif (BG>=6){\nmemory.ins=memory.ins+2;\n}else if (BG<=4){\nmemory.ins=memory.ins-2;\n}\nlai=memory.ins;",
          clInitStr: "memory={};\nmemory.ins=40;",
          clEnable:false,
          clStartTime:7*60,
          clPeriod:24*60,
          processNoise_GH:0,
          HbA1c_interval: 7
        },
        selectedInsulin: {
          LAI: 'Long Acting',
          FAI: 'Very Fast Acting'
        }
      },
      Response: [],
      BrowserType: '',
      DeviceType: '',
      ActivePatient: "",
      PreviousWidth: 0,
    }
  },
  methods:{
    // Calls add function in Parameters.js
    addParam(par){
      Parameters.add(par, this.patient)
      this.updateGraphContent({bool: false, key:par.type})
      this.updateGraphContent({bool: true, key:par.type})
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    // Calls delete function in Parameters.js
    deleteParam(par){
      Parameters.delete(par, this.patient)
      this.updateGraphContent({bool: false, key:par.type})
      this.updateGraphContent({bool: true, key:par.type})
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    // Calls update function in Parameters.js
    updateValueParam(par){
      Parameters.updateValue(par, this.patient);
      // Updates the graph content (false=delete from graph, true=adds to graph)
      this.updateGraphContent({bool: false, key:par.type})
      this.updateGraphContent({bool: true, key:par.type})
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    // Calls updateRepeat function in Parameters.js
    updateRepeat(par){
      Parameters.updateRepeat(par, this.simPar)
      // Updates the graph content (false=delete from graph, true=adds to graph)
      this.updateGraphContent({bool: false, key:par.index})
      this.updateGraphContent({bool: true, key:par.index})
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    // Calls updateInsulin function in Parameters.js
    updateInsulin(par){
      Parameters.updateInsulin(par, this.simPar, this.sim)
    },
    // Updates initial conditions
    updateInitCond(par){
      if(par.name == "GBPC"){
        this.simPar.initCond.GBPC0 = parseFloat(par.val);
      }else{
        this.simPar.initCond.IBPF0 = parseFloat(par.val);
      }
      this.ActivePatient = "";
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    // Updates advanced simulation parameters
    updateAdvancedSimPar(par){
      console.log(par)
      par.name === "relTol" ? this.simPar.simSettings.rtol = parseFloat(par.val) :
      par.name === "stepSize" ? this.simPar.simSettings.hmin = parseFloat(par.val) :
      par.name === "dataFreq" ? this.simPar.simSettings.dataFrequencyRatio = parseFloat(par.val) : null
      if (par.name==="graphFrequency"){
        this.simPar.simSettings.graphFrequency = parseFloat(par.val);
        if (this.simPar.simSettings.graphFrequency>50)
          this.simPar.simSettings.graphFrequency=50;
        if (this.simPar.simSettings.graphFrequency<=0)
          this.simPar.simSettings.graphFrequency=0.1;
      }
      par.name==="closedLoop"? this.simPar.simSettings.clStr=par.val: null;
      par.name==="closedLoopInit"? this.simPar.simSettings.clInitStr=par.val: null;
      par.name==="clEnable"? this.simPar.simSettings.clEnable=par.val: null;
      par.name==="processNoise_GH"? this.simPar.simSettings.processNoise_GH=parseFloat(par.val): null;
      par.name==="clStartTime"? this.simPar.simSettings.clStartTime=parseFloat(par.val): null;
      par.name==="clPeriod"? this.simPar.simSettings.clPeriod=parseFloat(par.val): null;

      par.name==='HbA1c_interval'? this.simPar.simSettings.HbA1c_interval=parseFloat(par.val):null;
      // console.log(this.simPar.simSettings.HbA1c_interval)
      // console.log(par)
      // console.log(this.simPar.simSettings.processNoise_GH)
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    // Updates the glycemia interval
    updateGlycemiaInterval(par){
      this.GlycemiaInterval[par.name] = parseFloat(par.value);
    },  
    // Calls the stateChange function in Display.js
    stateDisplayChange(par){
      // Updates the object
      this.displayStates[par.name][par.axis] = par.bool
      let response = Display.stateChange(par, this.Response, this.graphInfo, States.displayStates, this.compareTo, this.AxisTitle, this.compare);
      if(response !== undefined){
        this.showSecondAxis = response;
      }
      // To keep track of changes in chart.vue
      this.axisTitleChange ++;
      par.name === 'GH' ? this.showGlycemia ++ : null ;
    },
    // Calls the changeCompare function in Display.js
    changeCompare(par){
      if(par.name == "compareTo"){
        this.compareTo = Display.changeCompare(par.val, this.compareTo, this.Response, this.graphInfo, States.displayStates, false, this.compare)
      }else{
        this.compare = Display.changeCompare(par.val, this.compare, this.Response, this.graphInfo, States.displayStates, true)
      }
      
    },
    // Updates advanced Params
    updateParam(par){
      // console.log('updateParam',par)
      this.sim.Params[par.param] = parseFloat(par.value);
      if (par.param==="SPGU"){
        this.updateValueSlider({type:"sens",val:parseFloat(par.value)})
      }
      this.ActivePatient = "";
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    // Updates advanced Basal
    updateBasal(par){
      // console.log(par)
      this.sim.Basal[par.param] = parseFloat(par.value);
      this.ActivePatient = "";
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    updateValueSlider(par){
      console.log('updateSlider',par)
      Parameters.updateSlider(par, this.patient, this.sim);
      this.ActivePatient = "";
      // Updates boolean so that new sim is required
      this.newSimRequired = true;
    },
    updateDisplayParameters(par){
      this.display[par.key] = par.bool;
      this.updateGraphContent(par);
    },
    updateGraphContent(par){
      this.constructVector();
      // If the bool is false, we need to delete the element from the dataset
      if(par.bool == false){
        this.graphInfo.datasets = this.graphInfo.datasets.filter((item)=> item.Key !== par.key)
      }
      else if(this.display[par.key]){
        this.graphInfo.datasets = [...this.graphInfo.datasets ,this.displayArray[par.key]]
      }
    },
    updateOde(solver){
      this.simPar.simSettings.selected_solver=solver;
      console.log('solver:',solver)   
    },
    updateSimTime(newTime){
      this.simPar.time = newTime;

      // Cycle through all parameters to update them for display
      var keys = Object.keys(this.display);
      keys.forEach(key => {
        if(this.display[key]){
          this.updateGraphContent({bool: false, key:key})
          this.updateGraphContent({bool: true, key:key})
        }
      });
    },
    constructVector(){
      var minCount = this.simPar.time * 1440;
      // new version
      var Parameters = this.getParameters;
      var keys = Object.keys(Parameters);
      keys.forEach(key => {
        var par = Parameters[key];
        this.simPar.parVector[key] = {name:par.Name, data:parFunction.generateValueArray(this.patient[key], par.Duration, minCount, this.simPar.repeat[key], false, {})}
        
        this.displayArray[key] = {label:par.Name, Key:key, yAxisID:par.axisID, borderColor: par.color, backgroundColor: par.color, data:parFunction.generateValueArray(this.patient[key], par.Duration, minCount, this.simPar.repeat[key], true, (key == "LAI" || key == "FAI") ? (this.Response[0] != undefined ? (this.Response[0].data.CL!=undefined? this.Response[0].data.CL[key.toLowerCase()]:[]) : {}) : {})}
      });
      // console.log('this.displayArray',this.displayArray)
    },
    saveNewResponse(name){
      if(!this.simRunning && this.Response.length){
        var valid = true;
        name.trim().length === 0 ? valid = false: null;
        // Check to see if they named reserved names
        if(name == "Current" || name == "Previous"){
          alert("You can't save a response as name: " + name + "\n Try naming it something else.")
          valid = false;
        }
        else{
          // Check if name already exists
          this.Response.forEach(response => {
            if(response.name == name){
              if (confirm("A response with that name already exists, do you want to override it?")) {
                // Delete the old response, but don't change valid
                this.Response = this.Response.filter((item)=>item.name !== name);
              } else {
                // Change valid so a new object isn't added
                valid = false;
              }
            }
          });
        }
        if(valid){
          var newResponse = Object.assign({},this.Response[0]);
          newResponse.name = name;
          this.Response.push(newResponse)

          //Save the external factors and treatment of the response
          // Update saved external factors and treatment
          let dataExternal = this.savedParameters['External']['Current'].data;
          let dataTreatment = this.savedParameters['Treatment']['Current'].data;
          this.savedParameters['External'][name] = {name: name, data:dataExternal};
          this.savedParameters['Treatment'][name] = {name: name, data:dataTreatment};
        }
      }
    },
    DeleteResponse(par){
      // Delete from response array
      this.Response.splice(par.index,1);
      // Delte from stored treatment and external factors
      delete this.savedParameters['External'][par.name];
      delete this.savedParameters['Treatment'][par.name];

      // Redraw grap
    },
    simulate(){
      // Send to server that a sim has been run (flag 1)
      var cookie = $cookies.get('T2DSim');
      axios.post(this.statPath+"Visit.php", JSON.stringify({
          CookieID:cookie.key,
          flag:1,
        }))
        .then(response => {
          //console.log(response.data)
        })
        .catch(err => {
          // Manage the state of the application if the request 
          // has failed      
        })

      // console.log("Simulate") 
      this.constructVector();
      this.sim.setBasaldefGCPFIPF(this.simPar.initCond.GBPC0,this.simPar.initCond.IBPF0)
      // Updates the new sim required
      this.newSimRequired = false;
      this.simProg=0;
      // console.log('True sim:',this.sim)
      // console.log('simPar',{...this.simPar})
      // Initial grap stuff for creating the correct previous response
      // See if a prev sim exists
      if(Object.keys(this.Response).length > 0){
        // There is already a response (Must be Current)
        if(this.Response.length >= 2 && this.Response[1].name == "Previous"){
          // Checks if there is 2 or more responses, and if the second response is Previous
          this.Response[1] = {name:'Previous', data:this.Response[0].data, stats:this.Response[0].stats};
        }
        else{
          // The second response isn't the Previous, so insert it into the second spot
          this.Response.splice(1, 0, {name:'Previous', data:this.Response[0].data, stats:this.Response[0].stats});
        }

        // Check what the current compare is (We want it to be "Current" when we click simulate)
        if(this.compare != "Current"){
          this.changeCompare({name:"compare", val:"Current"})
        }

        // Copies the selected displayStates of current, and changes name to previous
        if(this.compareTo == "Previous"){
          var keys = Object.keys(this.displayStates);
          for (let i = 0; i < keys.length; i++){
            // Deletes the prev
            this.graphInfo.datasets = this.graphInfo.datasets.filter((item)=>item.label !== '[Previous] '+keys[i] + ' ' + this.displayStates[keys[i]].unit)
            // Changes the current to prev
            this.graphInfo.datasets = this.graphInfo.datasets.map((item)=>{
              if(item.label === '[Current] '+ keys[i] + ' ' + this.displayStates[keys[i]].unit){
                // Generates the darker color for prev
                var color = item.backgroundColor;
                var colorSplit = color.split(",");
                color = colorSplit[0] + "," + colorSplit[1] + ",30%)";
                // Removes the color so it's available
                Display.removeColorInUse(item.backgroundColor);
                // Return the new object
                return {...item, label: '[Previous] '+keys[i] + ' ' + this.displayStates[keys[i]].unit, backgroundColor:color, borderColor:color}
              }else{
                return item
              }
            })
            // Generates the new current
            if(this.displayStates[keys[i]]['l']){
              // Addes new 
              this.graphInfo.datasets.push(Display.datasetObj('[Current] '+keys[i],"left-y-axis",keys[i],true,[], this.displayStates, this.graphInfo));
            }else if(this.displayStates[keys[i]]['r']){
              // Addes new 
              this.graphInfo.datasets.push(Display.datasetObj('[Current] '+keys[i],"right-y-axis",keys[i],true,[], this.displayStates, this.graphInfo));
            }
          }
        }
        // Update saved external factors and treatment
        let dataExternal = this.savedParameters['External']['Current'].data;
        let dataTreatment = this.savedParameters['Treatment']['Current'].data;
        this.savedParameters['External']['Previous'] = {name: 'Previous', data:dataExternal};
        this.savedParameters['Treatment']['Previous'] = {name: 'Previous', data:dataTreatment};

        // Create new index
        keys = Object.keys(Parameters.Parameters);
        dataExternal = {};
        dataTreatment = {};
        for (let i = 0; i < keys.length; i++) {
          if (Parameters.Parameters[keys[i]].Type.split(' ')[0] == 'External') {
            dataExternal[keys[i]] = this.patient[keys[i]];
          }else if (Parameters.Parameters[keys[i]].Type.split(' ')[0] == 'Treatment') {
            dataTreatment[keys[i]] = this.patient[keys[i]];
          }
        }
        this.savedParameters['External']['Current'] = {name: 'Current', data:dataExternal};
        this.savedParameters['Treatment']['Current'] = {name: 'Current', data:dataTreatment};
      }else{
        // No response, create one (stats must be included)
        this.Response = [{name:'Current', stats: {HbA1c_IFCC: 0, eAG:0, GHavg:0}}]
        // change compare
        this.compare = "Current";

        var keys = Object.keys(this.displayStates);
        for (let i = 0; i < keys.length; i++){
          if(this.displayStates[keys[i]]['l']){
            this.graphInfo.datasets.push(Display.datasetObj('[Current] '+keys[i],"left-y-axis",keys[i],true,[], this.displayStates, this.graphInfo))
            keys[i] === 'GH' ? this.showGlycemia ++ : null ;
          }else if(this.displayStates[keys[i]]['r']){
            this.graphInfo.datasets.push(Display.datasetObj('[Current] '+keys[i],"right-y-axis",keys[i],true,[], this.displayStates, this.graphInfo))
            keys[i] === 'GH' ? this.showGlycemia ++ : null ;
          }
        }
        Display.displayAxisTitle(this.displayStates, this.AxisTitle);
        // To keep track of changes in chart.vue
        this.axisTitleChange ++;

        keys = Object.keys(Parameters.Parameters);
        let dataExternal = {};
        let dataTreatment = {};
        for (let i = 0; i < keys.length; i++) {
          if (Parameters.Parameters[keys[i]].Type.split(' ')[0] == 'External') {
            dataExternal[keys[i]] = this.patient[keys[i]];
          }else if (Parameters.Parameters[keys[i]].Type.split(' ')[0] == 'Treatment') {
            dataTreatment[keys[i]] = this.patient[keys[i]];
          }
        }
        this.savedParameters['External']['Current'] = {name: 'Current', data:dataExternal};
        this.savedParameters['Treatment']['Current'] = {name: 'Current', data:dataTreatment};
      }

      // The simulation part
      if (window.Worker){// Are Webworkers allowed on the browser
        // instantiate the simWorker 
        console.log(this.simPar)
        this.simWorker = new SimWorker([this.sim,this.simPar]);
        this.simRunning = true;
        // Hooks onto the message event of the worker
        this.simWorker.getWorker().addEventListener('message', e => {
          // Is the simulation finished or does the message contain data
          if(e.data == "Finished"){
            this.simRunning = false;
            // console.log('Response',this.Response)
          }else{
            if (typeof e.data.full !== 'undefined'){
              // Get the keys of the displayStates
              let toDisplay = Object.keys(this.displayStates);
              // console.log('toDisplay',toDisplay)
              // console.log('this.displayStates',this.displayStates)
              // console.log('this.graphInfo',this.graphInfo)
              for (let j = 0; j < toDisplay.length; j++) {
                // if the displaystate is true, then it should be displayed
                if (this.displayStates[toDisplay[j]].l===true || this.displayStates[toDisplay[j]].r===true){
                  // Stuff to display the graph
                  let output=[];
                  for (let i=0;i<e.data.full.tout.length;i++){
                    let xi=e.data.full.tout[i];
                    let yi=e.data.full.yout[toDisplay[j]]?e.data.full.yout[toDisplay[j]][i]:0;
                    output.push([xi?xi:0,yi?yi:0]);
                  }
                  // console.log('Pre',this.graphInfo)
                  this.graphInfo.datasets = this.graphInfo.datasets.map((item)=>item.label === '[Current] '+ toDisplay[j]  + ' ' + this.displayStates[toDisplay[j]].unit ? {...item, data: output}: item)
                  // console.log('Post',this.graphInfo)
                }
              }
              // Adds the data to the current response in the response array
              this.Response = this.Response.map((item)=>item.name === 'Current' ? {...item, data: e.data.full}: item)

              // Saves the statistics into the response array
              let statKeys = Object.keys(e.data.full.ResponseStatistics)
              for(let i = 0; i < statKeys.length; i++){
                e.data.full.ResponseStatistics[statKeys[i]] = parseFloat(e.data.full.ResponseStatistics[statKeys[i]]).toFixed(2)
              };
              this.Response = this.Response.map((item)=>item.name === 'Current' ? {...item, stats: e.data.full.ResponseStatistics}: item)
            }

            // if (typeof e.data.progTime !== 'undefined'){
            //   this.simProg=100*e.data.progTime/(this.simPar.time*1440)
            // }

          }

          if (typeof e.data.progTime !== 'undefined'){
            this.simProg=100*e.data.progTime/(this.simPar.time*1440)
          }

          if(e.data == "Finished"){
            this.simRunning = false;


            // Updates the graph (is needed for the CL-doses to update)
            this.updateGraphContent({bool: false, key:"LAI"})
            this.updateGraphContent({bool: true, key:"LAI"})
            this.updateGraphContent({bool: false, key:"FAI"})
            this.updateGraphContent({bool: true, key:"FAI"})
          }
          
          
        });
      }
    },
    cancelSimulation(){
      this.simWorker.TerminateWorker();
      this.simRunning = false;
    },
    debugContent(){
      // console.log(this.GlycemiaInterval)
      // console.log(this.Response[0].data.yout.lai)
      // console.log(this.Response[0].data.yout.fai)
      // console.log("Patient: ", this.patient)
      // console.log("Simpar: ", this.simPar)
      console.log("Response", this.Response)
      // console.log(this.savedParameters)
      // console.log(this.sim)
      console.log(this.compare, this.compareTo)
      // console.log(this.graphInfo)

    },
    importFile(){
      // Create a file-input to handle the file event
      var input = document.createElement('input');
      input.type = 'file';
      // Listen to the change event
      input.onchange = e => { 
        var file = e.target.files[0]; // Getting the selected file
        // Check if file is JSON
        if(file.type != "application/json"){
          alert("The file you selected is not recognized by the simulator.");
          return;
        }
        // Setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        // Event called when the file is loaded(read)
        reader.onload = readerEvent => {
          var content = readerEvent.target.result;
          // console.log(content)
          var jsonParsed = JSON.parse(content);
          if(jsonParsed.Meta != undefined){
            if(jsonParsed.Meta.version != this.version){
              alert("The file you uploaded comes from an older version of the simulator. Some parameters might not be uploaded.")
            }
          }
          jsonParsed.Basal != undefined ? this.sim.Basal = jsonParsed.Basal : null;
          jsonParsed.Params != undefined ? this.sim.Params = jsonParsed.Params : null;
          jsonParsed.simPar != undefined ? this.simPar = jsonParsed.simPar : null;
          jsonParsed.patient != undefined ? this.patient = jsonParsed.patient : null;
          jsonParsed.Response != undefined ? this.Response = jsonParsed.Response : null;
        }
      }
      // Force click on the created file-input to trigger the change event
      input.click();
    },
    exportFile(){
      // Convert to string
      const data = '{"Meta":{"version":'+JSON.stringify(this.version)+"}"+
                    ',"Basal":'+JSON.stringify(this.sim.Basal)+
                    ',"Params":'+JSON.stringify(this.sim.Params)+
                    ',"simPar":'+JSON.stringify(this.simPar)+
                    ',"patient":'+JSON.stringify(this.patient)+
                    ',"Response":'+JSON.stringify(this.Response)+"}"

      // Create the Blob object, and handle the save dialog
      const blob = new Blob([data], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = "PatientFile.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    DownloadResponse(){
      if(!this.simRunning){
        // Checks if a valid response is selected
        if(this.$refs['selectedDownload'].value != ''){
          // Finds the selected response
          let resp = []
          this.Response.forEach(response => {
            response.name == this.$refs['selectedDownload'].value ? resp = response : null
          });
          // Generates data
          let output = '';
          let states = Object.keys(resp.data.yout);
          let row = 'time';
          for (let i = 0; i < states.length; i++) {
            row = row + ',' + states[i]
          }
          output = output + row + '\n';
          // resp.data.tout.forEach(t => {  
          //   row = t;
          //   // let row = t + ',' + resp.data.yout['GH'][t];
          //   for (let i = 0; i < states.length; i++) {
          //     row = row + ',' + resp.data.yout[states[i]][t]
          //   }
          //   output = output + row + '\n';
          // });

          for (let t_i=0;t_i<resp.data.tout.length;t_i++){
            row = resp.data.tout[t_i];
            // let row = t + ',' + resp.data.yout['GH'][t];
            for (let i = 0; i < states.length; i++) {
              row = row + ',' + resp.data.yout[states[i]][t_i]
            }
            output = output + row + '\n';
          }
          
          const data = output;
          // Create the Blob object, and handle the save dialog
          const blob = new Blob([data], {type: 'text/plain'})
          const e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
          a.download = "SimulationResponse.csv";
          a.href = window.URL.createObjectURL(blob);
          a.dataset.downloadurl = ['text/csv', a.download, a.href].join(':');
          e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          a.dispatchEvent(e);
        }else{
          this.$refs['popupInfoDownload'].innerHTML = "Please choose a valid response"
        }
      }else{
        this.$refs['popupInfoDownload'].innerHTML = "Please wait for the simulation to finish"
      }
    },
    clearResponses(){
        this.Response = [];
        this.graphInfo.datasets = [];
    },
    tunedPatient(event){
      let patient = event.srcElement.innerHTML.split(' ')
      if(patient[0] == "Default"){
        //Default
        var response = TunedPatients.patient_default(this.patient,this.simPar,this.sim);
        this.patient = response[0]
        this.sim = response[1]
        this.ActivePatient = "";
      }else{
        patient=patient[0]+' '+patient[1];
        if(patient == "Patient 1"){
          this.sim = TunedPatients.patient1(this.patient,this.simPar,this.sim);
          this.ActivePatient = "Patient 1";
        }
        else if(patient == "Patient 2"){
          var response = TunedPatients.patient2(this.patient,this.simPar,this.sim);
          this.patient = response[0]
          this.sim = response[1]
          this.ActivePatient = "Patient 2";
        }
        else if(patient == "Patient 3"){
          var response = TunedPatients.patient3(this.patient,this.simPar,this.sim);
          this.patient = response[0]
          this.sim = response[1]
          this.ActivePatient = "Patient 3";
        }  
      }
    },
    // Boolean visibility stuff
    toggleVisiblePar(){
      this.advanced = !this.advanced
    },
    toggleVisible(){
      this.showGraph = !this.showGraph
      this.maximized = !this.showGraph
    },
    toMaximize(){
      this.maximized = !this.maximized
    },
    getParametersInType(type){
      let par = {};
      let keys = Object.keys(Parameters.Parameters);
      for (let i = 0; i < keys.length; i++) {
        if(Parameters.Parameters[keys[i]].Type == type){
          par[keys[i]] = Parameters.Parameters[keys[i]]
        }          
      }
      return par;
    },
    openPopup(name){
      name = name.split(' ');
      this.selectedSavedParameter = name[0];
      this.savePopup = true;
    },
    closePopup(){
      this.savePopup = false;
      this.$refs['popupInfo'].innerHTML = "";
      this.$refs['newParameterName'].value = "";
    },
    closePopupOutside(event){
      if(event.target.className == 'save-popup popup'){
        this.savePopup = false;
        this.$refs['popupInfo'].innerHTML = "";
        this.$refs['newParameterName'].value = "";
      }
    },
    saveNewParameters(){
      let name = this.$refs['newParameterName'].value;
      let keys = Object.keys(Parameters.Parameters);
      let data = {};
      for (let i = 0; i < keys.length; i++) {
        if (Parameters.Parameters[keys[i]].Type.split(' ')[0] == this.selectedSavedParameter) {
          data[keys[i]] = this.patient[keys[i]];
        }
      }
      this.savedParameters[this.selectedSavedParameter][name] = {name: name, data:data};
      this.$refs['popupInfo'].innerHTML = "Saved";
    },
    importParameters(){
      let name = this.$refs['selectedParameter'].value;
      if(name != 'None'){
        let keys = Object.keys(Parameters.Parameters);
        for (let i = 0; i < keys.length; i++) {
          if (Parameters.Parameters[keys[i]].Type.split(' ')[0] == this.selectedSavedParameter) {
            this.patient[keys[i]] = this.savedParameters[this.selectedSavedParameter][name].data[keys[i]];
          }
        }
        this.$refs['popupInfo'].innerHTML = "Imported";
      }else{
        this.$refs['popupInfo'].innerHTML = "Please choose valid import option";
      }
    },
    closeDownload(event){
      if(event.target.className == 'download-popup popup'){
        this.downloadPopup = false;
      }
    },
    closeInfo(event){
      if(event.target.className == 'info-popup popup'){
        this.InfoPopup = false;
      }
    },
    closeEULA(event){
      if(event.target.className == 'EULA-popup popup'){
        this.EULAPopup = false;
      }
    },
    EULAClick(){
      // Generates cookie
      var cookie = {
        EULA: true,
        Version: this.version,
        key: ''
      }
      $cookies.set('T2DSim', cookie, 'y')
      // Removes EULA pop-up
      this.EULAPopup = false;
      // Asks server for a unique cookie id (Async so user can access the site if the server is unaccessable)
      axios.get(this.statPath+"NewUser.php")
        .then(response => {
          cookie.key = response.data; // Grabs the cookie-id sent from the server
          $cookies.set('T2DSim', cookie, 'y') // Updates the saved cookie
        })
        .catch(err => {
          // Manage the state of the application if the request 
          // has failed      
        })


    },
    // overlay closed from graph.vue
    closeGraphOverlay(){
      this.newSimRequired = false;
    },
    //gets the type of browser
    detectBrowser() { 
      var browserName = (function (agent) {
        switch (true) {
          case agent.indexOf("edge") > -1: return "MS Edge";
          case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
          case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
          case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
          case agent.indexOf("trident") > -1: return "MS IE";
          case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
          case agent.indexOf("safari") > -1: return "Safari";
          default: return "other";
        }
      })(window.navigator.userAgent.toLowerCase());
      return browserName
    },
    detectDevice(){
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return "Tablet";
      }
      else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
          return "Mobile";
      }
      return "Desktop";
    },
    isActivePatient(el){
      if(el == this.ActivePatient){
        return true
      }else{
        return false
      }
    },
    /**
     * Makes sure everything is displayed when the screenwidth goes above 1000px
     * @param {Object} el The window object
     */
    resizeEvent(el){
      var width = el.srcElement.innerWidth;
      if(width > 1000 && this.PreviousWidth < 1000){
        this.maximized = false;
        this.showGraph = true;
      }
      this.PreviousWidth = width;
    }
  },
  computed: {
    getTypes(){
      return Parameters.Types;
    },
    getParameters(){
      return Parameters.Parameters
    },
    getImport(){
      return this.savedParameters[this.selectedSavedParameter]
    },
    getName(){
      let name = '';
      this.selectedSavedParameter == 'External' ? name = 'External factors' : name=this.selectedSavedParameter;
      return name;
    }
  },
  created(){
    // Clear the colors, so a router-reload will start at red
    Display.colorInUse = [false, false, false, false, false, false];
    // Read cookie
    var cookie = $cookies.get('T2DSim');
    if(cookie != null){ // Check if cookie exists
      if(cookie.EULA == true){ // Check if EULA is consented
        this.EULAPopup = false;
      }
      if(cookie.key == ""){ // Check if a cookie-key is set, else request one.
        axios.get(this.statPath+"NewUser.php")
        .then(response => {
          cookie.key = response.data; // Grabs the cookie-id sent from the server
          $cookies.set('T2DSim', cookie, 'y') // Updates the saved cookie
        })
        .catch(err => {
          // Manage the state of the application if the request 
          // has failed      
        })
      }
      else{ // If the ID is set, we want to register it as a visit (flag 0)
        axios.post(this.statPath+"Visit.php", JSON.stringify({
          CookieID:cookie.key,
          flag:0,
        }))
        .then(response => {
          //console.log(response)
        })
        .catch(err => {
          // Manage the state of the application if the request 
          // has failed      
        })
      }
    }

    

    // Initialize data variabels dependent on number of input parameters
    var tempRepeat = {};
    var tempDisplay = {};
    var tempDisplayArray = {};
    var tempParVector = {};
    var keys = Object.keys(this.getParameters);
    keys.forEach(key => {
      tempRepeat[key] = 'daily';
      tempDisplay[key] = false;
      tempDisplayArray[key] = {};
      tempParVector[key] = {};
      this.patient[key] = [];
    });
    tempRepeat['GLP']='weekly'
    this.simPar.repeat = tempRepeat;
    this.display = tempDisplay;
    this.displayArray = tempDisplayArray;
    this.simPar.parVector = tempParVector;

    // this.simPar.simSettings.selected_solver=this.simPar.simSettings.solverList[1];
    this.patient.Meals = [
      {
        id:1,
        time: 420, // should be 420
        value: 50,
        type: 'High (approximately 80)',
      },
      {
        id:2,
        time: 720,
        value: 50,
        type: 'Medium (approximately 60)',
      },
      {
        id:3,
        time: 1080,
        value: 100,
        type: 'Medium (approximately 60)',
      }
    ]
    this.constructVector();

    this.BrowserType = this.detectBrowser();
    this.DeviceType = this.detectDevice()
    console.log(this.BrowserType, this.DeviceType)

    // If browser is IE, advice them to update to edge
    if(this.BrowserType == "MS IE"){
      this.InfoPopup = true;
    }
    // If phone disable scroll on graph
    if(this.DeviceType != "Desktop"){
      this.graphScroll = false;
    }
    window.addEventListener("resize", this.resizeEvent);
  },
  mounted(){
    // Forces the graph to be drawn
    this.graphInfo.datasets = [];

    

  }
}
</script>

<style>
body{
  margin: 0px;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 390px calc(100% - 390px);
  height: 100vh;
  position: relative;
  z-index: 10;
}

#left-container{  
  /*border: 1px black solid;*/
  grid-row: 1;
  grid-column: 1;
  display: grid;
  grid-template-rows: 1fr 100px;
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 10;

}

#right-container {
  background-color: red;
  display: grid;
  grid-template-rows: 100px 2fr 1fr;
}

#left-params{
  background-color: red;
  grid-row: 1;
  height: 80vh;
  overflow: scroll;
}

#graph{

  /*border: 1px black solid;*/
  margin-left: calc(5% - 8px);
  position: relative;
  width: 95%;
  grid-row: 1;
  grid-column: 2;
  padding: 0px 8px 8px 0;
  transition: .5s;
}
h2{
  font-size: 1.3em;
  margin: 0;
}
p{
  font-size: .8em;
}

input, select {
  border-radius: 0;
  color: black;
  border: none;
  border-bottom: 1px solid #22234e;
  background: whitesmoke;
}
button {
  color: black;
}
i {
  cursor: pointer;
}
.debug{
  display: none;
  position: absolute;
  top: 0;
  z-index: 1;
  right: 40px;
}

#left-tuned-patients {
    grid-row: 2;
    background-color: green;
  }

.maximized {
  grid-column-start: 1!important;
  grid-column-end: 3!important;
  margin-left: 0px!important;
  width: 100%!important;
  padding: 0px!important;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 140px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  font-size: 12px;
  /* Position the tooltip */
  position: absolute;
  z-index: 3;
  right: -140px;
}
.tooltiptext span{
  display: block;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.toggleVisible {
  display: none;
}

svg:hover,
svg:focus{
  color:#22234e;
}

@media only screen and (min-width: 1000px) {
  .expanded{
    display: none;
  }
}
@media only screen and (max-width: 1000px) {
  #app {
    grid-template-columns: 100%;
  }
  .hide {
    display: none;
  }
  #graph{
    grid-column: 1;
    margin-left: 0;
    width: 100%;
    padding: 8px 0px;
  }
  .maximize {
    display: none;
  }
  .toggleVisible {
    display: inline-block;
  }
  #param .tooltip .tooltiptext {
    right: 0px!important;
    top: 24px;
  }
}
@media only screen and (max-width: 600px) {
  .toggleVisible {
    display: block;
  }
}
</style>

<style scoped>
.header {
  position: relative;
}
.External{
  border-top: none!important;
}
.btns{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
  width: 113px;
  height: 73px;
}
.btns button {
  padding: 10px 5px;
  z-index: 1;
}
.container{
  position: relative;
  width: 100%;
  opacity: 1;
}

.popup {
  position: fixed; /* Stay in place */
  z-index: 13; /* Sit on top */
  /*padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.popup .content{
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
}
.popup .close{
  cursor: pointer;
  position: absolute;
  font-size: 20px;
  line-height: 20px;
  padding: 10px;
  top: 0;
  right: 0;
}
.EULA-popup .content{
  width: 800px;
}
.EULA-popup .content span{
  font-weight: bold;
}
.EULA-popup .options{
  padding-top: 10px;
}
.EULA-popup .EULAbtn{
  width: 200px;
  margin-right: 20px;
}
.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
}
.save-popup .content .row{
  display: grid;
  grid-template-columns: 55% calc(45% - 30px) 30px;
  padding: 10px 0px;
}
.download-popup .content .row{
  display: grid;
  grid-template-columns: 55% 30px;
  padding: 10px 0px;
  margin-left: calc((100% - (55% - 30px))/2);
}
.patients .active{
  border: 1px solid blue;
  font-weight: bold;
}
.toggleImportant{
  display: none;
}
@media only screen and (max-height: 740px) {
  .popup{
    padding-top: 0px;
  }
}

@media only screen and (max-width: 1000px) {
  .btns{
    display: block;
    width: auto;
    height: auto;
  }
  #param{
    padding: 0;
    padding-bottom: 8px;
  }
}
@media only screen and (max-width: 840px) {
  .EULA-popup {
    padding-top: 0;
  }
  .EULA-popup .content{
    width: calc(100% - 40px);
  }
}
@media only screen and (max-width: 600px) {
  .btns{
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    height: auto;
  }
  .toggleImportant{
    display: block;
  }
}
</style>
