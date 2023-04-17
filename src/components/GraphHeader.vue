<template>
  <!-- 
    Graph area top bar (settings, simulate, contributors)
  -->
  <div v-if="showAdvanced | important_click | aau_click" class="click_away" @click="handleClickAway"></div>
  <div class="header">
    <div id="graph-settings">
      <div id="left-settings">
        <TextIconButton v-if="simRunning" @click="$emit('cancelSim')" icon="fa-xmark" color="hsl(0, 100%, 50%)">Cancel
          Simulation</TextIconButton>
        <TextIconButton v-else @click="$emit('simulate')" icon="fa-play" color="hsl(120, 100%, 30%)">Simulate
        </TextIconButton>
        <label for="simTime">Simulation time:</label>
        <input @change="updateSimTime" type="number" min="1" name="simTime" :value="simPar.time" />
        <label for="simTime" class="days">day(s)</label>
        <label v-if="simRunning" :v-show="this.simProg" :v-html="updateProg">{{ updateProg }}</label>
      </div>
      <div id="right-settings">
        <div id="zoom-settings">
          <TextIconButton class="zoom-btn" @click="$emit('zoomChange', this.showNumDays)" icon="fa-magnifying-glass">Zoom
          </TextIconButton>
          to last <input type="number" :value="showNumDays" @change="zoomDaysAdjust($event, 'number')" /> day(s)
        </div>
        <TextIconButton v-if="!important_click" icon="fa-circle-exclamation"
          :class="{ important_clicked: important_click }" color="hsl(0, 100%, 50%)" @click="toggleImportant()">Important
          information</TextIconButton>
        <TextIconButton v-else icon="xmark" :class="{ important_clicked: important_click }" color="hsl(0, 100%, 50%)"
          @click="toggleImportant()">Important information</TextIconButton>
            <!-- 
   Dropdown for advanced sim settings
  -->
        <div class="advancedSimPar">
          <IconButton @click="showAdvanced = !showAdvanced" icon="fa-sliders" />
          
          <Collapse>
            <div v-show="showAdvanced" class="container">
              <!-- <label for="odeSolver">ode Solver:</label><select @change="updateOde" v-model="selected_solver">
                            <option :key="solver" v-for="solver in solverList">{{solver}}</option>
                        </select>-->
                        <div class="par"> <label>Auto simulate</label>
                <input @change="update" name="autosim" type="checkbox"/>
              </div>
                       
              <div class="par">
                <label for="relTol">Relative tolerance: </label><input @change="update" type="number" name="relTol"
                  :value="this.simPar.simSettings.rtol" step="0.00000001" />
              </div>
              <div class="par">
                <label for="stepSize">Minimum step size: </label><input @change="update" type="number" name="stepSize"
                  :value="this.simPar.simSettings.hmin" step="0.0000001" />
              </div>
              <div class="par">
                <label for="dataFreq">Graph resolution scale: </label><input @change="update" type="number"
                  name="dataFreq" :value="this.simPar.simSettings.dataFrequencyRatio" step=".1" />
              </div>
              <div class="par">
                <label for="GraphFreq">Graph update frequency: </label><input @change="update" type="number"
                  name="graphFrequency" :value="this.simPar.simSettings.graphFrequency" step=".1" />
              </div>
              <div class="par">
                <label for="Glycemia">Glycemia interval: </label>
                <div class="GlycemiaInterval">
                  [<input @change="intervalChange" name="lower" type="number" min="0"
                    :value="GlycemiaInterval.lower" />:<input @change="intervalChange" name="upper" type="number" min="0"
                    :value="GlycemiaInterval.upper" />]
                </div>
              </div>
              <div class="par">
                <label for="processNoise_GH">Process noise std: </label><input @change="update" type="number"
                  name="processNoise_GH" :value="this.simPar.simSettings.processNoise_GH" step="0.1" />
              </div>
              <div class="par">
                <label for="HbA1c_interval">HbA1c interval: </label><input @change="update" type="number"
                  name="HbA1c_interval" :value="this.simPar.simSettings.HbA1c_interval" step="0.1" />
              </div>
              <div class="ClosedLoop">
                <h3>Closed Loop</h3>
                <div class="par">
                  <label for="clEnable">Enable: </label><input @change="update" type="checkbox" name="clEnable" />
                </div>
                <div class="par">
                  <label for="clStartTime" class="tooltip" style="position: relative;">First function call at: <span
                      class="tooltiptext" style="width:200px; right: -40%; top: 20px;">The user defined function will
                      first be called at specified time in minutes</span></label><input @change="update" type="number"
                    name="clStartTime" :value="this.simPar.simSettings.clStartTime" step="1" />
                </div>
                <div class="par">
                  <label for="clPeriod" class="tooltip" style="position: relative;">Function call period: <span
                      class="tooltiptext" style="width:200px; right: -40%; top: 20px;">The user defined function will be
                      called every specified amount of minutes</span></label><input @change="update" type="number"
                    name="clPeriod" :value="this.simPar.simSettings.clPeriod" step="1" />
                </div>
                <div class="function">
                  <label for="closedLoopInit" class="tooltip" style="position: relative;">Initial function:
                    <span class="tooltiptext" style="width:200px; right: -75%; top: 20px;">The following code will be
                      called at start of simulation. initialise variable 'memory' to desired structure and values</span>
                  </label>
                  <textarea @change="update" type="text" name="closedLoopInit" class="CLInit"
                    :value="this.simPar.simSettings.clInitStr"></textarea>
                </div>
                <div class="function">
                  <label for="closedLoop" class="tooltip" style="position: relative;">
                    Function ():
                    <span class="tooltiptext" style="width:200px; right: -75%; top: 20px;">The following code will be
                      called at 7am every day. Access current state x['state'] and set variable 'lai' to set the selected
                      long acting insulin's dose, or set variable 'fai' to set the selected fast acting insulin's
                      dose</span>
                  </label>
                  <textarea @change="update" type="text" name="closedLoop"
                    :value="this.simPar.simSettings.clStr"></textarea>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
        <div :class="{ aau_clicked: aau_click }" id="aau-button" @click="toggleAAU()"><img v-if="!aau_click"
            src="../assets/AAU_CENTER_WHITE_UK.png" alt="">
          <IconButton class="x-icon" v-else icon="xmark" color="white" />
        </div>

        <Collapse>
          <div v-if="aau_click" id="aau-dropdown">


            <div class="right">
              <p>Contributors: Mohamad Al Ahdab, Deividas Eringis & John-Josef Leth </p>
              <p>UI design: Mikkel Pedersen</p>
              <p>Medical advisory board: Jakob Dal</p>
              <p>Copyright © 2022 {{ version }}</p>
            </div>
            <nav>
              <router-link to="/legal">EULA and cookie policy</router-link>
            </nav>
          </div>
        </Collapse>
        <Collapse>
          <div v-if="important_click" id="important-dropdown">


            <div class="Disclaimer">
              <span><b>This simulator is intended for teaching and research purposes only. Under no circumstances should
                  it be used as a tool for self-treatment.</b></span><br />
              <span>
                <span>This simulator is developed by the Nonlinear and Optimal Control Lab at Aalborg University, and is
                  based on the following paper:</span>
                <span class="source"><a href="https://www.sciencedirect.com/science/article/pii/S1369703X21002461">[1]
                    Glucose-Insulin Mathematical Model for the Combined Effect of Medications and Life Style of Type 2
                    Diabetic Patients , Biochemical Engineering Journal[DOI: 10.1016/j.bej.2021.108170]</a></span>
                <ul>
                  <li>All references (equation number, section number etc.,) refer to [1]. Additional material has been
                    added to the simulator, this is indicated by the symbol *. </li>
                  <li>For comments and questions, please contact John Leth at jjl@es.aau.dk</li>
                </ul>
              </span>
            </div>
          </div>
        </Collapse>
        <!-- RESET zoom button -->
        <!-- <TextIconButton class="zoom-btn" @click="$emit('zoomChange',0)" icon="fa-history" color="hsl(120, 100%, 30%)" >Reset Zoom</TextIconButton> -->
      </div>

    </div>
    <!-- 
            Buttons for important information and toggle to inputs when on smaller screens
            And a wrapper for the advanced sim settings
         -->
    <!-- <div class="btns">
            <TextIconButton @click="$emit('toggleVisible')" class="toggleVisible" icon="fa-chart-line">Show Parameters </TextIconButton> -->


    <!-- 
                Advanced settings dropdown
            -->

  </div>
