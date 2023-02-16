<template>
    <ParameterHeader text="Physiological" />
    <div class="phy-content">
        <div class="row tooltip">
            <p>Insulin Sensitivity</p>
            <input type="range" ref="ins_sens" class="slider" list="tickmarks" @input="updateValue" name="sens" :value="ins_sens" min="0.01" max="40" step="0.01"/>
            <datalist id="tickmarks">
                <option value="0.01"></option>
                <option value="40"></option>
            </datalist>
            <input @change="updateValue" name="sens" type="number" min="0.01" max="4" step="0.01" :value="ins_sens"/>
            <span class="tooltiptext">Scale insulin sensitivity by multiplying SPGU* (slider value) on tanh in numerator in (A.5a)</span>
        </div>
        <div class="row tooltip">
            <p>Insulin Secretion rate</p>
            <input type="range" ref="ins_secr" class="slider" list="tickmarks2" @input="updateValue" name="secr" :value="ins_secr" min="-100" max="100" step="0.5"/>
            <datalist id="tickmarks2">
                <option value="-100"></option>
                <option value="-50"></option>
                <option value="0"></option>
                <option value="50"></option>
                <option value="100"></option>
            </datalist>
            <input @change="updateValue" name="secr" type="number" min="-100" max="100" step="0.5" :value="ins_secr"/>
            <span class="tooltiptext">Change insulin secretion S in (A.13e) by slider value in percent  WARNING: changing this slider will change initial conditions GBPC0</span>
        </div>
        <div class="row tooltip">
            <p>Glucose production rate</p>
            <input type="range" ref="glu_prod" class="slider" list="tickmarks3" @input="updateValue" name="prod" :value="glu_prod" min="-80" max="80" step="0.5"/>
            <datalist id="tickmarks3">
                <option value="-80"></option>
                <option value="-40"></option>
                <option value="-10"></option>
                <option value="10"></option>
                <option value="40"></option>
                <option value="80"></option>
            </datalist>
            <input @change="updateValue" name="prod" type="number" min="-80" max="80" step="0.5" :value="glu_prod"/>
            <span class="tooltiptext" style="width: 200px; right: -200px;">
                Increase (decrease if alpha is negative) the effect of glucose on the hepatic production and uptake in (A.5e,j) : 
                <span>alpha = Slider value / 100;</span>
                <span>c3 = default_c3*(1+alpha)</span>
                <span>c5 = default_c5*(1+alpha)</span>
            </span>
        </div>
        <!-- <div class="row tooltip">
            <p>Glucose uptake rate</p>
            <input type="range" ref="glu_upta" class="slider" list="tickmarks3" @input="updateValue" name="upta" :value="glu_upta" min="-80" max="80" step="0.5"/>
            <input @change="updateValue" name="upta" type="number" min="-80" max="80" step="0.5" :value="glu_upta"/>
            <span class="tooltiptext" style="width: 200px; right: -200px;">
                Increase (decrease if alpha is negative) insulin-independent glucose uptake rates in (A.4):
                <span>alpha = Slider value</span>
                <span>rBGU = default_rBGU*(1+alpha)</span>
                <span>rGGU = default_rGGU*(1+alpha)</span>
                <span>rHGU = default_rHGU*(1+alpha)</span>
                <span>rPGU = default_rPGU*(1+alpha)</span>
                <span>rRBCU = default_rRBCU*(1+alpha)</span>
            </span>
        </div> -->
    </div>
</template>

<script>
import ParameterHeader from './ParameterHeader.vue'
/**
 * The component displaying the physiological aspects of the patient.
 * @displayName Parameter: Physiological
 */
