<template>
  <div class="home">
    <nav class="nav">
      <img class="nav__logo" src="../assets/logo.png" alt="">

      <div class="nav__links">
        <router-link to="/tables"><img class="nav__icon" src="../assets/chair-solid.svg" alt=""></router-link>
        <router-link to="/menu"><img class="nav__icon" src="../assets/utensils-solid.svg" alt=""></router-link>
      </div>

      <div>
        {{ user.email }} |
        <button class="nav__sign-out-btn" @click="signout">Logout</button>
      </div>

    </nav>
    <router-view />
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  },
  methods: {
    signout(e) {
      e.stopPropagation();
      firebase.auth().signOut();
      this.$router.push('/sign-in').catch(e => {
        // eslint-disable-next-line no-console
        console.log(e.message);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

  &__icon {
    width: 1.5rem;
    margin: 0 1rem;
  }

  &__logo {
    width: 4rem;
  }

  &__sign-out-btn {
    background: none;
    border: none;
    color: #74C0FC;
  }
}

</style>
