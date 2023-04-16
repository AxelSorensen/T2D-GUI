<template>
  <!-- 
        States dropdown
        -->
  <div v-if="showStates" class="click_away" @click="showStates = false"></div>
  <div class="states">
    <TextIconButton @click="showStates = !showStates" id="plotting-options" icon="fa-chart-line">Plotting options
    </TextIconButton>
    <Collapse>
      <div :class="{ 'wrapper': true, 'wrapper-maximized': maximized }" v-if="showStates">
        <div id="top-plotting">
          <div id="tabs">
            <div id="basic_tab" :class="{ selected_tab: !advanced_plotting }" @click="handleTabs(false)">Basic</div>
            <div id="advanced_tab" :class="{ selected_tab: advanced_plotting }" @click="handleTabs(true)">Advanced</div>
          </div>
          <div class="row-header">


            <div id="reset_collapse_buttons">
              <label>Name of state</label>
              <label class="reset" @click="resetPlotting">Reset all</label>
              <label v-if="advanced_plotting" class="reset collapse" @click="collapse">Collapse all</label>
            </div>
            <label>Y-Axis</label>

            <!-- 
            Basic plotting settings
            -->
          </div>
          <div v-if="!advanced_plotting" class="basic-plotting">
            <div id="axis"><label>1.</label>
              <label>2.</label>
            </div>
            <div class="row-state tooltip">
              <label>Blood Glucose (GH)</label>
              <input @change="stateDisplayChange" type="checkbox" name="GH" id="l" :checked="getDisplay('GH', 'l')" />
              <input @change="stateDisplayChange" type="checkbox" name="GH" id="r" :checked="getDisplay('GH', 'r')" />
              <span class="tooltiptext">{{ getTooltip('GH') }}</span>
            </div>
            <div class="row-state tooltip">
              <label>Blood Insulin (IH)</label>
              <input @change="stateDisplayChange" type="checkbox" name="IH" id="l" :checked="getDisplay('IH', 'l')" />
              <input @change="stateDisplayChange" type="checkbox" name="IH" id="r" :checked="getDisplay('IH', 'r')" />
              <span class="tooltiptext">{{ getTooltip('IH') }}</span>
            </div>
            <div class="row-state tooltip">
              <label>Fast Acting Insulin (Ifa*)</label>
              <input @change="stateDisplayChange" type="checkbox" name="Ifa" id="l" :checked="getDisplay('Ifa', 'l')" />
              <input @change="stateDisplayChange" type="checkbox" name="Ifa" id="r" :checked="getDisplay('Ifa', 'r')" />
              <span class="tooltiptext">{{ getTooltip('Ifa') }}</span>
            </div>
            <div class="row-state tooltip">
              <label>Long Acting Insulin (Ila*)</label>
              <input @change="stateDisplayChange" type="checkbox" name="Ila" id="l" :checked="getDisplay('Ila', 'l')" />
              <input @change="stateDisplayChange" type="checkbox" name="Ila" id="r" :checked="getDisplay('Ila', 'r')" />
              <span class="tooltiptext">{{ getTooltip('Ila') }}</span>
            </div>
          </div>
          <!-- 
        Advanced plotting settings
        -->
          <div v-else id="advanced-plotting">
            <div class="submodel" :key="val" v-for="(val, supindex) in subModel">
              <div class="submodelHeader tooltip" @click="showSubmodel(supindex)">
                <span>{{ val }}</span>
                <i :class='{ "rotate": show[supindex] }'><font-awesome-icon class="icon" icon="chevron-down" /></i>
                <span v-if="getTooltipSubModel(val)" class="tooltiptext">{{ getTooltipSubModel(val) }}</span>
              </div>
              <Collapse>
                <div v-if="show[supindex]">
                  <div class="row-state tooltip" :key="index" v-for="(val, index) in getStatesInSubModel(val)">
                    <label>{{ val.name }}</label>
                    <input @change="stateDisplayChange" type="checkbox" :name="index" id="l" :checked='val.l' />
                    <input @change="stateDisplayChange" type="checkbox" :name="index" id="r" :checked='val.r' />
                    <span class="tooltiptext">{{getTooltip(index)}}</span>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </Collapse>
  </div>


  <!-- 
      Buttons for important information and toggle to inputs when on smaller screens
      And a wrapper for the advanced sim settings
   -->
  <!-- <div class="btns">
      <TextIconButton @click="$emit('toggleVisible')" class="toggleVisible" icon="fa-chart-line">Show Parameters </TextIconButton> -->
