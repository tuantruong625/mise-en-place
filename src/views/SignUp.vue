<template>
  <div class="sign-up">
    <img class="sign-up__header--logo" src="../assets/logo.png" alt="">

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

      <button data-test="signInButton" @click="signUp">Create Account</button>
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
  watch : {
    errorCode(errorCode) {
      this.resetFields(errorCode);
    },
  },
  methods: {
    signUp() {
      this.validation();
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
        // eslint-disable-next-line no-console
        console.log(user);
        this.$router.replace('/login');
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
        this.passwordErrorMessage = 'Email is already in use.';
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

<style lang="scss" scoped>
  .sign-up {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #FFF;
    height: 100vh;
    color: #495057;

    &__error-message {
      color: #f03e3e;
      padding-top: 1rem;
      margin-left: 1rem;
    }

    &__header {
      grid-area: sign-up-header;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 5rem;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
      }

      p {
        margin-top: 1rem;
        font-size: 1.25rem;
      }

      &--logo {
        display: flex;
        align-items: center;
        font-size: 2rem;
        z-index: 1;
        width: 10rem;
        position: absolute;
        top: calc(50% - 18.5rem);
        left: calc(50% - 5.25rem);

        img {
          margin-right: 1rem;
        }
      }
    }

    &__form {
      width: 900px;
      height: 400px;
      background: #f8f9fa;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      display: grid;
      grid-template-areas:
        "sign-up-header sign-up-header sign-up-header"
        "email-input password-input confirm-password-input"
        "back-link . sign-up-button";
      justify-items: center;
      align-items: center;

      &::after {
        content: '';
        width: 11rem;
        height: 11rem;
        background: #FFF;
        position: absolute;
        border-radius: 200px;
        top: calc(50% - 19rem);
        left: calc(50% - 5.75rem);
      }

      label {
        display: flex;
        flex-direction: column;

        span {
          margin: 0 0 0.5rem 1rem;
        }
      }

      input {
        background: #f8f9fa;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        padding: 1rem 1.5rem;
        width: 13rem;
        margin-bottom: 0.5rem;
      }

      button {
        grid-area: sign-up-button;
        background: #74C0FC;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        width: 16.5rem;
        height: 3.25rem;
        color: #fff;
        margin-top: 2rem;
        margin-bottom: 2rem;
      }
    }

    &__link {
      margin-top: 2rem;
      margin-bottom: 2rem;
      font-size: 1.25rem;
      a {
        color: #74C0FC;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    }
  }
</style>
