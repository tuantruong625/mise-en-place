<template>
  <div class="signin">
    <aside class="signin__image"/>
    <section class="signin__login">
      <img class="signin__logo" src="../assets/logo.png" alt="">

      <label for="username" class="signin__label">
        Username
        <input class="sigin__input" type="text" name="username" id="username">
      </label>
      <label for="password" class="signin__label">
        Password
        <input class="sigin__input" type="text" name="password" id="password">
      </label>
      <button class="signin__button" data-test="signInButton"><router-link to="/home">Sign In</router-link></button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
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