</template>

<script>
import Collapse from './Transitions/Collapse.vue'
import IconToggleButton from './IconToggleButton.vue'
import TextIconButton from './TextIconButton.vue'
/**
* The component used as a container for the chart and the other things related to displaying the graphs.
*/
export default {
  name: "Graph Subheader",
  components: {
    Collapse,
    IconToggleButton,
    TextIconButton,
  },
  props: {
    activePatient: String,
    maximized: false,
    display: Object,
    displayStates: Object,
    subModel: Array,
    tooltips: Object,
  },
  data() {
    return {
      showStates: false,
      show: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      showAdvanced: false,
      advanced_plotting: false,
    }
  },
  emits: ["toMaximize", "stateDisplayChange", 'stateReset'],
  methods: {
    collapse() {
      for (let i = 0; i < this.show.length; i++) {
        this.show[i] = false;
      }
      let div = document.getElementById('advanced-plotting');
      div.scroll({top: 0, behavior: "smooth"})

    },
  // Resets the states in plotting options
  resetPlotting() {
    this.$emit("stateReset")
  },
  // Handles which tab is open (basic / advanced) in plotting options
  handleTabs(bool) {
    this.advanced_plotting = bool;
  },
  stateDisplayChange(event) {
    // This code makes sure that the other unchecked radio button sends a stateDisplayChange to remove from the axis again
    const clickedCheckbox = event.target;
    const boxes = Array.from(document.getElementsByName(clickedCheckbox.name));

    const otherCheckbox = boxes.filter(box => box !== clickedCheckbox)[0];
    otherCheckbox.checked = false;
    this.$emit("stateDisplayChange", { name: event.srcElement.name, axis: event.srcElement.id, bool: event.srcElement.checked })
    this.$emit("stateDisplayChange", { name: otherCheckbox.name, axis: otherCheckbox.id, bool: otherCheckbox.checked })
  },
  /**
   * Returns the states in the subModel
   * @param {String} subModel The submodel of the states
   */
  getStatesInSubModel(subModel) {
    // Generates new object, and fetches the keys, of displaystates
    let States = new Object;
    let keys = Object.keys(this.displayStates);
    // Cycles through all states
    for (let i = 0; i < keys.length; i++) {
      // Check if submodel is equal to the input
      if (this.displayStates[keys[i]].sub == subModel) {
        // Adds the state to the return object
        States[keys[i]] = this.displayStates[keys[i]]
      }
    }
    return States
  },
  /**
   * Returns the tooltip for a given state
   * @param {String} state Name of the state
   */
  getTooltip(state) {
    var tooltip = this.tooltips[state]
    if (tooltip !== undefined) {
      return tooltip
    } else {
      return null;
    }
  },
  /**
   * Returns the tooltip for a given submodel
   * @param {String} name Name of the submodel
   */
  getTooltipSubModel(name) {
    // Splits the string
    var split = name.split(" ");
    // If the first word is absorption, look at the second one.
    if (split[1] == 'absorption') {
      split[0] = split[0] + split[1]
    }
    var tooltip = this.tooltips[split[0]]
    if (tooltip !== undefined) {
      return tooltip
    } else {
      return ""
    }
  },
  /**
   * Changes the display boolean of a given submodel
   * @param {String} index Name of the submodel
   */
  showSubmodel(index) {
    this.show[index] = !this.show[index]
  },
  /**
   * Returns if a given state should be displayed on a given axis
   * @param {String} state Name of the state
   * @param {String} axis Name of the axis (l or r)
   */
  getDisplay(state, axis) {
    return this.displayStates[state][axis]
  },
}
}
</script>

<style scoped>
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

