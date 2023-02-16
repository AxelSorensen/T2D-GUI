<template>
  <div class="legal">
    <div class="header">
      <router-link to="/" class="return"><IconButton icon="chevron-left" color="hsl(0,0,0)"/> <span>Return to simulator simulator</span></router-link>
      <h3>Legal stuff</h3>
    </div>
    <div class="pageContent">
      
      <LegalContent></LegalContent>

    </div>
  </div>
</template>
<script>
import IconButton from '../components/IconButton.vue';
import LegalContent from '../components/LegalContent.vue'

export default {
  name: 'Legal',
  components:{
    IconButton,
    LegalContent
  }
}
</script>
<style scoped>
  body{
    margin: 0px;
    box-sizing: border-box;
  }
  .legal{
    min-height: 80vh;
    position: relative;
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .header{
    position: relative;
    height: 60px;
    background: #22234e;
    display: grid;
    grid-template-columns: 25% 50% 25%;
  }
  .header a{
    color: white;
    text-decoration: none;
  }
  .return {
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .return span{
    font-size: 20px;
    padding: 5px 0px;
    vertical-align: .2em;
  }
  .header h3{
    color: white;
    grid-column-start: 2;
    grid-column-end: 3;
  }
  .pageContent{
    position: relative;
    left: calc(50% - 300px);
    text-align: left;
    max-width: 600px;
    padding-bottom: 20px;
  }
  @media only screen and (max-width: 768px) {
    .pageContent{
      margin: 0 10%;
      left: 0;
      max-width: unset;
    }
  }
  @media only screen and (max-width: 700px) {
    .header{
      height: 80px;
      grid-template-columns: 100%;
      grid-template-rows: 50% 50%;
    }
    .header h3{
      margin: 0;
      grid-column-start: auto;
      grid-column-end: auto;
      grid-row-start: 2;
      grid-row-end: 2;
    }
    .return {
      position: relative;
      top: unset;
      transform: unset;
      grid-row-start: 1;
      grid-row-end: 1;
    }
  }
</style>
