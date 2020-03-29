<template>
  <div class="sign-in">
    <section class="sign-in__form">
      <img class="sign-in__header--logo" src="../../assets/MPicon_blue.svg" alt="Logo">

      <header class="sign-in__header">
        <h1>Mise en Place</h1>
        <p>Sign into your account</p>
      </header>

      <div class="sign-in__form--container">
        <label for="email" class="sign-in__label">
          <span>Email</span>
          <input class="signin__input" type="text" name="email" id="email" v-model="email">
        </label>
        <span class="sign-in__error-message">{{ emailErrorMessage }}</span>
      </div>

      <div class="sign-in__form--container">
        <label for="password" class="signin__label">
          <span>Password</span>
          <input class="signin__input" type="password" name="password" id="password" v-model="password">
        </label>
        <span class="sign-in__error-message">{{ passwordErrorMessage }}</span>
      </div>

      <span class="sign-in__link">
        Don't have an account?
        <router-link to="/sign-up">Sign up here.</router-link>
      </span>

      <button data-test="signInButton" :disabled="!canSignIn" @click="signin">Sign in</button>
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
      emailErrorMessage: '',
      passwordErrorMessage: '',
      errorCode: null,
    };
  },
  computed: {
    canSignIn() {
      return this.email && this.password;
    },
  },
  watch : {
    errorCode(errorCode) {
      this.resetFields(errorCode);
    },
  },
  methods: {
    signin() {
      !this.email ? this.emailErrorMessage = 'Email Required' : this.emailErrorMessage = '';
      !this.password ? this.passwordErrorMessage = 'Password Required' : this.passwordErrorMessage = '';

      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
        this.$router.push('/tables').catch(err => {
        });
      }).catch((err) => {
        this.validate(err);
      });
    },
    resetFields(errorCode) {
      if (errorCode) {
        this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
      }
    },
    validate(err) {
      this.errorCode = err.code;
      if (this.errorCode === 'auth/wrong-password') {
        this.passwordErrorMessage = 'You entered a wrong password.';
      } else if (this.errorCode === 'auth/user-not-found') {
        this.emailErrorMessage = 'No Account, please create account.';
      } else if (this.errorCode === 'auth/invalid-email') {
        this.emailErrorMessage = 'You entered an invalid email';
      } else if (this.errorCode === 'auth/too-many-requests') {
        this.passwordErrorMessage = 'Too many tries';
      }
    },
  },
};
</script>
<style lang="scss" scoped src="./SignIn.scss"></style>