#axis {
  display: flex;
  justify-content: right;

  padding-right: 18px;
  gap: 20px;
  font-size: .8em;
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

#top-plotting {
  z-index: inherit;
  margin-bottom: 10px;

}

#tabs {
  z-index: 10;
  grid-row: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 8px;

}

#tabs div {
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
}


.ZoomSettings .zoom-btn {
  margin-right: 5px;
}

.header label {
  margin-left: 20px;
  margin-right: 5px;
}

.header input {
  width: 35px;
  z-index: 2;
}

.header .advancedSimPar {
  position: relative;
  width: auto;
  z-index: 4;
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
  top: 70px;
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
  border-radius: 5px;
  position: absolute;
  top: 60px;
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
  right: 18px;
  width: 270px;

  background: white;
  border: 1px black solid;
  margin-right: -1px;
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

#advanced-header {
  border-top: 1px solid black;
  background-color: #eeeeee;
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

#reset_collapse_buttons {
  white-space: nowrap;
  display: flex;
  gap: 16px;


}

.reset.reset {
  height: .6em;
  display: flex;

  font-size: .8em;

  align-items: center;
  justify-content: center;
  color: #0075FF;
  background-color: #EFEFEF;
  padding: 6px;

  left: 6px;
  border-radius: 5px;
  cursor: pointer
}

.reset:hover {
  background-color: #e6e6e6;
}

.click_away {
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  z-index: 20;
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

#advanced-plotting {
  height: 20vh;
  overflow: scroll;


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

.subheader {
  position: relative;
  display: grid;
  grid-template-columns: 30% 40% calc(30% - 27px) 27px;
}

.tooltip {
  position: relative !important;
}

.tooltiptext {
  left: 250px;
}

.PatientWatermark {
  position: relative;
  font-size: 25px;
  text-align: center;
  color: rgba(34, 35, 78, .8);
}

.maximize {
  grid-column: 4;
  position: relative;
}


.states {
  position: relative;

  border-top: none;
  left: 0;
}

.states .header {
  position: relative;
  display: grid;
  grid-template-columns: calc(100% - 30px) 30px;
  padding: 5px;
}

.states .header p {
  margin: 0;
  font-size: 20px;
  line-height: 20px;
}

.states .header i {
  display: inline-block;
  font-size: 20px;
  line-height: 20px;
  transition: all .8s ease;
  transform: rotate(0deg);
}

.wrapper-maximized {
  top: -250px !important;
}

.states .wrapper {
  top: 50px;
  position: absolute;
  width: 500px;
  background: white;
  z-index: 25;
  right: 0px;
  border: 1px solid black;
  border-radius: 10px;
  margin: 0 -1px;
}

.states .wrapper .row-header {
  display: flex;
  margin-bottom: 0px;
  text-align: left;
  justify-content: space-between;
  padding: 2px 5px;
  padding-right: 10px;
  border: 1px 0px solid black;
  margin-right: 10px;

}

.states .wrapper .row-state {
  display: grid;
  grid-template-columns: calc(100% - 60px) 30px 30px;
  padding: 2px 5px;
}

.states .wrapper .row-state label {
  line-height: 21px;
}

.states .wrapper .row-state input {
  width: 15px;
  height: 15px;
}

.submodelHeader {
  padding: 5px;
  border-top: 1px solid black;
  cursor: pointer;
  text-align: left;
}

.submodelHeader span {
  font-weight: bold;
}

.submodelHeader i {
  position: relative;
  font-size: 15px;
  display: inline-block;
  margin-left: 15px;
  transition: all .8s ease;
  transform: rotate(0deg);
}

.submodelHeader .rotate {
  transform: rotate(180deg);
}

.header .rotate {
  transform: rotate(180deg) !important;
}

@media only screen and (max-width: 700px) {
  .subheader {
    grid-template-columns: 50% 50%;
  }
}

@media only screen and (max-width: 500px) {
  .subheader {
    grid-template-columns: 100%;
    grid-template-rows: auto 50%;
  }

  .subheader .states .wrapper {
    border: none;
    border-bottom: 1px solid black;
    margin: 0;

  }
}
</style>