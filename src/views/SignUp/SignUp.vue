<template>
  <div class="sign-up">
    <img class="sign-up__header--logo" src="../../assets/MPicon_blue.svg" alt="Logo">

    <section class="sign-up__form">

      <header class="sign-up__header">
        <h1>Mise en Place</h1>
        <p>Create your account.</p>
      </header>

      <div class="sign-up__form--container">
        <label for="email" class="signin__label">
          <span>Email</span>
          <input class="signin__input" type="text" name="email" id="email" v-model="email">
        </label>
        <span class="sign-up__error-message">{{ emailErrorMessage }}</span>
      </div>

      <div class="sign-up__form--container">
        <label for="password" class="signin__label">
          <span>Password</span>
          <input class="signin__input" type="password" name="password" id="password" v-model="password">
        </label>
        <span class="sign-up__error-message">{{ passwordErrorMessage }}</span>
      </div>

      <div class="sign-up__form--container">
        <label for="confirmPassword" class="signin__label">
          <span>Confirm Password</span>
          <input class="signin__input" type="password" name="password" id="confirmPassword" v-model="confirmPassword">
        </label>
        <span class="sign-up__error-message">{{ confirmPasswordErrorMessage }}</span>
      </div>

      <span class="sign-up__link">
        <router-link to="/sign-in">Back</router-link>
      </span>

      <button data-test="signUpButton" @click="signUp" :disabled="!canSignUp">Create Account</button>
    </section>
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
      confirmPassword: null,
      errorCode: null,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      confirmPasswordErrorMessage: '',
    };
  },
  computed: {
    canSignUp() {
      return this.email && this.password && this.confirmPassword;
    },
  },
  watch : {
    errorCode(errorCode) {
      this.resetFields(errorCode);
    },
  },
  methods: {
    signUp() {
      this.validation();
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
        this.$router.replace('/tables');
      }).catch((err) => {
        this.firebaseValidation(err);
      });
    },
    validation() {
      !this.email ? this.emailErrorMessage = 'Email Required' : this.emailErrorMessage = '';
      !this.password ? this.passwordErrorMessage = 'Password Required' : this.passwordErrorMessage = '';
      this.confirmPassword !== this.password ? this.confirmPasswordErrorMessage = 'Passwords need to match' : this.confirmPasswordErrorMessage = '';
    },
    firebaseValidation(err) {
      this.errorCode = err.code;
      if (this.errorCode === 'auth/email-already-in-use') {
        this.emailErrorMessage = 'Email is already in use.';
      } else if (this.errorCode === 'auth/invalid-email') {
        this.emailErrorMessage = 'You entered an invalid email.';
      }
    },
    resetFields(errorCode) {
      if (errorCode) {
        this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
        this.confirmPasswordErrorMessage = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./SignUp.scss"></style>
