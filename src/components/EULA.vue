<template>
    <div id="EULA">
        <h3>End User License Agreement</h3>
        The software is owned by Aalborg University and provided to the user for teaching of students only. The pre-defined generic patients, does not represent any real person, and is intended only for teaching purposes. Further the possibilities to suggest specific medicine, and see resulting effect on such generic patients shall in no way be seen as instruction on how to medicate any real patients. The software is not approved for use on patients. 
        <br><br>
        If you abide by this Agreement, AAU grants you a non-exclusive non-transferable license to use one copy of the version or release of the accompanying software for your internal teaching purposes only, specifically excluding any commercial use of the software. Your use is subject to the following restrictions:
        <ul>
        <li>You may not use the software for patient care and treatment.</li>
        <li>You may not the use software to provide services to third parties.</li>
        <li>You may not make copies and distribute, resell or sublicense the software to third parties.</li>
        <li>You may not copy the software or make it available on a public or external distributed network.</li>
        <li>You may not allow access on an intranet unless it is restricted to authorized users for teaching purposes. </li>
        <li>You may make one copy of the software for archival purposes or when it is an essential step in authorized use for teaching purposes. </li>
        <li>You may not modify, reverse engineer, disassemble, decrypt, decompile or make derivative works of software. </li>
        <li>You may not share your test results with third parties for commercial benefits or for marketing purposes.</li>
        </ul>
        THE SOFTWARE IS PROVIDED AS-IS. AALBORG UNIVERSITY DISCLAIMS ALL OTHER EXPRESS AND IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. USER UNDERSTANDS THAT THE SOFTWARE MAY NOT BE ERROR FREE, AND USE MAY BE INTERRUPTED. 
        <br><br>
        By accepting the EULA you also accept the use of cookies <router-link to="/legal">as defined in the GDPR Policy</router-link>.
    </div>
  </template>
  <script>
  export default {
    name: 'EULA',
  }
  </script>
  <style scoped>
  #EULA{
    text-align: left;
  }
  h3{
    text-align: center;
  }
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
  </style>
  