<template>
    <div class="subheader">
    <!-- 
        States dropdown
        -->
        <div class="states">
            <div class="header" @click="showStates = !showStates">
                <p>States</p>
                <i :class='{ "rotate": showStates }'><font-awesome-icon class="icon" icon="chevron-down"/></i>
            </div>
            <Collapse>
                <div class="wrapper" v-if="showStates">
                    <div class="row-header">
                        <label>Name of state</label>
                        <span>Axis</span>
                    </div>
                    <div class="row-state tooltip">
                        <label>Blood Glucose (GH)</label>
                        <input @change="stateDisplayChange" type="checkbox" name="GH" id="l" :checked="getDisplay('GH', 'l')" />
                        <input @change="stateDisplayChange" type="checkbox" name="GH" id="r" :checked="getDisplay('GH', 'r')" />
                        <span class="tooltiptext">{{getTooltip('GH')}}</span>
                    </div>
                    <div class="row-state tooltip">
                        <label>Blood Insulin (IH)</label>
                        <input @change="stateDisplayChange" type="checkbox" name="IH" id="l" :checked="getDisplay('IH', 'l')" />
                        <input @change="stateDisplayChange" type="checkbox" name="IH" id="r" :checked="getDisplay('IH', 'r')" />
                        <span class="tooltiptext">{{getTooltip('IH')}}</span>
                    </div>
                    <div class="submodel" :key="val" v-for="(val, supindex) in subModel">
                        <div class="submodelHeader tooltip" @click="showSubmodel(supindex)">
                            <span>{{val}}</span>
                            <i :class='{ "rotate": show[supindex] }'><font-awesome-icon class="icon" icon="chevron-down"/></i>
                            <span class="tooltiptext">{{getTooltipSubModel(val)}}</span>
                        </div>
                        <Collapse>
                            <div v-if="show[supindex]" >
                                <div class="row-state tooltip" :key="index" v-for="(val, index) in getStatesInSubModel(val)">
                                    <label>{{val.name}}</label>
                                    <input @change="stateDisplayChange" type="checkbox" :name="index" id="l" :checked='val.l' />
                                    <input @change="stateDisplayChange" type="checkbox" :name="index" id="r" :checked='val.r' />
                                    <span class="tooltiptext">{{getTooltip(index)}}</span>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                </div>
            </Collapse>
        </div>
        <span class="PatientWatermark">{{activePatient}}</span>
        <IconToggleButton  @click="$emit('toMaximize')" class="maximize" :show="!maximized" />
    </div>
</template>

<script>
import Collapse from './Transitions/Collapse.vue'
import IconToggleButton from './IconToggleButton.vue'
/**
* The component used as a container for the chart and the other things related to displaying the graphs.
*/
export default {
    name: "Graph Subheader",
    components:{
       Collapse,
       IconToggleButton,
    },
    props: {
        activePatient: String,
        maximized: false,
        display: Object,
        displayStates: Object,
        subModel: Array,
        tooltips: Object,
    },
    data(){
        return {
            showStates: false,
            show: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        }
    },
    emits: ["toMaximize","stateDisplayChange"],
    methods:{
        stateDisplayChange(event){
            this.$emit("stateDisplayChange", {name:event.srcElement.name, axis:event.srcElement.id, bool:event.srcElement.checked})
        },
        /**
         * Returns the states in the subModel
         * @param {String} subModel The submodel of the states
         */
         getStatesInSubModel(subModel){
            // Generates new object, and fetches the keys, of displaystates
            let States = new Object;
            let keys = Object.keys(this.displayStates);
            // Cycles through all states
            for(let i = 0; i < keys.length; i++){
                // Check if submodel is equal to the input
                if (this.displayStates[keys[i]].sub == subModel) {
                    // Adds the state to the return object
                    States[keys[i]]=this.displayStates[keys[i]]
                }
            }
            return States
        },
        /**
         * Returns the tooltip for a given state
         * @param {String} state Name of the state
         */
        getTooltip(state){
            var tooltip = this.tooltips[state]
            if(tooltip !== undefined){
                return tooltip
            }else{
                return "No tooltip"
            }
        },
        /**
         * Returns the tooltip for a given submodel
         * @param {String} name Name of the submodel
         */
        getTooltipSubModel(name){
            // Splits the string
            var split = name.split(" ");
            // If the first word is absorption, look at the second one.
            if(split[1] == 'absorption'){
                split[0] = split[0]+split[1]
            }
            var tooltip = this.tooltips[split[0]]
            if(tooltip !== undefined){
                return tooltip
            }else{
                return "No tooltip"
            }
        },
        /**
         * Changes the display boolean of a given submodel
         * @param {String} index Name of the submodel
         */
        showSubmodel(index){
            this.show[index] = !this.show[index]
        },
        /**
         * Returns if a given state should be displayed on a given axis
         * @param {String} state Name of the state
         * @param {String} axis Name of the axis (l or r)
         */
        getDisplay(state, axis){            
            return this.displayStates[state][axis]
        },
   }
}
</script>

<style scoped>
.subheader{
    position: relative;
    display: grid;
    grid-template-columns: 30% 40% calc(30% - 27px) 27px;
}
.PatientWatermark{
    position: relative;
    font-size: 25px;
    text-align: center;
    color: rgba(34, 35, 78, .8);
}
.maximize{
    grid-column: 4;
    position: relative;
}
.states {
    position: relative;
    border: 1px solid black;
    border-top: none;
    z-index: 3;
    left: 0;
}
.states .header{
    position: relative;
    display: grid;
    grid-template-columns: calc(100% - 30px) 30px;
    padding: 5px;
}
.states .header p{
    margin: 0;
    font-size: 20px;
    line-height: 20px;
}
.states .header i{
    display: inline-block;
    font-size: 20px;
    line-height: 20px;
    transition: all .8s ease;
    transform: rotate(0deg);
}
.states .wrapper{
    position: absolute;
    width: 100%;
    background: white;
    z-index: 1;
    border: 1px solid black;
    border-top: none;
    margin: 0 -1px;
}
.states .wrapper .row-header{
    display: grid;
    grid-template-columns: calc(100% - 60px) 60px ;
    padding: 2px 5px;
}
.states .wrapper .row-state{
    display: grid;
    grid-template-columns: calc(100% - 60px) 30px 30px;
    padding: 2px 5px;
}
.states .wrapper .row-state label {
    line-height: 21px;
}
.states .wrapper .row-state input{
    width: 15px;
    height: 15px;
}
.submodelHeader{
    padding: 5px;
    border-top: 1px solid black;
    cursor: pointer;
    text-align: left;
}
.submodelHeader span{
    font-weight: bold;
}
.submodelHeader i{
    font-size: 15px;
    display: inline-block;
    margin-left: 15px;
    transition: all .8s ease;
    transform: rotate(0deg);
}
.submodelHeader .rotate{
    transform: rotate(180deg);
}
.header .rotate{
    transform: rotate(180deg)!important;
}
@media only screen and (max-width: 700px) {
    .subheader{
        grid-template-columns: 50% 50%;
    }
}
@media only screen and (max-width: 500px) {
    .subheader{
        grid-template-columns: 100%;
        grid-template-rows: auto 50%;
    }
    .subheader .states .wrapper{
        border: none;
        border-bottom: 1px solid black;
        margin: 0;
    }
}
</style>