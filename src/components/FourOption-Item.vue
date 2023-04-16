<template>
    <CustomTime
        @updateTime="updateTime"
        name="startTime"
        :Time='param.startTime'
        :repeat="repeat"/>
    <CustomTime
        @updateTime="updateTime"
        name="endTime"
        :Time='param.endTime'
        :repeat="repeat"/>
    <input @change="updateValue" type="number" name='number' placeholder="0" @focus="$event.target.select()" :value='param.value'>
    <IconButton @click="$emit('delete-param', param.id)" icon="xmark" color="hsl(0, 100%, 50%)"/>
</template>

<script>
import CustomTime from './CustomTime.vue'
import IconButton from './IconButton.vue'
 /**
   * The component used to display parameter items with two time instance.
   */
export default {
    name: "Parameter Item (Duration)",
    components:{
        CustomTime,
        IconButton
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
            // Checks of value is below 0
            if(value.srcElement.value < 0){
                value.srcElement.value = 0;
            }
            // Checks if type is stress and then maximum value
            else if(this.paramType == "Stress" && value.srcElement.value > 100){
                value.srcElement.value = 100;
            }
            this.$emit('updateValue', {id:this.param.id, valueType:value.srcElement.name, value:value.srcElement.value,})
        },
        updateTime(par){
            // Checks if the start time is above the end time, if it is sets end time=start time (+ 30 because that is the default end time)
            par.name === "startTime" ? par.val > this.param.endTime ? this.$emit('updateValue', {id:this.param.id, valueType:'endTime', value:par.val+30}) : null : 
            // Checks if the end time is below the start time, if it is sets start time=endt time
            par.name === "endTime" ? par.val < this.param.startTime ? this.$emit('updateValue', {id:this.param.id, valueType:'startTime', value:par.val}) : null : null
            
            this.$emit('updateValue', {id:this.param.id, valueType:par.name, value:par.val})
        }
    },
}
</script>

<style scoped>

</style>