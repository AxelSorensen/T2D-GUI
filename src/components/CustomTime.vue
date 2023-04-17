<template>
    <div class="customTime">
        <!-- Checks if [dd] should be displayed-->
        <input v-show="toShow" @change="updateTime" @focus="$event.target.select()" name="day" type="number" :value="day" min="1" :max="weeklyRep ? 7 : null" autocomplete="off" /><a v-show="toShow">:</a>
        <input v-focus="name" @change="updateTime" @focus="$event.target.select()" type="text" maxlength="2" name="hour" :value="hour" min="0" max="23" autocomplete="off" /><a>:</a>
        <input @change="updateTime" @focus="$event.target.select()" type="text" maxlength="2" name="min" :value="minute" min="0" max="59" autocomplete="off"/>
    </div>
</template>

<script>

 /**
   * The custom time component. Used to display time in [dd:hh:mm].
   */
export default {
    name: 'Custom Time',
    props: {
        /**
         * The time value in minutes.
         */
        Time: {
            type: Number,
            default: 0,
        },
        /**
         * The name for the event.
         */
        name: {
            type: String,
            default: ""
        },
        /**
         * If the event is repeated. Used to determin if days should be displayed.
         * @values none, daily, weekly
         */
        repeat: {
            type: String,
            default: 'none'
        }
    },
    data(){
        return {
            days: 0,
            hours: 0,
            minutes: 0,
        }
    },
    emits: ['updateTime'],
    methods: {
        /**
         * Updates the time and emits the change
         * @param {*} event 
         */
        updateTime(event){
            let name = event.srcElement.name;
            let value = event.srcElement.value;
            // console.log(value)
            // Checks if the value is within the boundries else adjust them
            if (name == "min"){
                value <= 0 ? value = 0 : 
                value > 59 ? value = 59 : null
            }else if (name == "hour"){
                value <= 0 ? value = 0 :
                value > 23 ? value = 23 : null
            }else if (name == "day"){
                value <= 1 ? value = 1 : null
                this.repeat === "weekly" ? value > 7 ? value = 7 : null : null
            }
            // Makes sure the correct value is displayed in the input field
            event.srcElement.value = name == "day" ? value : this.format(value);
            // Make sure time variables are right
            this.calculateTime(this.Time);  

            // Calculates the time in total minutes
            let time = 0;
            name === "day" ? time = (value-1) * 1440 + this.hours * 60 + this.minutes :
            name === "hour" ? time = this.days * 1440 + value * 60 + this.minutes :
            name === "min" ? time = this.days * 1440 + this.hours * 60 + parseInt(value) : null

            /**
             * Updates the time and emits the change
             * @param {String} name name of the event. Taken from the name prop
             * @param {String} val total time in minutes
             */
            this.$emit('updateTime', {name:this.name, val:time});
        },
        calculateTime(time){
            // calculate (and subtract) whole days
            this.days = Math.floor(time / 1440);
            time -= this.days * 1440;

            // calculate (and subtract) whole hours
            this.hours = Math.floor(time / 60) % 24;
            time -= this.hours * 60;

            // calculate (and subtract) whole minutes
            this. minutes = Math.floor(time) % 60;
        },
        // Formates the time, so it's two digits
        format(time){
            if(parseInt(time,10) < 10){
                time='0'+time;
            }
            return time
        }
    },
    computed: {
        day: function(){
            this.calculateTime(this.Time)
            // +1 compensates for the offset of the day. Day 1 doesn't mean 1440 minutes
            return this.days + 1
        },
        hour: function() {
            this.calculateTime(this.Time)
            return this.format(this.hours)
        },
        minute: function() {
            this.calculateTime(this.Time)
            return this.format(this.minutes)
        },
        // Checks if the [dd] input field should be displayed
        toShow: function () {
            let bool = false;
            this.repeat === "none" ? bool = true : 
            this.repeat === "weekly" ? bool = true : null
            return bool
        },
        // Checks if there needs to be a maximum value for days. If weekly repeat, then days shouldn't exceed 7
        weeklyRep: function () {
            let bool = false;
            this.repeat === "weekly" ? bool = true : null
            return bool
        }
    }
}
</script>

<style scoped>
.customTime{
    width: 81px;
    position: relative;
    border-bottom: 1px solid black;
    background: whitesmoke;
}
.customTime input{
    border: none;
    width: 20px;
    text-align: center;
    height: 100%;
    padding: 0;
}
/* Chrome, Safari, Edge, Opera */
.customTime input::-webkit-outer-spin-button,
.customTime input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
.customTime input[type=number] {
  -moz-appearance: textfield;
}
</style>
