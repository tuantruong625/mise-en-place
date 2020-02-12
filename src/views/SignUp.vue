<template>
  <div class="sign-up">
    <h3>Create a new account</h3>
    <input
      v-model="email"
      type="text"
      class="input"
      placeholder="Email"
      required
    >
    <br>
    <input
      v-model="password"
      type="password"
      class="input"
      placeholder="Password"
      required
    >
    <br>
    <button v-on:click="signUp" class="button">Sign Up!</button>
    <button class="button">
      <router-link to="/login">
        Back
      </router-link>
    </button>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'SignUp.vue',
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    signUp() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
        // eslint-disable-next-line no-console
        console.log(user);
        this.$router.replace('/login');
      }).catch((err) => {
        alert(err.measure());
      });
    },
  },
};
</script>

<style scoped>

</style>
