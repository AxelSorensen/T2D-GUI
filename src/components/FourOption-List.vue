<template>
    <div class="option">
        <p v-if="repeat=='daily'">Start time <br>[hh:mm]</p>
        <p v-else>Start time <br>[dd:hh:mm]</p>
        <p v-if="repeat=='daily'">End time <br>[hh:mm]</p>
        <p v-else>End time <br>[dd:hh:mm]</p>
        <!-- If the option is Heart Beat increase, add class for tooltip explaining it -->
        <p :class="{'tooltip': option == 'Heart Beat Increase [BPM]'}">{{getUnitName}}<br>{{getUnit}}
            <span v-if="option == 'Heart Beat Increase [BPM]'" class="tooltiptext" style="right: 24px; top: 100px">
            Heart Beat increase is the change in heart beat rate from resting heart beat defined as parameter HRb.<span>By default resting heart rate is 80 BPM</span> </span>
        </p>
        <IconButton @click="$emit('add-param')" color="hsl(120, 100%, 30%)" :fontSize=20 />
    </div>
    <div class="option" :key="par.id" v-for="par in sortedParam">
        <FourOptionItem
            @delete-param="$emit('delete-param', par.id)"
            @updateValue="updateValue"
            :param="par"
            :paramType="paramType"
            :repeat="repeat"/>
    </div>
</template>

<script>
import FourOptionItem from './FourOption-Item.vue'
import IconButton from './IconButton.vue';
/**
     * The component used to display parameters with two time instance. 
     * Also includes the function for adding new inputs to the parameter.
     * @displayName Parameter list(Duration)
     */
export default {
    name: "OptionList",
    props: {
        /**
         * The parameter array.
         */
        param: Array,
        /**
         * Name of the parameters value
         */
        option: String,
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
    emits: ['add-param', 'delete-param', 'updateValue'],
    methods:{
        updateValue(par){
            /**
             * Emits the updateValue from child component
             * @param par The parameters from the child component
             */
            this.$emit('updateValue', par)
        }
    },
    data() {
        return {};
    },
    computed:{
      sortedParam() {
          return this.param.sort((a,b)=>a.time - b.time)
        },
        getUnitName(){
            var UnitName = "";
            var placeholder = this.option.split('[');
            UnitName = placeholder[0];
            return UnitName;
        },
        getUnit(){
            var UnitName = "";
            var placeholder = this.option.split(' ');
            UnitName = placeholder[placeholder.length - 1];
            return UnitName;
        }
    },
    components: { FourOptionItem, IconButton }
}
</script>

<style scoped>
.option {
    display: grid;
    margin-bottom: 6px;
    grid-template-columns: 81px 81px calc(100% - 191px) 30px;
}
p{
    text-align: left;
    margin: 0;
    font-size: .8em;
}
</style>