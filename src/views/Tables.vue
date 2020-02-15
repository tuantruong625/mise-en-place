<template>
  <section class="table-container">
    <h1>Tables</h1>
    <button @click="addUsername">YO</button>
  </section>
</template>

<script>
import firebase from 'firebase';
export default {
  data() {
    return {
      user: null,
      displayName: null,
    };
  },
  computed: {
    noDisplayName() {
      return !this.user.displayName;
    },
  },
  methods: {
    addUsername() {
      this.user.updateProfile({
        displayName: this.displayName,
      });
    },
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  },
};
</script>

<style lang="scss" scoped>

.table-container {
    background: #EFEEEE;
    min-height: calc(100vh - 96px);
}
</style>
