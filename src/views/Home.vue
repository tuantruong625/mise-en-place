<template>
  <div class="home">
    <nav class="nav">
      <div class="nav__logo">
        <img class="nav__logo--image" src="../assets/MPicon_blue.svg" alt="Logo">
        <span class="nav__logo--text">Mise en place</span>
      </div>

      <div class="nav__links">
        <router-link to="/tables"><img class="nav__icon" src="../assets/chair-solid.svg" alt=""></router-link>
        <router-link to="/menu"><img class="nav__icon" src="../assets/utensils-solid.svg" alt=""></router-link>
      </div>

      <div class="nav__profile">
        <img class="nav__profile--avatar-image" :src="avatarImage" alt="Avatar Image">
        <span class="nav__profile--display-name">{{ user.displayName }} |</span>
        <button class="nav__sign-out-btn" @click="signout">Logout</button>
      </div>
    </nav>
    <router-view @set-profile-data="setProfileData"/>
  </div>
</template>

<script>
import firebase from 'firebase';
import { avatarImagesURL } from '@/assets/avatar-images.js';

export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    this.user = firebase.auth().currentUser;
  },
  computed: {
    avatarImage() {
      return this.user.photoURL || this.randomAvatarImage;
    },
    randomAvatarImage() {
      return avatarImagesURL[Math.floor(Math.random() * avatarImagesURL.length)];
    },
  },
  methods: {
    signout(e) {
      e.stopPropagation();
      firebase.auth().signOut().then(() => {
        this.$router.replace('/sign-in').catch(e => {});
      }).catch(err => {});

    },
    setProfileData(profileData) {
      this.user.displayName = profileData.displayName;
      this.user.photoURL = profileData.photoURL;
    },
  },
};
</script>
<style scoped lang="scss">
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  position: fixed;
  top: 0;
  width: 100%;

  &__icon {
    width: 1.5rem;
    margin: 0 1rem;
  }

  &__logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    &--image {
      width: 4rem;
    }

    &--text {
      margin-left: 0.5rem;
      font-size: 1.25rem;
    }
  }

  &__profile {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    &--display-name {
      font-size: 1.25rem;
      text-transform: capitalize;
    }

    &--avatar-image {
      width: 2rem;
      margin-right: 0.5rem;
      border-radius: 50%;
      border: 2px solid #282E72;
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    }
  }

  &__sign-out-btn {
    background: none;
    border: none;
    color: #282E72;
  }
}
</style>