</template>

<script>
import Collapse from './Transitions/Collapse.vue'
import IconButton from './IconButton.vue';
import TextIconButton from './TextIconButton.vue';
import ImportantInfo from './ImportantInfo.vue';
/**
 * The component used as a container for the chart and the other things related to displaying the graphs.
 */
export default {
  name: "Graph Header",
  components: {
    Collapse,
    IconButton,
    TextIconButton,
    ImportantInfo
  },
  props: {
    simPar: Object,
    simProg: 0.00,
    simRunning: Boolean,
    GlycemiaInterval: Object,
    selected_solver: String,
    solverList: Array
  },
  data() {
    return {
      showAdvanced: false,
      showNumDays: 3,
      lastShowNumDays: 3,
      showNumDaysBox: 3,
      ZoomToDaysBool: false,
      aau_click: false,
      important_click: false

    }
  },
  emits: ["simulate", "cancelSim", "updateSimTime", "updateOde", "zoomChange", "toggleVisible", "updateAdvancedSimPar", "updateGlycemiaInterval"],
  methods: {

    handleClickAway() {
      this.aau_click = false;
      this.important_click = false;
      this.showAdvanced = false;
       // Get the element that is currently under the cursor

    },
    resetZoomToDaysBool() {
      this.ZoomToDaysBool = false;
      this.showNumDays = this.lastShowNumDays
    },

    // Trigger the aau contributors dropdown
    toggleAAU() {
      this.aau_click = !this.aau_click;
    },
    // Trigger the important information dropdown
    toggleImportant() {
      this.important_click = !this.important_click;

    },
    // Updates simulation time
    updateSimTime(event) {
      let value = parseInt(event.srcElement.value);
      value < 1 ? value = 1 : null
      event.srcElement.value = value;
      this.$emit("updateSimTime", event.srcElement.value)
    },
    // Updates the advanced simulation parameters
    update(event) {
      event.srcElement.name === "clEnable" || 'autosim' ? this.$emit("updateAdvancedSimPar", { name: event.srcElement.name, val: event.srcElement.checked }) : this.$emit("updateAdvancedSimPar", { name: event.srcElement.name, val: event.srcElement.value })
      // console.log({name:event.srcElement.name, val:event.srcElement.checked})
    },
    intervalChange(event) {
      let value = event.srcElement.value;
      let name = event.srcElement.name;
      // Value must be zero or above
      (value < 0) ? value = 0 : null;
      // Lower bound must not be above upper, and upper must not be below lower
      (name == 'lower' && value > this.GlycemiaInterval.upper) ? value = this.GlycemiaInterval.upper :
        (name == 'upper' && value < this.GlycemiaInterval.lower) ? value = this.GlycemiaInterval.lower : null;
      event.srcElement.value = value;
      this.$emit("updateGlycemiaInterval", { name: name, value: value });
    },
    updateOde(event) {
      this.$emit("updateOde", event.srcElement.value)
    },
    /**
     * Updates the time axis minimum
     * @param {*} event 
     */
    zoomDaysAdjust(event, number) {
      if (number != undefined) {// number box change
        let val = parseInt(event.srcElement.value);
        val < 1 ? val = 1 : null
        val > this.simPar.time ? val = this.simPar.time : null
        this.showNumDays = parseInt(val);
        this.$emit('zoomChange', this.showNumDays)
      }
    }
  },
  computed: {
    /**
     * Return a value between 0-100% dependent on the progress of the simulation
     */
    updateProg: function () {
      return (typeof this.simProg.toFixed !== 'undefined') ? this.simProg.toFixed(2) + "%" : "";
    },
  },
}
</script>

