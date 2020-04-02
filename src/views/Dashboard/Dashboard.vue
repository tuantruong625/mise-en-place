<template>
  <div class="home">
    <nav class="nav">
      <div class="nav__logo">
        <img class="nav__logo--image" src="../../assets/MPicon_blue.svg" alt="Logo">
        <span class="nav__logo--text">Mise en place</span>
      </div>

      <div class="nav__links">
        <router-link to="/tables"><img class="nav__icon" src="../../assets/chair-solid.svg" alt="tables"></router-link>
        <router-link to="/menu"><img class="nav__icon" src="../../assets/utensils-solid.svg" alt="menu" @click="LoadToastMsg()"></router-link>
        <span><img class="nav__icon" src="../../assets/calculator.png" alt="calculator" @click="viewCalculator" style="cursor: pointer;"></span>
      </div>

      <div class="nav__profile">
        <img class="nav__profile--avatar-image" :src="avatarImage" alt="Avatar Image">
        <span class="nav__profile--display-name">{{ user.displayName }} |</span>
        <button class="nav__sign-out-btn" @click="signout">Logout</button>
      </div>
    </nav>
    <router-view @set-profile-data="setProfileData"/>

    <calculator
      v-show="showCalculator"
      @close="closeCalculator"
    />
  </div>
</template>


<script>
import firebase from 'firebase';
import { avatarImagesURL } from '@/assets/avatar-images.js';
import Calculator from '@/components/Calculator/Calculator';

export default {
  components:{
    Calculator,
  },
  data() {
    return {
      user: null,
      showCalculator: false,
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
    LoadToastMsg(){
      let loadingToast = this.$toasted.show('Loading...',{
        theme: 'toasted-primary', 
        position: 'bottom-left', 
        duration : 1600,
      });
    },
    viewCalculator(){
      this.showCalculator = true;
    },
    closeCalculator(){
      this.showCalculator = false;
    },
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
<style scoped lang="scss" src="./Dashboard.scss"></style>
