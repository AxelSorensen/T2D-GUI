<template>
    <IconButton v-if="show" :icon="ifIcon"/>
    <IconButton v-else :icon="elseIcon"/>
</template>
<script>
import IconButton from './IconButton.vue'
/**
 * A toggle button with two fa-icons.
 */
export default{
    name:'Icon Toggle Button',
    components: {IconButton},
    props: {
        /**
         * Fa-icon to be displayed normally.
         */
        ifIcon: {
            type: String,
            default: "fa-maximize"
        },
        /**
         * Fa-icon to be displayed when toggled.
         */
        elseIcon: {
            type: String,
            default: "fa-minimize"
        },
        /**
         * Color of the icon in hsl format.
         */
        color: String,
        /**
         * Font size and line height of the icon.
         */
        fontSize: {
            type: Number,
            default: 17,
        },
        /**
         * The boolean to keep track of the toggle
         */
        show: Boolean,
    },
}
</script>
<style scoped>

</style>