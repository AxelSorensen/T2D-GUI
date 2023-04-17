<template>
  <div :class="{ 'graph_container_normal': !graphMaximized, 'graph_container_maximized': graphMaximized }">
    <div id="right-top">
      <GraphHeader id="graph-header" :simPar="simPar" :simRunning="simRunning" :simProg="simProg"
        :GlycemiaInterval="GlycemiaInterval" @simulate="$emit('simulate')" @cancelSim="$emit('cancelSim')"
        @updateSimTime="$emit('updateSimTime', $event)" @updateOde="$emit('updateOde', $event)" @zoomChange="zoomChange"
        @toggleVisible="$emit('toggleVisible')" @updateAdvancedSimPar="$emit('updateAdvancedSimPar', $event)"
        @updateGlycemiaInterval="$emit('updateGlycemiaInterval', $event)" />
      <!--
        Subheader (States, patient watermark, maximize)
    -->
      <!-- TODO remove graph subheader aka. STATES -->

      <!-- 
        Chart area
     -->
      <div class="chart">
        <IconToggleButton @click="graphMaximized = !graphMaximized" class="maximize" :show="!graphMaximized" />
        <div class="overlay" v-if="newSimRequired">
          <div class="content">
            <span>Information has changed please simulate again.</span>
          </div>
          
        </div>
        <Chart ref="chartComponent" class="chart-graph" :chartData="graphData" :xMax="simPar.time * 1440"
          :simProg="simProg" :zoom="!simRunning" :showSecondAxis="showSecondAxis" :showGlycemia="showGlycemia"
          :GlycemiaInterval="GlycemiaInterval" :GH="displayStates.GH" :axisTitleChange="axisTitleChange"
          :AxisTitle="AxisTitle" :graphScroll="graphScroll" />


        <!-- TODO removed save graph pic icon -->
        <IconButton class="downloadGraph" @click="DownloadChart" icon="fa-save" />
      </div>
      <div id="subgraph">
        <div id="plot-against">
          <label>Plot: </label>
          <select name="compare" @change="changeCompare">
            <option>None</option>
            <option :key="item.name" v-for="item in getCompare(compareTo)" :selected="item.name == compare">
              {{ item.name }}
            </option>
          </select>
          <label> vs. </label>
          <select name="compareTo" @change="changeCompare">
            <option>None</option>
            <option :key="item.name" v-for="item in getCompare(compare)">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="options">
          <div :key="index" v-for="(par, index) in parameters" @click="checkboxChange(index,display[index])">
            <font-awesome-icon :class="display[index] ? 'icon enabled' : 'icon disabled'" :id=index
                  :icon="display[index] ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"/>
            <!-- <input @change="checkboxChange" type="checkbox" :id=index :checked=display[par.Name]> -->
            <!-- v-if="this.simPar.parVector[index].data.length > 0" -->
            <label :for=index>{{ par.Name }}</label>
          </div>
        </div>
        <GraphSubheader :activePatient="activePatient" :maximized="graphMaximized" :display="display"
          :displayStates="displayStates" :subModel="subModel" :tooltips="tooltips" @toMaximize="$emit('toMaximize')"
          @stateDisplayChange="$emit('stateDisplayChange', $event)" @stateReset="$emit('stateReset')"/>

      </div>
    </div>
    <div v-if="!graphMaximized" id="right-bottom">
      <div id="bottom-divider">
        <div class="response">
          <div id="test">
            <h2>Save response</h2>
            <div class="row">
              <p>Save the current response as:</p><input @keydown.enter="saveNewResponse" ref="newResponseName"
                type="text" placeholder="Response name" /><i @click="saveNewResponse"><font-awesome-icon class="icon"
                  icon="fa-solid fa-floppy-disk" /></i>
            </div>

          </div>
          <div>
            <h2>Import patient</h2>
            <p class="tooltip">Patient file <span class="tooltiptext" style="width: 200px; right: -250px; bottom: 0px">The
                patient file is a JSON-formatted file containing all information for the simulator, including saved
                responses and input parameters.</span></p>
            <div class="row buttons">
              <TextIconButton @click="$emit('importFile')" icon="fa-upload">Upload</TextIconButton>
              <TextIconButton @click="$emit('exportFile')" icon="fa-download">Download</TextIconButton>
            </div>
          </div>


        </div>
        <div>
        
          <div class="wrapper">
            <h2>Response statistics</h2>
            <div class="stat">
              <p>Response Name</p>
              <p>HbA1c [mmol/mol]</p>
              <p>eAG [mmol/L]</p>
              <p>Glucose Average [mmol/L]</p>
            </div>
            <div class="stat" :key="item.name" v-for="(item, index) in response">
              <p class="ResponseName">{{ item.name }}</p>
              <p class="data">{{ item.stats.HbA1c_IFCC }}</p>
              <p class="data">{{ item.stats.eAG }}</p>
              <p class="data">{{ item.stats.GHavg }}</p><a v-show="shouldDelete(item.name)"
                @click="$emit('DeleteResponse', { name: item.name, index: index })"><font-awesome-icon class="icon"
                  icon="xmark" /></a>
            </div>
          </div>
          <IconButton class="download" @click="$emit('DownloadResponse')" icon="fa-download" fontSize="20" />

        </div>

        <!-- <div>
          <h2>Export</h2>
          <div class="text-icon"> <p>Simulation settings</p><i><font-awesome-icon class="icon" icon="fa-solid fa-download" /></i></div>
          <div class="text-icon"> <p>Response statistics</p><i><font-awesome-icon class="icon" icon="fa-solid fa-download" /></i></div>
          <div class="text-icon"> <p>Graph PNG</p><i><font-awesome-icon class="icon" icon="fa-solid fa-download" /></i></div>
          <div class="text-icon"> <p>PDF summary</p><i><font-awesome-icon class="icon" icon="fa-solid fa-download" /></i></div>
        </div> -->

      </div>
    </div>
    <!-- <div class="optionSection"> -->
    <!-- 
            Chart display options
        -->
    <!-- TODO parameter checkmarks under graph removed -->
    <!-- <div class="options">
            <div :key="index" v-for="(par, index) in parameters">
                <input @change="checkboxChange" type="checkbox" :id=index><label :for=index>{{par.Name}}</label>
            </div>
        </div> -->
    <!-- </div> -->
    <!-- 
        Response area
    -->

    <!-- <div class="statistics"> -->
    <!-- TODO Hide response and plot against features for now -->
    <!-- <div class="response">
            <p>Response</p>
            <div class="row">
                <p>Save response as:</p><input @keydown.enter="saveNewResponse" ref="newResponseName" type="text" placeholder="Response name"/><i @click="saveNewResponse"><font-awesome-icon class="icon" icon="fa-solid fa-floppy-disk" /></i>
            </div>
            <div class="row">
                <label>Plot response: </label>
                <select name="compare" @change="changeCompare">
                    <option>None</option>
                    <option :key="item.name" v-for="item in getCompare(compareTo)" :selected="item.name == compare">
                        {{item.name}}
                    </option>
                </select>
            </div>
            <div class="row">
                <label>Plot against response: </label>
                <select name="compareTo" @change="changeCompare">
                    <option>None</option>
                    <option :key="item.name" v-for="item in getCompare(compare)">
                        {{item.name}}
                    </option>
                </select>
            </div>
            <p class="tooltip">Patient file <span class="tooltiptext">The patient file is a JSON-formatted file containing all information for the simulator, including saved responses and input parameters.</span></p>
            <div class="row">
                <TextIconButton @click="$emit('importFile')" icon="fa-upload">Upload</TextIconButton>
                <TextIconButton @click="$emit('exportFile')" icon="fa-download">Download</TextIconButton>
            </div>
        </div> -->
    <!-- <div class="wrapper">
            <h3>Response statistics</h3>
            <IconButton class="download" @click="$emit('DownloadResponse')" icon="fa-download" />
            <div class="stat">
                <p>Response Name</p><p>HbA1c [mmol/mol]</p><p>eAG [mmol/L]</p><p>Glucose Average [mmol/L]</p>
            </div>
            <div class="stat" :key="item.name" v-for="(item, index) in response">
                <p class="ResponseName">{{item.name}}</p><p>{{item.stats.HbA1c_IFCC}}</p><p>{{item.stats.eAG}}</p><p>{{item.stats.GHavg}}</p><a v-show="shouldDelete(item.name)" @click="$emit('DeleteResponse', {name:item.name, index:index})"><font-awesome-icon class="icon" icon="xmark"/></a>
            </div>
        </div> -->

    <!-- </div> -->
  </div>
