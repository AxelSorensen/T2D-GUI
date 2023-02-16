<template>
    <EULA></EULA>
    <hr>
    <div id="GDPR">
        <h3>General Data Protection Regulation (GDPR)</h3>
        <h4>HOW WE PROCESS YOUR DATA</h4>
        <h5>WE ARE THE DATA CONTROLLER</h5>
        <ul class="contactInfo">
        <li>Aalborg University</li>
        <li>Fredrik Bajers Vej 7K</li>
        <li>DK-9220 Aalborg</li>
        <li>CVR no. 2910238</li>
        </ul>
        <h5>THE PURPOSE OF PROCESSING YOUR DATA</h5>
        Unique IP- and/or MAC-address only, is logged on unique users of the <a href="https://www.t2d.aau.dk">Type2Diabetes-simulator (aau.dk) website</a>, 
        using a necessary Cookie, to verify that
        <ul>
          <li>the EULA has been accepted, so you can run the software, and </li>
          <li>enable us to understand how many unique users we have at any time, using and/or downloading the software, and where the users are from in terms of Country and Organization. </li>
        </ul>
        The data collected, will not be used to identify or contact physical persons.
        <h5>WE PROCESS THE FOLLOWING PERSONAL DATA:</h5>
        <ul>
        <li>General personal data (see Article 6(1) (e)),  specifically any user’s unique IP- and/or MAC-address.
        (E.g. name, address, email, age, self-published data etc.)</li>
        </ul>
        <h5>HOW WE STORE YOUR DATA</h5>
        We will store your personal data for as long as necessary for the data processing purpose and in accordance with the applicable legislation. We will then erase your personal data. 
        <h5>YOUR RIGHTS</h5>
        When we process your personal data, you have several rights under the General Data Protection Regulation. For example, you have a right to erasure and a right to data portability. 
        <br><br>
        In certain cases, you have a right of access, a right to rectification, a right to restriction of processing and a right to object to our processing of the personal data in question.
        <br><br>
        You can read more about your rights in our privacy policy, which you will find here: <a href="https://www.aau.dk/om-cookies/">https://www.aau.dk/om-cookies/</a>. 
        <h5>AAU’S DATA PROTECTION OFFICER</h5>
        If you have general questions about your rights, you can contact our Data Protection Officer Niels Vase at <a href="mailto:dpo@aau.dk">dpo@aau.dk</a>

        <h5>DO YOU WANT TO COMPLAIN?</h5>
        We must and will always comply with the rules. If you believe that we do not meet our responsibility or that we do not process your data according to the rules, you may lodge a complaint with the Danish Data Protection Agency at <a href="mailto:dt@datatilsynet.dk">dt@datatilsynet.dk</a>.
        <br><br>
        However, we encourage you also to contact us, as we want to do our utmost to accommodate your complaint.

    </div>
  </template>
  <script>
  import EULA from './EULA.vue'
  export default {
    name: 'LegalContent',
    components: {
        EULA,
    }
  }
  </script>
  <style scoped>
    ul{
      list-style-position: outside;
    }
    .contactInfo{
      list-style-type: none;
    }
  
    .Delete{
      color: red;
      font-weight: bold;
    }
    /* @media only screen and (max-width: 1000px) {
    
    } */
  </style>
  