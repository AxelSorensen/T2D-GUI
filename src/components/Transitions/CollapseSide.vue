<template>
    <transition name="collapse-side" mode="out-in"
        @enter="enter" 
        @after-enter="afterEnter"
        @leave="leave">
        <!-- @slot The content to be transitioned -->
        <slot />
    </transition>
</template>

<script>
/**
 * A transition for collapsing and expanding a section sideways.
 */
export default {
    name: "TransitionCollapseSide",
    methods: {
        enter(element) {
            // Makes sure the width is 0
            element.style.width = 0;
            // Force repaint to make sure the animation is triggered correctly.
            getComputedStyle(element).width;
            // Trigger the animation.
            // We use `requestAnimationFrame` because we need to make sure the browser has finished painting after setting the `height` to `0` in the line above.
            requestAnimationFrame(() => {
                element.style.width = '100%';
            }); 
        },
        afterEnter(element) {
            // Might not be necessary
            element.style.width = '100%';
        },
        leave(element) {
            const width = getComputedStyle(element).width;
            element.style.width = width;
            // Force repaint to make sure the animation is triggered correctly.
            getComputedStyle(element).width;
            requestAnimationFrame(() => {
                element.style.width = 0;
            });
        },
    }
}
</script>

<style scoped>
/* Animation of dropdown */
.collapse-side-enter-active,
.collapse-side-leave-active {
  transition: all .1s ease;
  overflow: hidden;
  min-width: none;
  white-space: nowrap;
}
.collapse-side-enter-from,
.collapse-side-leave-to {
    width: 0px;
}
</style>