<template>
  <section class="table-container">
    <h1>Tables</h1>
    {{ randomAvatarImage }}
    <modal v-if="!user.displayName && showModal" @close="showModal = false">
      <h3 slot="header">Set your display name</h3>
      <div slot="body" class="display-name__body">

        <label for="display-name" class="display-name__body--label">
          <span>Display Name</span>
          <input class="display-name__body--input" type="text" name="display-name" id="display-name" v-model="displayName">
        </label>
        <button class="display-name__body--button" @click="addUsername">Set</button>

      </div>
    </modal>
  </section>
</template>

<script>
import firebase from 'firebase';
import Modal from '@/components/Modal';
import { avatarImagesURL } from '@/assets/avatar-images.js';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      user: null,
      displayName: null,
      showModal: true,
    };
  },
  computed: {
    randomAvatarImage() {
      return avatarImagesURL[Math.floor(Math.random() * avatarImagesURL.length)];
    },
  },
  methods: {
    addUsername() {
      this.user.updateProfile({
        displayName: this.displayName,
        photoURL: this.randomAvatarImage,
      });

      this.user.photoURL = this.randomAvatarImage;

      const userData = {
        displayName: this.displayName,
        photoURL: this.user.photoURL,
      };

      this.$emit('set-display-name', userData);
      this.showModal = false;
    },
  },
  created() {
    this.user = firebase.auth().currentUser;
  },
};
</script>

<style lang="scss" scoped>

.table-container {
    background: #EFEEEE;
    min-height: calc(100vh - 96px);
}

.display-name {
  &__body {
    &--label {
      display: flex;
      flex-direction: column;

      span {
        margin: 0 0 0.5rem 1rem;
      }
    }

    &--input {
      background: #f8f9fa;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      padding: 1rem 1.5rem;
      width: 13rem;
      margin-bottom: 0.5rem;
    }

    &--button {
      background: #74C0FC;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      width: 16.5rem;
      height: 3.25rem;
      color: #fff;
      margin: 1rem 0;
    }
  }
}
</style>
