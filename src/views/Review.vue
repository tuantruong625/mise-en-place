<template>
  <div>
    <h1>HELLOOOOO</h1>
  </div>
</template>
<script>
import firebase from 'firebase';
export default {
  data(){
    return {
      user: null,
    };
  },
  created() {
    // eslint-disable-next-line no-console
    console.log('you are at the review page');
    this.user = firebase.auth().currentUser;
  },
};
</script>
<style scoped>

</style>