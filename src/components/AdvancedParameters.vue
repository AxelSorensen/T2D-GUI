<template>
    <form id="novalidatedform" onsubmit="submitForm(event)" novalidate />
    <ParameterHeader text="Model rates:"/>
    <div class="rates">
        <div class="table-header">
            <p>Parameter</p><p>Value</p><p>Unit</p>
        </div>
        <div class="table">
            <p>rBGU</p><input type="number" @change="updateBasal" name="rBGU" :value="Basal.rBGU" required form="novalidatedform"/><p>min⁻¹</p>
            <p>rRBCU</p><input type="number" @change="updateBasal" name="rRBCU" :value="Basal.rRBCU" required form="novalidatedform"/><p>min⁻¹</p>
            <p>rGGU</p><input type="number" @change="updateBasal" name="rGGU" :value="Basal.rGGU" required form="novalidatedform"/><p>min⁻¹</p>
            <p>rPGU</p><input type="number" @change="updateBasal" name="rPGU" :value="Basal.rPGU" required form="novalidatedform"/><p>min⁻¹</p>
            <p>rHGU</p><input type="number" @change="updateBasal" name="rHGU" :value="Basal.rHGU" required form="novalidatedform"/><p>min⁻¹</p>
        </div>
    </div>

    <ParameterHeader text="Model parameters:"/>
    <div style="margin-top: 10px;">
    <label for="selector">Submodel:</label>
    <select name="selector" @change="changeShow">
        <option :key="index" v-for="(val, index) in Submodels">
            {{val}}
        </option>
    </select>
  </div>
    <div class="table-header">
        <p>Parameter</p><p>Value</p><p>Unit</p>
    </div>

    <div :class="val" :key="index" v-for="(val, index) in Submodels" v-show="display[val]">
        <div class="row" :key="parIndex" v-for="(parVal, parIndex) in getParametersInSubmodel(val)">
            <p>{{parVal.name}}</p><input type="number" @change="updateParam" :name="parIndex" :value="Params[parIndex]" required form="novalidatedform"/><p>{{parVal.Unit}}</p>
        </div>
    </div>

    
</template>

<script>
 /**
   * The component used to display the advanced parameters.
   * Loops through every submodel and the parameters related, and displays them.
   * @displayName Advanced Parameters
   */
import ParameterHeader from './ParameterHeader.vue';
export default {
    name: "Advanced",
    components: {
    ParameterHeader
},
    props: {
        /**
         * The array of submodels from AdvancedParametersList.js
         */
        Submodels: Array,
        /**
         * The parameters object from AdvancedParametersList.js
         */
        Parameters: Object,
        /**
         * The params object from Sim.js
         */
        Params: Object,
        /**
         * The Basal object from Sim.js
         */
        Basal: Object
    },
    data(){
        return {
            display: {
                Glucose: true,
                Insulin: false,
                Glucagon: false,
                GlucoseAbsorption: false,
                GlucoseMetabolicRates: false,
                Pancreas: false,
                GLP: false,
                Metformin: false,                
                LAII: false,
                FAII: false,
                Lispro: false,
                PA: false,
            }
        }
    },
    emits: ['updateParam', 'updateBasal'],
    methods: {
        /**
         * Callback for when a new submodel is selected from the dropdown menu.
         * @param {*} event The event parameters
         */
        changeShow(event){
            // Sets all display false
            Object.keys(this.display).forEach(item => {
                this.display[item] = false;
            });
            // Sets the selected submodel true
            this.display[event.srcElement.value] = true
        },
        updateParam(event){
            /**
             * Callback for a value change in one of the Param.
             * Emits changes to parent
             * @param {String} param Name of the parameter
             * @param {Number} value The updated value of the parameter
             */
            var val = event.srcElement.value;
            if(val <= 0){
                val = 0;
                event.srcElement.value = 0;
            }
            this.$emit("updateParam", {param:event.srcElement.name, value:val})
        },
        updateBasal(event){
            /**
             * Callback for a value change in one of the Basal.
             * Emits changes to parent
             * @param {String} param Name of the parameter
             * @param {Number} value The updated value of the parameter
             */
            var val = event.srcElement.value;
            if(val <= 0){
                val = 0;
                event.srcElement.value = 0;
            }
            this.$emit("updateBasal", {param:event.srcElement.name, value:event.srcElement.value})
        },
        getParametersInSubmodel(submodel){
            // Generates new object, and fetches the keys
            let Par = new Object;
            let keys = Object.keys(this.Parameters);
            // Cycles through all states
            for(let i = 0; i < keys.length; i++){
                // Check if submodel is equal to the input
                if (this.Parameters[keys[i]].submodel == submodel) {
                    // Adds the parameter to the return object
                    Par[keys[i]] = this.Parameters[keys[i]]
                }
            }
            return Par
        },
        // Used to make sure the form dosn't submit and stops it from refreshing the page
        submitForm(event){
            event.preventDefault();
        }
    },
    computed: {
        
    },
}
</script>

<style scoped>
.table , .table-header{
    display: grid;
    grid-template-columns: 33% 33% 34%;
    padding-top: 10px;
}

input {
  margin-bottom: 10px;
}
.row {
    display: grid;
    grid-template-columns: 33% 33% 34%;
}
p{
    font-size: .8em;
    margin: 0;
    padding-bottom: 5px;
}

label {
  font-size: .8em;

}
</style>