<style scoped>
/* NEW CSS */

#aau-button {
  background-color: #22234e;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  float: right;
  cursor: pointer;
}

#aau-button img {
  width: 25px;
}

.aau_clicked {
  background-color: rgb(34, 35, 78, .5) !important;
}

.important_clicked {
  background-color: rgba(172, 172, 172, 0.5) !important;
}


.header {
  position: relative;
  padding: 16px;

  display: flex;
  justify-content: space-between;
}

.click_away {
  position: fixed;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.1);
  height: 100vh;
  width: 100vw;
  z-index: 10;
}

.header #graph-settings {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between
}

#right-settings {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.x-icon {
  color: white;
}


.header .btns {
  display: grid;
  grid-template-columns: calc(100% - 30px) 30px;
}

.ZoomSettings {
  padding-left: 25px;
}

.ZoomSettings .zoom-btn {
  margin-right: 5px;
}

.header label {
  margin-left: 20px;
  margin-right: 5px;
  text-align: left;
}

.header input {
  width: 35px;
  z-index: 2;
}

.header .advancedSimPar {
  position: relative;
  width: auto;

}

.header .advancedSimPar input {
  width: auto;
}

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

#aau-dropdown {
  
  display: grid;
  align-items: center;
  background-color: rgb(34, 35, 78);
  height: 200px;
  width: 400px;
  border-radius: 5px;
  position: absolute;
  top: 50px;
  right: 16px;
  z-index: 10;
  color: white;
  padding: 6px;

}