</template>

<script>
import Chart from './Chart.vue'
import Collapse from './Transitions/Collapse.vue'
import IconButton from './IconButton.vue';
import IconToggleButton from './IconToggleButton.vue';
import TextIconButton from './TextIconButton.vue';
import ImportantInfo from './ImportantInfo.vue';
import GraphHeader from './GraphHeader.vue'
import GraphSubheader from './GrapSubheader.vue';

/**
 * The component used as a container for the chart and the other things related to displaying the graphs.
 */
export default {
  name: "Graph Area",
  components: {
    Chart,
    Collapse,
    IconButton,
    IconToggleButton,
    TextIconButton,
    ImportantInfo,
    GraphHeader,
    GraphSubheader,
  },
  props: {
    graphData: Object,
    simPar: Object,
    simProg: 0.00,
    display: Object,
    displayStates: Object,
    simRunning: Boolean,
    response: Object,
    maximized: false,
    newSimRequired: Boolean,
    subModel: Array,
    tooltips: Object,
    showSecondAxis: Boolean,
    showGlycemia: Number,
    showGlycemia: Number,
    showGlycemia: Number,
    GlycemiaInterval: Object,
    axisTitleChange: Number,
    AxisTitle: Array,
    graphScroll: Boolean,
    selected_solver: String,
    solverList: Array,
    activePatient: String,
    parameters: Object,
    compare: String,
    compareTo: String,
  },
  data() {
    return {
      graphMaximized: false,
      showAdvanced: false,
      showStates: false,
      show: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      plotting_click: false,
      responseName: '',
    }
  },
  emits: ["simulate", "cancelSim", "updateSimTime", "updateGraphContent", "updateAdvancedSimPar", "stateDisplayChange", "saveNewResponse", "changeCompare", "importFile", "exportFile", "toMaximize", "updateGlycemiaInterval", "DownloadResponse", "DeleteResponse", "updateOde", "closeOverlay", "toggleVisible", "stateReset"],
  methods: {
    togglePlotting() {
      this.plotting_click = !this.plotting_click;
    },
    convertMinutesToTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const minutesRemainder = minutes % 60;
      const hoursString = hours.toString().padStart(2, '0');
      const minutesString = minutesRemainder.toString().padStart(2, '0');
      return `${hoursString}:${minutesString}`;
    },
    zoomChange(days) {
      console.log('Zoom change', days)
      this.$refs.chartComponent.ZOOOM(days)
    },
    checkboxChange(parameter,checked) {

      this.$emit("updateGraphContent", { key: parameter, bool: !checked })
    },
    changeCompare(event) {
      this.$emit("changeCompare", { name: event.srcElement.name, val: event.srcElement.value })
    },
    saveNewResponse() {
      this.$emit("saveNewResponse", this.$refs['newResponseName'].value)
      this.$refs["newResponseName"].value = "";
    },
    /**
     * Should the user be able to delete the response
     * @param {String} name Name of the response
     */
    shouldDelete(name) {
      let bool = true;
      name === 'Current' ? bool = false :
        name === 'Previous' ? bool = false :
          bool = true;
      return bool;
    },
    DownloadChart() {
      // Gets Canvas element
      var canvas = document.getElementById('chart');
      // Gets 2d context
      var ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = "destination-over";  // Sets style change to background
      ctx.fillStyle = "#ffffff";                          // Sets style color (background)
      ctx.fillRect(0, 0, canvas.width, canvas.height);    // Draw the entire canvas as background with color from above
      // Create a fake event to trick a download
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a'); a.download = "Graph.jpg";
      a.href = canvas.toDataURL("image/jpg");
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    // Emits the closing of overlay to top level
    closeOverlay() {
      this.$emit("closeOverlay");
    },
    /**
     * Returns a list of responses - the item to filter (the one selected by the other)
     */
    getCompare(ItemToFilter) {
      let resp = [...this.response]
      // Removes the first response in the array (Current response)
      resp = resp.filter((item) => item.name !== ItemToFilter)
      return resp
    },
    mounted() {

    },
  }

}

