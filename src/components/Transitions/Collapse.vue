<!-- The animation is based on:
https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
-->
<template>
    <!-- Checks if standard or more style is needed -->
    <transition v-if="additionalStyle" name="collapse" 
        @before-enter="beforeEnter"
        @enter="enter" 
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave">
        <!-- @slot The content to be transitioned -->
        <slot />
    </transition>
    <transition v-else name="collapse" 
        @enter="enter" 
        @after-enter="afterEnter"
        @leave="leave">
        <!-- @slot The content to be transitioned -->
        <slot />
    </transition>
</template>

<script>
/**
 * A transition for collapsing and expanding a section.
 * It transitions the height by first calculating the target height, and then 
 * transitioning to that height.
 */
export default {
    name: "TransitionCollapse",
    props:{
        /**
         * Should there be additional styling of the background and border
         */
        additionalStyle: false,
    },
    methods:{
        // Calculates the height needed to animate to
        enter(element) {
            const width = getComputedStyle(element).width;
            // Makes so the height can be calculated by making the element absolute and hidden. (Makes it float so nothing is moved)
            element.style.width = width;
            element.style.position = 'absolute';
            element.style.visibility = 'hidden';
            element.style.height = 'auto';
            // Calculates the height
            const height = getComputedStyle(element).height;
            // Resets styles
            element.style.width = null;
            element.style.position = null;
            element.style.visibility = null;
            element.style.height = 0;

            // Force repaint to make sure the animation is triggered correctly.
            getComputedStyle(element).height;

            // Trigger the animation.
            // We use `requestAnimationFrame` because we need to make sure the browser has finished painting after setting the `height` to `0` in the line above.
            requestAnimationFrame(() => {
                element.style.height = height;
            }); 
        },
        afterEnter(element) {
            // The style is set back to auto, so the height can adapt to changes such as adding or removing events
            element.style.height = 'auto';
        },
        leave(element) {
            const height = getComputedStyle(element).height;
            element.style.height = height;
            // Force repaint to make sure the animation is triggered correctly.
            getComputedStyle(element).height;

            requestAnimationFrame(() => {
                element.style.height = 0;
            });
        },
        beforeEnter(element){
            // Adds style of parent
            element.parentElement.style.border = "1px solid black"
            element.parentElement.style.background = "white"
        },
        afterLeave(element){
            // Removes style of parent
            element.parentElement.style.border = "none"
            element.parentElement.style.background = "transparent"
        }
    }
}
</script>

<style scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
/* Animation of dropdown */
.states .header .rotate{
    transform: rotate(180deg);
}

.collapse-enter-active,
.collapse-leave-active {
    transition: all .6s ease;
    overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
    height: 0px;
}
</style>