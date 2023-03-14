<template>
    <button >
        <slot />
        <font-awesome-icon v-if="icon" :style="cssProps" class="icon" :icon=icon />
    </button>
</template>
<script>
/**
 * A button with a text area to the left and fa-icon to the right.
 */
export default{
    name:'Text Icon Button',
    props: {
        /**
         * Name of the fa-icon. 
         * If not specified, icon will not be shown.
         */
        icon: {
            type: String
        },
        /**
         * Color of the icon in hsl format.
         */
        color: {
            type: String,
            default: "hsl(239, 39%, 22%)"
        },
        /**
         * Font size and line height of the icon.
         */
        fontSize: {
            type: Number,
            default: 17,
        }
    },
    methods: {
        // Generates a darker color of the input.
        getDarkerColor(color){
            var colorSplit = color.split(",")
            color = colorSplit[0] + "," + colorSplit[1] + ",30%)"
            return color
        }
    },
    computed: {
        // Calculates and defines the variables for css.
        cssProps() {
            return {
                '--color': this.color,
                '--h-color': this.getDarkerColor(this.color),
                '--size' : this.fontSize + 'px',
            }
        }
    }
}
</script>
<style scoped>
button{
  position: relative;
  padding: 10px;
  font-size: 15px;
  line-height: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover{
  /* TODO change hover effect */
  filter: brightness(90%);
}
.icon{
    color: var(--color);
    font-size: var(--size);
    line-height: var(--size);
    cursor: pointer;
    padding-left: 5px;
    transition: .5s;
}
button:hover .icon{
    color: var(--h-color)!important;
}
</style>
