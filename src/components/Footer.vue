<template>
    <div id="footer">
        <img class="logo" src="../assets/AAU_CENTER_WHITE_UK.png"/>
        <div class="right">
            <p>Contributors: Mohamad Al Ahdab, Deividas Eringis & John-Josef Leth </p>
            <p>UI design: Mikkel Pedersen</p>
            <p>Medical advisory board: Jakob Dal</p>
            <p>Copyright © 2022 {{version}}</p>
        </div>
        <nav>
            <router-link to="/legal">EULA and cookie policy</router-link>
        </nav>
    </div>
</template>
<script>
/**
 * The component used as a container for the footer.
 */
export default {
    name: "Footer",
    props: {
        version: String
    }
}
</script>
<style scoped>
#footer{
    grid-column-start: 1;
    grid-column-end: 3;
    background: #22234e;
    /* box-shadow: 0px -20px 55px rgba(34, 35, 78, 0.5); */
    display: grid;
    grid-template-columns: 25% 50% 25%;
}
#footer .logo{
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    height: 150px;
    left: calc(50% - 75px);
}
#footer .right{
    position: relative;
    margin: 10px 0;
    border-left: 1px solid white;
    color: white;
    text-align: left;
    padding-left: 10px;
}
#footer nav{
    position: relative;
    margin: 10px 0;
    border-left: 1px solid white;
    color: white;
    text-decoration: none;
    text-align: left;
    padding: 0px;
    padding-left: 10px;
}
nav a {
    position: relative;
    color: white;
}
nav a.router-link-exact-active {
    font-weight: bold;
}
@media only screen and (max-width: 1000px) {
    #footer .logo {
        height: 100px;
        left: calc(50% - 50px);
    }
}
</style>
