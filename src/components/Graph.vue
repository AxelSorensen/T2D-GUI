<template>
    <GraphHeader 
        :simPar="simPar"
        :simRunning="simRunning"
        :simProg="simProg"
        :GlycemiaInterval="GlycemiaInterval"
        @simulate="$emit('simulate')"
        @cancelSim="$emit('cancelSim')"
        @updateSimTime="$emit('updateSimTime', $event)"
        @updateOde="$emit('updateOde', $event)"
        @zoomChange="zoomChange"
        @toggleVisible="$emit('toggleVisible')"
        @updateAdvancedSimPar="$emit('updateAdvancedSimPar', $event)"
        @updateGlycemiaInterval="$emit('updateGlycemiaInterval', $event)"
         />
    <!--
        Subheader (States, patient watermark, maximize)
    -->
    <GraphSubheader
        :activePatient="activePatient"
        :maximized="maximized"
        :display="display"
        :displayStates="displayStates"
        :subModel="subModel"
        :tooltips="tooltips"
        @toMaximize="$emit('toMaximize')"
        @stateDisplayChange="$emit('stateDisplayChange', $event)" />
    <!-- 
        Chart area
     -->
     <div class="chart">
        <div class="overlay" v-if="newSimRequired">
            <div class="content">
                <span>Information has changed please simulate again.</span>
                <IconButton @click="closeOverlay" class="close" icon="xmark" />
            </div>
        </div>
    <Chart
        ref="chartComponent"
        class="chart"
        :chartData="graphData"
        :xMax="simPar.time*1440"
        :simProg="simProg"
        :zoom="!simRunning"
        :showSecondAxis="showSecondAxis"
        :showGlycemia="showGlycemia"
        :GlycemiaInterval="GlycemiaInterval"
        :GH="displayStates.GH"
        :axisTitleChange="axisTitleChange"
        :AxisTitle="AxisTitle"
        :graphScroll="graphScroll"/>
    <IconButton class="downloadGraph" @click="DownloadChart" icon="fa-save" />
    </div>
    <!-- <div class="optionSection"> -->
        <!-- 
            Chart display options
        -->
        <div class="options">
            <div :key="index" v-for="(par, index) in parameters">
                <input @change="checkboxChange" type="checkbox" :id=index><label :for=index>{{par.Name}}</label>
            </div>
        </div>
    <!-- </div> -->
    <!-- 
        Response area
    -->
    <div class="statistics">
        <div class="response">
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
        </div>
        <div class="wrapper">
            <h3>Response statistics</h3>
            <IconButton class="download" @click="$emit('DownloadResponse')" icon="fa-download" />
            <div class="stat">
                <p>Response Name</p><p>HbA1c [mmol/mol]</p><p>eAG [mmol/L]</p><p>Glucose Average [mmol/L]</p>
            </div>
            <div class="stat" :key="item.name" v-for="(item, index) in response">
                <p class="ResponseName">{{item.name}}</p><p>{{item.stats.HbA1c_IFCC}}</p><p>{{item.stats.eAG}}</p><p>{{item.stats.GHavg}}</p><a v-show="shouldDelete(item.name)" @click="$emit('DeleteResponse', {name:item.name, index:index})"><font-awesome-icon class="icon" icon="xmark"/></a>
            </div>
        </div>
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
import GraphSubheader from './GrapSubheader.vue'

/**
 * The component used as a container for the chart and the other things related to displaying the graphs.
 */
