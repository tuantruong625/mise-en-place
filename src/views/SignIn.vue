<template>
  <div class="sign-in">
    <header class="sign-in__header">
      <div class="sign-in__header--logo">
        <img class="" src="../assets/logo.png" alt="">
        <h1>Mise en Place</h1>
      </div>

      <p>Sign into your account.</p>
    </header>
    <section class="sign-in__form">
      <div class="sign-in__form--container">
        <label for="email" class="sign-in__label">
          <span>Email</span>
          <input class="signin__input" type="text" name="email" id="email" v-model="email" @change="signin" >
        </label>
        <span class="sign-in__error-message">{{ emailErrorMessage }}</span>
      </div>

      <div class="sign-in__form--container">

        <label for="password" class="signin__label">
          <span>Password</span>
          <input class="signin__input" type="password" name="password" id="password" v-model="password" @change="signin">
        </label>
        <span class="sign-in__error-message">{{ passwordErrorMessage }}</span>
      </div>

      <span class="sign-in__link">
        Don't have an account?
        <router-link to="/sign-up">Sign up here</router-link>
      </span>

      <button data-test="signInButton" @click="signin">Sign in</button>
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
        // eslint-disable-next-line no-console
        console.log(user);
        this.$router.replace('/home');
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
    background: #EFEEEE;
    height: 100vh;
    color: #495057;

    &__error-message {
      color: #f03e3e;
      margin-left: 1rem;
    }

    &__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 3rem;

      p {
        font-size: 1.25rem;
        margin-top: 1.5rem;
      }

      &--logo {
        display: flex;
        align-items: center;
        font-size: 2rem;

        img {
          margin-right: 1rem;
        }
      }
    }

    &__form {
      width: 650px;
      height: 300px;
      background: #EFEEEE;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      display: grid;
      grid-template-columns: auto auto;
      grid-template-rows: 10rem 8rem;
      justify-items: center;
      align-items: center;

      label {
        display: flex;
        flex-direction: column;
        margin: 3rem 0 1rem 0;

        span {
          margin: 0 0 0.5rem 1rem;
        }
      }

      input {
        background: #EFEEEE;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        padding: 1rem 1.5rem;
        width: 13rem;
      }

      button {
        background: #74C0FC;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        width: 16.5rem;
        height: 3.25rem;
        color: #fff;
      }

      &--container {
        height: 100%;
      }
    }

    &__link {
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
<style src="../css/font.css" />
