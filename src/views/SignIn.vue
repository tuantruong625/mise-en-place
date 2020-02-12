<template>
  <div class="signin">
    <aside class="signin__image"/>
    <section class="signin__login">
      <img class="signin__logo" src="../assets/logo.png" alt="">

      <label for="email" class="signin__label">
        Email
        <input class="sigin__input" type="text" name="email" id="email" v-model="email">
      </label>
      <label for="password" class="signin__label">
        Password
        <input class="sigin__input" type="text" name="password" id="password" v-model="password">
      </label>
      <button class="signin__button" data-test="signInButton" @click="login">Login</button>
      <p><router-link to="/signup">Create account here</router-link></p>
    </section>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
        // eslint-disable-next-line no-console
        console.log(user);
        this.$router.replace('/home');
      }).catch((err) => {
        alert(err.measure());
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .signin {
    display: grid;
    grid-template-columns: 1fr 2fr;
    min-height: 100vh;

    &__logo {
      height: auto;
      width: 15rem;
    }

    &__image  {
      background-image: url("https://images.pexels.com/photos/1528013/pexels-photo-1528013.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
      opacity: .5;
    }

    &__login {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    &__label {
      display: flex;
      flex-direction: column;
      margin: 1rem 0;
    }

    &__input {
      border-radius: 1rem;
    }

    &__button {
      margin-top: 1rem;
      padding: 1rem 4.5rem;
      border-radius: 1rem;
      border: none;
      background: #feb571;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
  }
</style>
<style src="../css/font.css" />
