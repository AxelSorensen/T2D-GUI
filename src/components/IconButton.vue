<template>
    <a><font-awesome-icon class="icon" :style="cssProps" :icon=icon /></a>
</template>
<script>
/**
 * A button with a fa-icon 
 */
export default{
    name:'Icon Button',
    props: {
        /**
         * Name of the fa-icon.
         */
        icon: {
            type: String,
            default: "plus"
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
                '--h-size' : (this.fontSize * 1.2) + 'px',
            }
        }
    }
}
</script>
<style scoped>
.icon{
    color: var(--color);
    font-size: var(--size);
    line-height: var(--size);
    cursor: pointer;
    padding: 5px;
    transition: .5s;
}
.icon:hover{
    color: var(--h-color)!important;
    font-size: var(--h-size);
    line-height: var(--h-size);
}
</style>