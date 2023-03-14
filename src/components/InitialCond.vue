<template>
    <ParameterHeader class="header" text="Initial Conditions" />
    <div class="cond">
        <p>State</p>
        <p>Value</p>
        <p>Unit</p>

        <p>GBPC0</p>
        <input @change="updateInitCond" min="0" name="GBPC" type="number" :value="initCond.GBPC0"/>
        <p>mmol/L</p>

        <p>IBPF0</p>
        <input @change="updateInitCond" min="0" name="IBPF" type="number" :value="initCond.IBPF0"/>
        <p>mU/L</p> 
    </div>
</template>

<script>
import ParameterHeader from './ParameterHeader.vue'
/**
 * Component for display and updating inital conditions of the patient.
 */
export default {
    name: 'Initial Conditions',
    components: {ParameterHeader},
    props: {
        /**
         * The initial conditions of the patient, from the simPar object
         */
        initCond: Object,
    },
    emits: ["updateInitCond"],
    methods:{
        updateInitCond(event){
            // Checks if the values are valid(equal to or above 0)
            let value = 0;
            if(event.srcElement.value < 0){
                event.srcElement.value = 0;
            }else{
                value = event.srcElement.value;
            }
            /**
             * Emits the change in a input field to parent
             * @param {String} name Name of the parameter changed
             * @param {Number} val New value of the parameter
             */
            this.$emit("updateInitCond", {name:event.srcElement.name, val:value})
        }
    }
}
</script>

<style scoped>
.cond{
    display: grid;
    grid-template-columns: 33% 33% 34%;
    padding: 10px 0;
}
.cond p{
    margin: 0;
    padding-bottom: 5px;
    font-size: .8em;
}

.header{
  border-top: none!important;
}

input {
  margin-bottom: 10px;
}
</style>
