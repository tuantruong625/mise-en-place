<template>
  <div class="sign-up">
    <header class="sign-up__header">
      <div class="sign-up__header--logo">
        <img class="" src="../assets/logo.png" alt="">
        <h1>Mise en Place</h1>
      </div>

      <p>Create your account.</p>
    </header>
    <section class="sign-up__form">

      <label for="email" class="signin__label">
        <span>Email</span>
        <input class="signin__input" type="text" name="email" id="email" v-model="email">
      </label>
      <label for="password" class="signin__label">
        <span>Password</span>
        <input class="signin__input" type="password" name="password" id="password" v-model="password">
      </label>

      <label for="confirmPassword" class="signin__label">
        <span>Confirm Password</span>
        <input class="signin__input" type="password" name="password" id="confirmPassword" v-model="confirmPassword">
      </label>

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
    };
  },
  methods: {
    signUp() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
        // eslint-disable-next-line no-console
        console.log(user);
        this.$router.replace('/login');
      }).catch((err) => {
        let errorCode = err.code;
        let errorMessage = err.message;
        if (errorCode == 'auth/email-already-in-use') {
          alert('Email is already in use.');
        } else {
          alert(errorMessage);
        }
      });
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
    background: #EFEEEE;
    height: 100vh;
    color: #495057;

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
      width: 900px;
      height: 257px;
      background: #EFEEEE;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto;
      justify-items: center;
      align-items: center;

      label {
        display: flex;
        flex-direction: column;

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
        grid-column: 3 / -1;
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