#important-dropdown {
  display: grid;
  align-items: center;
  background-color: white;
  height: 200px;
  width: 400px;
  border-radius: 10px;
  position: absolute;
  top: 50px;
  right: 10%;
  z-index: 10;
  padding: 6px;
  border: 1px solid black;
}

#aau-dropdown a {
  color: rgb(113, 234, 255);

}

.header i {
  position: relative;
  font-size: 19px;
  line-height: 19px;
  padding: 10px;
  cursor: pointer;
}

.advancedSimPar .container {
  position: absolute;
  right: 0px;
  width: 270px;
  z-index: 12;
  background: white;
  border: 1px black solid;
  padding: 6px;
  margin-right: -1px;
  border-radius: 5px;
}

.advancedSimPar .par {
  display: grid;
  grid-template-columns: 70% 30%;
}

.advancedSimPar .par input,
.advancedSimPar .par label {
  margin: 5px 0;
}

.advancedSimPar .GlycemiaInterval input {
  width: 29px;
}

.advancedSimPar .container .ClosedLoop h3 {
  border-top: 1px solid #22234e;
  text-align: center;
  margin: 5px 0px 5px 0px;
  padding-top: 5px;
}

.advancedSimPar .container .ClosedLoop .function {
  text-align: center;
}

.advancedSimPar .container .ClosedLoop textarea {
  width: 90%;
  background: whitesmoke;
  border: 1px solid #ccc;
  border-bottom: 1px solid #22234e;
  height: 120px;
  resize: vertical;
  overflow: hidden;
  line-height: 15px;
  padding: 5px;
}

.advancedSimPar .container .ClosedLoop .CLInit {
  height: 30px;
}


.days {
  margin-left: 5px !important;
}

@media only screen and (max-width: 1450px) {
  .header {
    grid-template-columns: 100%;
    grid-template-rows: auto auto;
  }

  .header .btns {
    grid-row: 1;
    grid-template-columns: calc(100% - 30px) 30px;
  }

  .header .graph-settings {

    grid-row: 1;
  }

  .ZoomSettings {
    padding-left: 25px;
  }

  .ZoomSettings .zoom-btn {
    margin-right: 5px;
  }
}

@media only screen and (max-width: 1000px) {
  .header .btns {
    grid-template-columns: calc(50% - 15px) calc(50% - 15px) 30px;
  }
}

@media only screen and (max-width: 600px) {
  #graph {
    padding: 0px;
  }

  .header {
    padding-top: 0px;
  }

  .header .graph-settings {
    padding-top: 0;
  }
}
</style>