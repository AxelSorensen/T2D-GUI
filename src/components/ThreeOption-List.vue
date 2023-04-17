<template>
    <div class="option" :class="{extra: Types}">
        <p v-if="repeat=='daily'">Time <br>[hh:mm]</p>
        <p v-else>Time <br>[dd:hh:mm]</p>
        <p>{{getUnitName}}<br>{{getUnit}}</p>
        <!-- If it has types, add extra column -->
        <p v-if="Types">{{typeName}}</p>
        <IconButton @click="$emit('add-param')" color="hsl(120, 100%, 30%)" :fontSize=20 />
    </div>
    <div class="option" :class="getClass(par.type)" :key="par.id" v-for="par in sortedParam">
        <ThreeOptionItem 
            @delete-param="$emit('delete-param', par.id)"
            @updateValue="updateValue"
            :param="par"
            :repeat="repeat"
            :paramType="paramType"
            :Types="Types"
            :predefinedDose="predefinedDose" />
    </div>
</template>

<script>
import ThreeOptionItem from './ThreeOption-Item.vue'
import IconButton from './IconButton.vue';
    /**
     * The component used to display parameters with one time instance. 
     * Also includes the function for adding new inputs to the parameter.
     * @displayName Parameter list 
     */
export default {
    name: 'OptionList',
    props:{
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
        /**
         * An array of different parameter types.
         * Used by meals and GLP-1
         */
        Types: Array,
        /**
         * Name to display for the types
         */
        typeName: String,
        /**
         * Array of predefined dose sizes
         */
        predefinedDose: Array,
    },
    emits: ['add-param', 'delete-param', 'updateValue'],
    methods:{
        updateValue(par){
            /**
             * Emits the updateValue from child component
             * @param par The parameters from the child component
             */
            this.$emit('updateValue', par)
        },
        getClass(type){
            let className = '';
            if(this.Types){
                type == 'Weekly GLP-1' ? className = 'extra2' :
                type == 'Daily GLP-1' ? className = 'extra2' :
                className = 'extra';
            }
            return className;
        }
    },
    data(){
        return{
            dose: ['100','200']
        }
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
    components: { ThreeOptionItem, IconButton }
}
</script>

<style scoped>
.option {
    display: grid;
    line-height: 30px;
    margin-bottom: 6px;
    grid-template-columns: 81px calc(100% - 111px) 30px;
}
.extra{
    grid-template-columns: 81px calc(50% - 111px/2) calc(50% - 111px/2) 30px;
}
.extra2{
    grid-template-columns: 81px calc(30% - 111px/4) calc(20% - 111px/4) calc(50% - 111px/2) 30px;
}
p{
    text-align: left;
    margin: 0;
    font-size: .8em;
}
</style>

