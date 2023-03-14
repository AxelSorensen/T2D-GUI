<template>
    <div class="ImportantInfo">
      <!-- TODO changed functionality of important info button. The text has been moved to Graph header -->
        <TextIconButton icon="fa-circle-exclamation" color="hsl(0, 100%, 50%)">Important information</TextIconButton>
        <Collapse additionalStyle=true>
            <div class="Disclaimer" v-show="show">
            <span><b>This simulator is intended for teaching and research purposes only. Under no circumstances should it be used as a tool for self-treatment.</b></span><br/>
            <span>
                <span>This simulator is developed by the Nonlinear and Optimal Control Lab at Aalborg University, and is based on the following paper:</span>
                <span class="source"><a href="https://www.sciencedirect.com/science/article/pii/S1369703X21002461">[1] Glucose-Insulin Mathematical Model for the Combined Effect of Medications and Life Style of Type 2 Diabetic Patients , Biochemical Engineering Journal[DOI: 10.1016/j.bej.2021.108170]</a></span>
                <ul>
                    <li>All references (equation number, section number etc.,) refer to [1]. Additional material has been added to the simulator, this is indicated by the symbol *. </li>
                    <li>For comments and questions, please contact John Leth at jjl@es.aau.dk</li>
                </ul> 
            </span>
            </div>
        </Collapse>
    </div>
</template>
<script>
import TextIconButton from "./TextIconButton.vue"
import Collapse from "./Transitions/Collapse.vue"
/**
 * Holds the important information section and collapse window
 * Gets called two times(In App.vue and Graph.vue).
 * The two calls show at different times depending on screen width
 */
export default{
    name: "Important Info",
    components: {
        TextIconButton,
        Collapse
    },
    data(){
        return {
            show: false,
        }
    }
}
</script>
<style scoped>
.ImportantInfo{
    width: auto;
    z-index: 4;
    text-align: right;

}
.Disclaimer{
 
}
.Disclaimer span{
  
    display: block;
}
.Disclaimer .source {
    font-size: 15px;
    font-style: italic;
}
.Disclaimer ul {
    list-style-position: inside;
    text-align: left;
}
.source a{
    color: cornflowerblue;
}
@media only screen and (max-width: 1450px) {
    .ImportantInfo .Disclaimer{
        width: calc(100% - 10px);
        min-width: calc(100% - 10px);
    }
}
@media only screen and (max-width: 1000px) {
    .ImportantInfo button{    
        width: 100%;
    }
    .ImportantInfo .Disclaimer{
        width: calc(200% - 30px);
        
    }
}
@media only screen and (max-width: 600px) {
  .ImportantInfo{    
    padding: 0;
    right: 0;
    width: auto;
    min-width: 50%;
  }
  .ImportantInfo button {
    width: 100%;
  }
}
</style>