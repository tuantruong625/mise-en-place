<template>
  <div class="signin-container">
    <h1>Sign in Page</h1>
    <button data-test="signInButton">Sign In</button>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
};
</script>

<style scoped>
  .signin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
</style>
