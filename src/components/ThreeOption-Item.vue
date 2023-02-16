<template>
    <CustomTime
        @updateTime="updateTime"
        name="time"
        :Time='param.time'
        :repeat="repeat"/>
    <!-- <input @change="updateValue" type="number" name='number' placeholder="0" :value='param.value' :list="paramType"> -->
    <CustomInput v-if="param.type == 'Daily GLP-1'"
        @updateValue="emitValue"
        :id="paramType" 
        :predefinedDose="predefinedDose[0]['Daily GLP-1']"
        :param="param" />
    <CustomInput v-else-if="param.type == 'Weekly GLP-1'"
        @updateValue="emitValue"
        :id="paramType" 
        :predefinedDose="predefinedDose[0]['Weekly GLP-1']"
        :param="param" />
    <CustomInput v-else 
        @updateValue="emitValue"
        :id="paramType" 
        :predefinedDose="predefinedDose"
        :param="param" />
    <label v-if="param.type == 'Daily GLP-1'">[μg]</label>
    <label v-else-if="param.type == 'Weekly GLP-1'">[mg]</label>
    <!-- Meals dropdown -->
    <select @change="updateValue" id="Type" v-if="Types" v-model="param.type">
        <option :key="item" v-for="item in Types">
            {{item}}
        </option>
    </select>
    <IconButton @click="$emit('delete-param', param.id)" icon="xmark" color="hsl(0, 100%, 50%)"/>
</template>

<script>
import CustomTime from './CustomTime.vue'
import IconButton from './IconButton.vue'
import CustomInput from './CustomInput.vue';
 /**
   * The component used to display parameter items with one time instance.
   * @displayName Parameter item
   */
export default {
    name: "OptionItem",
    components:{
    CustomTime,
    IconButton,
    CustomInput
},
    props: {
        /**
         * The parameter object.
         */
        param: Object,
        /**
         * If the event is repeated. Used to determin if days should be displayed.
         * @values none, daily, weekly
         */
        repeat: {
            type: String,
            default: 'none'
        },
        /**
         * Name of the parameter
         */
        paramType: String,
        /**
         * An array of different parameter types.
         * Used by meals and GLP-1
         */
        Types: Array,
        /**
         * Array of predefined dose sizes
         */
        predefinedDose: Array,
    },
    emits: ['delete-param', 'updateValue'],
    methods: {
        updateValue(value){
            /**
             * Emits the update of a inputfield
             * @param {String} id Id of the parameter
             * @param {String} valueType What type of value was changed
             * @param {String} value The new value
             */
            if(value.srcElement.value < 0){
                value.srcElement.value = 0;
            }
            // Gets the type, and checks if it's a select field
            var type = value.srcElement.type;
            type == 'select-one' ? type = 'type' : null
            this.$emit('updateValue', {id:this.param.id, valueType:type, value:value.srcElement.value,})
        },
        emitValue(par){
            /**
             * Emits the updateValue from child component
             * @param par The parameters from the child component
             */
            this.$emit('updateValue', par)
        },
        updateTime(par){
            /**
             * Emits the update time event
             * @param {String} id Id of the parameter
             * @param {String} valueType What type of value was changed
             * @param {String} value The new value
             */
            this.$emit('updateValue', {id:this.param.id, valueType:"time", value:par.val})
        }
    },
}
</script>

<style scoped>
label{
    border: none;
    border-bottom: 1px solid black;
    background: whitesmoke;
}
</style>