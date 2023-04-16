<template>
    <div class="container" @focusin="focus" @focusout="unfocus" >
        <input @focus="$event.target.select()" type="number" @change="updateValue" name='number' placeholder="0" :value='param.value' />
        <teleport to="body">
        <div class="datalist" :style="cssProps" v-if="toShow" v-show="visible">
            <option :key="value" v-for="value in predefinedDose" @click="doseSelected">
                {{value}}
             </option>
        </div>
        </teleport>
  </div>
</template>
<!-- The datalist is teleported to body to force it ontop of the other elements -->
<script>
export default {
    name: "CustomInput",
    props: {
        /**
         * The parameter object.
         */
        param: Object,
        /**
         * Array of predefined dose sizes
         */
        predefinedDose: Array,
    },
    data() {
        return {
            value: '0', // Delete
            visible: false,
            width: '0',
            left: '0',
            top: '0',
        };
    },
    emits: ['updateValue'],
    methods: {
        /**
         * Tracks the click on option
         * @param {Object} el the DOM element
         */
        doseSelected(el){
            // Get the value for the option from the innerHTML
            var val = el.srcElement.innerHTML;
            this.value = val;   // Delete
            // Calls emit update function
            this.emitUpdate(val);
        },
        /**
         * Tracks changes in the input fueld
         * @param {Object} el the DOM element
         */
        updateValue(el){
            // Get the value from the inputs value attribute
            var val = el.srcElement.value;
            // Checks if the value is below 0 and adjust
            if(val < 0){
                value.srcElement.value = 0;
            }
            // Calls emit update function
            this.emitUpdate(val);
        },
        /**
         * Emits changes to the parent
         * @param {String} value new value
         */
        emitUpdate(value){
            this.$emit('updateValue', {id:this.param.id, valueType:'number', value:value})
        },
        /**
         * Handles the calculation for placement of the datalist when the object is focused
         * @param {Object} el the DOM element
         */
        focus(el){
            // Gets the rect
            var rect = el.srcElement.getBoundingClientRect();
            // Calculates left, top and width
            this.left = rect.left;
            // We want to display the datalist below the input, 
            // so we calculate the top from the inputs top, the inputs height, and the scrollheight of the page.
            this.top = rect.top + rect.height + window.top.scrollY; 
            this.width = rect.width;
            // Sets the visibility of the object
            this.visible = true;
        },
        /**
         * Handles the unfocus of the element
         * @param {Object} el the DOM element
         */
        unfocus(el){
            // We use timeout so the browser has time to register if a click has been made on a option
            setTimeout(() => this.visible = false, 200);
            
        }
    },
    computed: {
        /**
         * Used to check if we need to display the datalist
         * Checks if the length is above 0, meaning there is a predefined dose
         */
        toShow(){
            if(this.predefinedDose.length > 0){
                return true;
            }else{
                return false;
            }
        },
        // Calculates and defines the variables for css.
        cssProps() {
            return {
                '--width': this.width + 'px',
                '--left': this.left + 'px',
                '--top': this.top + 'px',
                
            }
        }
    }
};
</script>

<style scoped>
.container{
    position: relative;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid black;
}
.container input{
    position: relative;
    border: none;
    padding: 0px 5px;
    height: 100%;
    width: calc(100% - 10px);
}
/* Chrome, Safari, Edge, Opera */
.container input::-webkit-outer-spin-button,
.container input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
/* Firefox */
.customTime input[type=number] {
    -moz-appearance: textfield;
}
.datalist{
    position: absolute;
    left: var(--left);
    top: var(--top);
    width: var(--width);    
    background: whitesmoke;
    z-index: 10;
    outline: 3px solid black;
    outline-offset: -2px;
    transition: .15s;
    
}
.datalist option{
    display: block;
    /* We subtract 4px to compensate for the offset of the outline */
    /* We subtract 4px to compensate for the padding */
    width: calc(100% - 4px -5px);
    z-index: 1;
    cursor: pointer;
    padding: 5px;
    font-size: .8em;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.datalist option:hover{
    background: blue;
    color: white;
}
</style>