export default {
    name: "Physiological",
    props: {
        /**
         * The insulin sensitivity for the patient
         */
        ins_sens: {
            type: Number,
            default: 0,
        },
        /**
         * The insulin secretion for the patient
         */
        ins_secr: {
            type: Number,
            default: 0,
        },
        /**
         * The glucose production rate for the patient
         */
        glu_prod: {
            type: Number,
            default: 0,
        },
        /**
         * The glucose uptake rate for the patient
         */
        glu_upta: {
            type: Number,
            default: 0,
        },
    },
    emits: ["updateValueSlider"],
    watch: {
        // All the watches are used to observe the values, so the progress slider (blue) can be updated
        ins_sens: function (newVal, oldVal) {
            this.updateSliderPrograssRef("ins_sens", newVal);
        },
        ins_secr: function (newVal, oldVal) {
            this.updateSliderPrograssRef("ins_secr", newVal);
        },
        glu_prod: function (newVal, oldVal) {
            this.updateSliderPrograssRef("glu_prod", newVal);
        },
        glu_upta: function (newVal, oldVal) {
            this.updateSliderPrograssRef("glu_upta", newVal);
        },
    },
    methods: {
        updateValue(event) {
            // gets the name and value of the slider
            var name = event.srcElement.name;
            var value = event.srcElement.value;
            // Checks if the value is within the boundry, else adjust it
            if (name == "sens") {
                if (value < 0.01) {
                    value = 0.01;
                }
                else if (value > 40) {
                    value = 40;
                }
            }
            else if (name == "secr") {
                if (value < -100) {
                    value = -100;
                }
                else if (value > 100) {
                    value = 100;
                }
            }
            else if (name == "prod" || name == "upta") {
                if (value < -80) {
                    value = -80;
                }
                else if (value > 80) {
                    value = 80;
                }
            }
            // In case the value was changed, set the inputfields value = value
            event.srcElement.value = value;
            /**
             * Emits the change in a slider or input field to parent
             * @param {String} type Name of the parameter changed
             * @param {Number} val New value of the parameter
             */
            this.$emit("updateValueSlider", { type: event.srcElement.name, val: value });
        },
        /**
         * Updates the progress of the sliders
         * @param {String} ref Name of the vue ref
         * @param {Number} value Value of the progress bar
         */
        updateSliderPrograssRef(ref, value) {
            let element = this.$refs[ref];
            let min = element.min;
            let max = element.max;
            let progress = (value - min) / (max - min) * 100;
            element.style.setProperty("--track-progress", progress + "%");
        }
    },
    mounted() {
        let sliders = document.querySelectorAll(".slider");
        sliders.forEach(slider => {
            let progress = (slider.value - slider.min) / (slider.max - slider.min) * 100;
            slider.style.setProperty("--track-progress", progress + "%");
        });
    },
    components: { ParameterHeader }
}
</script>

<style>
.phy-content{
    padding: 10px 5% 0 5%;
}
.row{
    margin-bottom: 5%;
    display: grid;
    grid-template-columns: 40% 45% 15%;
}
p{
    margin: 0;
}
/* Slider stuff */
input[type=range]{
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    border: none;
    cursor: pointer;
    --track-progress: 50%;
}
                        /***** Track Styles *****/
/***** Chrome, Safari, Opera, and Edge Chromium *****/
input[type="range"]::-webkit-slider-runnable-track {
    /* background: var(--scrollbar-background); */
    background: linear-gradient(to right,#22234e 0 var(--track-progress), #efefef var(--track-progress) 100%);
    border-radius: 5px;
    height: 8px;
}
/* 0075ff */
/******** Firefox ********/
input[type="range"]::-moz-range-track {
    background: #efefef;
    border-radius: 5px;
    height: 8px;
}
                        /***** Thumb Styles *****/
/***** Chrome, Safari, Opera, and Edge Chromium *****/
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border: none; 
    border-radius: 50%;
    background-color: #22234e;
    height: 16px;
    width: 16px;
    margin-top: -4px;    
}
/***** Firefox *****/
input[type="range"]::-moz-range-thumb {
    border: none; 
    border-radius: 50%;
    background-color: #0075ff;
    height: 16px;
    width: 16px;
}
                        /***** Focus Styles *****/
/* Removes default focus */
input[type="range"]:focus {
  outline: none;
}

/***** Chrome, Safari, Opera, and Edge Chromium *****/
input[type="range"]:focus::-webkit-slider-thumb {
  background-color: #004799;
}

/******** Firefox ********/
input[type="range"]:focus::-moz-range-thumb {
  background-color: #004799;
}

input[type="range"]::-moz-range-progress{
    background-color: #0075ff;
    height: 8px;
    border-radius: 5px;
}
</style>