</script>

<style scoped>
.graph_container_normal {
  display: grid;
  height: calc(100vh - 2*8px);
  grid-template-rows: 2fr 1fr;
  gap: 8px;
}

.graph_container_maximized {
  display: grid;
  height: calc(100vh - 2*8px);
  grid-template-rows: 1fr;
  gap: 8px;
}


#bottom-divider {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr 5px;
  gap: 24px;

}


td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 4px;
}

#right-top {

  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
}


#right-bottom {

  grid-row: 2;
  padding: 16px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#subgraph {
  display: flex;

  align-items: flex-end;
  justify-content: space-between;
  padding: 16px 16px;
}


/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  outline: none;
}

.parameters i {
  position: relative;
  font-size: 19px;
  line-height: 19px;
  padding: 10px;
  cursor: pointer;
}

.chart {
  position: relative;
  padding: 0px 20px;
  border-radius: 5px;
  z-index: 0;
  
}


h2 {
  margin-bottom: 8px;
}

.chart-graph {
  height: 48vh;
}

.graph_container_maximized .chart-graph {
  height: 80vh;
}

.chart .overlay {
  position: absolute;
  z-index: -1;
  width: calc(100% - 40px);
  height: 100%;
  background-color: rgb(0, 0, 0);
  /* Fallback color */
  background-color: rgba(255, 0, 0, .05);
  /* Black w/ opacity */
  border-radius: 5px;
}



