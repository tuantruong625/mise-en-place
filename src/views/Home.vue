<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="signout">Logout</button>
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
