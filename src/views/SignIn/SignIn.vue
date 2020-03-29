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

<style lang="scss" scoped>
  .sign-in {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #FFF;
    height: 100vh;
    color: #495057;
    background-image: url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%2376c9ba' fill-opacity='0.1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");

    &__error-message {
      color: #f03e3e;
      margin-left: 1rem;
    }

    &__header {
      grid-area: sign-in-header;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 5rem;

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
        width: 12rem;
        position: absolute;
        top: calc(50% - 19.25rem);
        left: calc(50% - 6.25rem);

        img {
          margin-right: 1rem;
        }
      }
    }

    &__form {
      width: 650px;
      height: 400px;
      background: #f8f9fa;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      display: grid;
      grid-template-areas:
      "sign-in-header sign-in-header"
      "email-input password-input"
      "sign-up sign-in-button";
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
        margin: 1rem 0 1rem 0;

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
      }

      button {
        grid-area: sign-in-button;
        background: #282E72;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        border-radius: 20px;
        width: 16.5rem;
        height: 3.25rem;
        color: #fff;
        margin-top: 0.5rem;
        margin-bottom: 2rem;

        &:hover {
          box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        }

        &:disabled {
          background: #282E72;
          opacity: 55%;
          color: #f8f9fa;
        }
      }
    }

    &__link {
      grid-area: sign-up;
      margin-top: 0.5rem;
      margin-bottom: 2rem;
      a {
        color: #282E72;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    }
  }
</style>
<style src="../../css/font.css" />
