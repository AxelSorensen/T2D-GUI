<template>
  <router-view
    :version="version"
    :statPath="statPath"/>
  <!-- 
  Footer
  -->

  <!-- TODO Footer removed -->
  <!-- <Footer 
    :version="version" /> -->
</template>
<script>
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Footer,
},
  data(){
    return {
      version: "v0.246",
      statPath: "https://dev.t2d.aau.dk/php/" // https://dev.t2d.aau.dk/php/ , https://t2d.aau.dk/php/
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
