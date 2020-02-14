<template>
  <div class="home">
    <nav class="nav">
      <img class="" src="../assets/logo.png" alt="">
      <router-link to="/tables">Tables</router-link>
      <router-link to="/menu">Menu</router-link>
      <button @click="signout">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'home',
  components: {
  },
  methods: {
    signout(e) {
      e.stopPropagation();
      firebase.auth().signOut();
      this.$router.push('/sign-in').catch(e => {
        // eslint-disable-next-line no-console
        console.log(e.message);
      });
    },
  },
};
</script>
<style scoped lang="scss">

</style>
