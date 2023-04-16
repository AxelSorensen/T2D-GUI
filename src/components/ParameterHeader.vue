<template>
    <div class="header" :class="text">
        <h2>{{text}}</h2>
        <IconButton v-if="displayIcon" @click="iconClick" class="save" icon="fa-ellipsis-vertical" :fontSize=25 />
    </div>
</template>
<script>
import IconButton from './IconButton.vue'

export default{
    name: 'Parameter Header',
    components: {IconButton},
    props: {
        text: {
            type: String,
            default: ''
        },
        displayIcon: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['iconClick'],
    methods: {
        iconClick(event){
            this.$emit('iconClick', this.text)
        }
    },
}
</script>
<style scoped>
.header{
    position: relative;
    z-index: 10;
    border-top: 1px solid #22234e;
    border-bottom: 1px solid #22234e;
    padding: 5px;
    display: grid;
    grid-template-columns: 30px calc(100% - 60px) 30px;
}
h2{

    border: none;
    grid-column: 2;
    padding: 5px 0px;
}
.save{
    grid-column: 3;
    font-size: 24px;
    line-height: 24px;
    cursor: pointer;
}
/* Removes the border for the first element */
.External{
    border-top: none;
}
</style>