.chart .overlay .content {
  position: absolute;
  display: flex;
  gap: 8px;
  flex-direction: column;
  bottom: 0px;

  width: 100px;
  color: red;
  font-weight: bold;
  font-size: 14px;
  padding: 6px;
  width: 100%;
  text-align: left;
  
}

.chart .overlay .close {
  cursor: pointer;
  position: absolute;
  font-size: 20px;
  line-height: 20px;
  padding: 10px;
  top: -10px;
  right: -9px;
}

.chart .overlay .close:hover,
.chart .overlay .close:focus {
  color: #000;
  text-decoration: none;
}

.resimulate {
  text-align: center;
}

.downloadGraph {
  position: absolute;
  right: 24px;
  bottom: 40px;
}


/* TODO added plot against under graph */
#plot-against {
  align-content: center;
  gap: 10px;
  display: flex;
}

.options div {
  display: inline-block;
}


#plotting-options {}


.options label {
  cursor: pointer;
  font-size: 10px;
  padding-right: 6px;
}

.options input {
  position: relative;
  top: 3px;
}

.options {
  cursor: pointer;
  gap: 6px;
  display: flex;
  align-items: center;
  justify-items: center;
}

.statistics {
  position: relative;
}

p {
  border: .5px solid black;
  margin: 0;
  padding: 5px;
  font-size: 12px;
}

.stat {
  display: grid;
  grid-template-columns: 31% 20% 20% 20% 9%;
  padding-left: 30px;
}

.stat a {
  color: red;
  font-size: 20px;
  line-height: 20px;
  padding: 5px;
  padding-left: 0;
  cursor: pointer;
}


.wrapper {
  height: 23vh;
  position: relative;
  margin: 0;
  overflow-y: scroll;
}

.download {
  position: absolute;
  top: 0px;
  right: 0px;
}

#patient-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data {
  font-weight: bold;
}

.response {
  position: relative;
  grid-column: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
}

.response p {
  font-size: 14px;

  text-align: left;
}

.response input {
  outline: none;
  height: 40px;
}

.response .row {
  margin-bottom: 0;

}

.iconbig {
  width: 20px;
  height: 20px;
}

.icon {
  margin-bottom: -1px;
  margin-right: 4px;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.disabled {
  color: rgb(215, 215, 215);
}

.response .row:nth-child(2) {
  display: grid;
  grid-template-columns: 50% calc(50% - 15px) 15px;
}

.response .row i {
  width: 22px;
  height: 42px;
  cursor: pointer;
  background: whitesmoke;
  border-bottom: 1px solid black;

  display: grid;
  align-items: center;
}

.buttons {
  gap: 8px;
}

.text-icon {
  display: flex;
  justify-content: space-between;
  padding-right: 8px;
}

.text-icon p {
  border: none;
  font-size: 14px;
}

.maximize {
  position: absolute;
  right: 22px;
  top: 30px;
}

.response .row:nth-child(3),
.response .row:nth-child(4),
.response .row:nth-child(6) {
  display: grid;
  grid-template-columns: 50% 50%;
}

.response p {
  border: none;
}

.ResponseName {
  overflow: hidden;
}

.response a {
  cursor: pointer;
  padding: 5px 0;
  margin: 0 15px;
  border-bottom: 1px solid black
}

a svg {
  padding: 0 5px
}


.days {
  margin-left: 5px !important;
}

.alpha span {
  font-size: 25px;
  font-weight: bold;
}

@media only screen and (max-width: 1124px) {
  .statistics {
    grid-template-columns: none;
  }

  .response {
    position: relative;
    grid-column: unset;
    grid-row: 2;
    width: 300px;
    left: calc(50% - 150px);
  }

  .wrapper {
    grid-column: unset;
    grid-row: 1;
  }
}


@media only screen and (max-width: 600px) {
  .wrapper {
    left: 0;
    width: 100%;
  }

  .tooltiptext {
    left: 0;
    width: 200px;
    transform: translate(25%, 30%);
  }

  .GraphImportantInfo {
    display: none;
  }
}
</style>