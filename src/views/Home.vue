<template>
  <div class="home">
    <sign-in />
  </div>
</template>

<script>
// @ is an alias to /src
import SignIn from '@/views/SignIn';
export default {
  name: 'home',
  components: {
    SignIn,
  },
};
</script>