export default {
    name: "Graph Area",
    components:{
    Chart,
    Collapse,
    IconButton,
    IconToggleButton,
    TextIconButton,
    ImportantInfo,
    GraphHeader,
    GraphSubheader
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
    data(){
        return {
            showAdvanced: false,
            showStates: false,
            show: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        }
    },
    emits: ["simulate", "cancelSim", "updateSimTime", "updateGraphContent", "updateAdvancedSimPar","stateDisplayChange","saveNewResponse", "changeCompare", "importFile", "exportFile", "toMaximize", "updateGlycemiaInterval","DownloadResponse","DeleteResponse","updateOde","closeOverlay","toggleVisible"],
    methods:{
        zoomChange(days){
            console.log('Zoom change',days)
            this.$refs.chartComponent.ZOOOM(days)
        },
        checkboxChange(event){
            console.log({key:event.srcElement.id, bool:event.srcElement.checked})
            this.$emit("updateGraphContent", {key:event.srcElement.id, bool:event.srcElement.checked})
        },
        changeCompare(event){
            this.$emit("changeCompare", {name:event.srcElement.name, val:event.srcElement.value})
        },
        saveNewResponse(){
            this.$emit("saveNewResponse", this.$refs['newResponseName'].value)
        },
        /**
         * Should the user be able to delete the response
         * @param {String} name Name of the response
         */
        shouldDelete(name){
            let bool = true;
            name === 'Current' ? bool = false :
            name === 'Previous' ? bool = false :
            bool = true;
            return bool;
        },
        DownloadChart(){
            // Gets Canvas element
            var canvas = document.getElementById('chart');
            // Gets 2d context
            var ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = "destination-over";  // Sets style change to background
            ctx.fillStyle = "#ffffff";                          // Sets style color (background)
            ctx.fillRect(0, 0, canvas.width, canvas.height);    // Draw the entire canvas as background with color from above
            // Create a fake event to trick a download
            const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');a.download = "Graph.jpg";
            a.href = canvas.toDataURL("image/jpg");
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        },
        // Emits the closing of overlay to top level
        closeOverlay(){
            this.$emit("closeOverlay");
        },
        /**
         * Returns a list of responses - the item to filter (the one selected by the other)
         */
         getCompare (ItemToFilter) {
            let resp = [...this.response]
            // Removes the first response in the array (Current response)
            resp = resp.filter((item)=> item.name !== ItemToFilter)
            return resp
        },
    },
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.parameters i{
    position: relative;
    font-size: 19px;
    line-height: 19px;
    padding: 10px;
    cursor: pointer;
}
.chart{
    position: relative;
    margin-top: 35px;
    height: 500px;
}
.chart .overlay{
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.chart .overlay .content{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 250px;
}
.chart .overlay .close{
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
.downloadGraph{
    position: absolute;
    right: 0;
    bottom: 50px;
}

.options div{
    display: inline-block;
}
.options label{
    padding-right: 25px;
}
.statistics{
    position: relative;
    display: grid;
    grid-template-columns: 250px calc(100% - 500px) 250px;
}
.statistics p{
    border: 1px solid black;
    margin: 0;
    padding: 5px;
}
.statistics .stat{
    display: grid;
    grid-template-columns: 31% 23% 23% 23% 30px;
}
.statistics .stat a{
    color: red;
    font-size: 20px;
    line-height: 20px;
    padding: 5px;
    padding-left: 0;
    cursor: pointer;
}
.statistics .wrapper{
    position: relative;
    grid-column: 2;
    width: 80%;
    left: 10%;
    min-width: 400px;
}
.download{
    position: absolute;
    top: 1em;
    right: 5px;
}

.statistics .response{
    position: relative;
    grid-column: 1;
    left: 0;
    top: 0px;
}
.statistics .response .row{
    padding: 5px 0px;
    margin-bottom: 0;
}
.statistics .response .row:nth-child(2){
    display: grid;
    grid-template-columns: 50% calc(50% - 15px) 15px;
}
.statistics .response .row i{
    cursor: pointer;
    background: whitesmoke;
    border-bottom: 1px solid black;
    line-height: 46px;
    text-align: center;
}
.statistics .response .row:nth-child(3), .statistics .response .row:nth-child(4), .statistics .response .row:nth-child(6){
    display: grid;
    grid-template-columns: 50% 50%;
}
.response p {
    border: none;   
}
.statistics .ResponseName{
    overflow: auto;
}
.statistics .response a{
    cursor: pointer;
    padding: 5px 0;
    margin: 0 15px;
    border-bottom: 1px solid black
}
a svg{
    padding: 0 5px
}
.days{
    margin-left: 5px!important;
}
.alpha span{
  font-size: 25px;
  font-weight: bold;
}
@media only screen and (max-width: 1124px) {
  .statistics {
    grid-template-columns: none;
  }
  .statistics .response{
    position: relative;
    grid-column: unset;
    grid-row: 2;
    width: 300px;
    left: calc(50% - 150px);
  }
  .statistics .wrapper{
    grid-column: unset;
    grid-row: 1;
  }
}
@media only screen and (max-width: 600px) {
    .statistics .wrapper{
        left: 0;
        width: 100%;
    }
    .statistics .tooltiptext{
        left: 0;
        width: 200px;
        transform: translate(25%, 30%);
    }
    .GraphImportantInfo{
        display: none;
    }
}
</style>