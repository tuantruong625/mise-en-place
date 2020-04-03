<template>
  <section class="table-container">
    <header class="table-header">
      <h1 class="table-header__title +text-primary">Main Dining Room</h1>
      <p class="table-header__details">
        Occupied tables: <span class="table-header__details--occupied">{{ occupiedTables }}</span>
        | Empty tables: <span class="table-header__details--empty">{{ emptyTables }}</span>
      </p>
    </header>

    <main class="table-main">
      <div class="card" v-for="table in tables" :key="table.id" @click="assignTable(table.id, user.displayName, table)">
        <dl class="card-details">
          <dt :class="{ 'card-details__title-open' : table.isOpen, 'card-details__title-occupied' : !table.isOpen  }">{{ table.id }}</dt>
          <dd class="card-details__server">
            <img class="card-details__server--image" :src="avatarImagePlaceholder" alt="Avatar image for servers">
            {{ table.serverId }}
          </dd>
        </dl>
      </div>
    </main>

    <aside class="message-board">
      <h2 class="message-board__title">Message Board</h2>
      <div v-for="message in messages" :key="message.id" >
        <dl class="message">
          <dd class="message__text">
            {{ message.message }}
          </dd>
          <dd class="message__date-time">
            {{ message.messageDateTime.toDate().toString().slice(0, 21) }}
          </dd>
        </dl>
      </div>
    </aside>

    <modal v-if="!user.displayName && showModal" @close="showModal = false">
      <h3 slot="header">Set your display name</h3>
      <div slot="body" class="display-name__body">

        <label for="display-name" class="display-name__body--label">
          <span>Display Name</span>
          <input class="display-name__body--input" type="text" name="display-name" id="display-name" v-model="displayName">
        </label>
        <button class="display-name__body--button" :disabled="!displayName" @click="addUsername">Set</button>
      </div>
    </modal>
  </section>
</template>

<script>
import firebase from 'firebase';
import Modal from '@/components/Modal';
import { avatarImagesURL } from '@/assets/avatar-images.js';
import { pickBy } from 'lodash';

// register the plugin on vue
import Vue from 'vue';
import Toasted from 'vue-toasted';
Vue.use(Toasted);
// you can also pass options, check options reference below
Vue.use(Toasted);

export default {
  components: {
    Modal,
  },
  data() {
    return {


      //---------------------------------------------
      user: null,
      displayName: null,
      showModal: true,
      tableModal: false,
      tables: [],
      toggleDot: 'green-dot',
      serverName: null,
      occupiedTables: 0,
      emptyTables: 0,
      toggleTable: true,
      toggleName: '',
      tableId: '',
      messages: [],
    };
  },
  computed: {
    randomAvatarImage() {
      return avatarImagesURL[Math.floor(Math.random() * avatarImagesURL.length)];
    },
    avatarImagePlaceholder() {
      return 'https://firebasestorage.googleapis.com/v0/b/mise-en-place-3331f.appspot.com/o/avatar-images%2F021-beverage.svg?alt=media&token=f95ed5a7-0ee1-4aff-b51f-0315c4356817';
    },
  },
  methods: {
    tableCount(){
      const emptyTablesCount = this.tables.filter(table => table.isOpen).length;
      const occupiedTablesCount = this.tables.filter(table => !table.isOpen).length;
      this.occupiedTables =  occupiedTablesCount;
      this.emptyTables = emptyTablesCount;
    },
    removeHost(){
      this.tableModal = false;
      this.toggleTable = true;
      firebase
        .firestore()
        .collection('tables')
        .doc(this.tableId)
        .update({
          isOpen: true,
          serverId: '',
        });
      this.tableCount();
      this.tableId = '';
    },
    assignTable(tableId, userId, table){
      const tableIsYours = userId === table.serverId;
      const tableIsTaken = userId !== table.serverId;
      const tableIsEmpty = table.serverId === '';

      if (tableIsEmpty){
        let myToast = this.$toasted.show(userId +', you have booked table ' + tableId, {
          theme: 'outline', 
          position: 'top-center', 
          duration : 2000,
        });
        firebase
          .firestore()
          .collection('tables')
          .doc(tableId)
          .update({
            isOpen: false,
            serverId: userId,
          });
      }

      else if (tableIsTaken){
        let myToast = this.$toasted.show('Table ' + tableId + ' has been assigned to ' + table.serverId, {
          theme: 'outline', 
          position: 'top-center', 
          duration : 2000,
        });
        return;
      }

      else if (tableIsYours){
        let loadingToast = this.$toasted.show('Loading...',{
          theme: 'outline', 
          position: 'top-center', 
          duration : 1600,
        });
        this.$router.push({ path: '/menu', query: { tableId } });
      }

      if (this.user != null) {
        this.user.providerData.forEach(function(userId) {
        });
      }
      this.tableCount();
    },
    addUsername() {
      this.user.updateProfile({
        displayName: this.displayName,
        photoURL: this.randomAvatarImage,
      });

      this.user.photoURL = this.randomAvatarImage;

      const profileData = {
        displayName: this.displayName,
        photoURL: this.user.photoURL,
      };

      this.$emit('set-profile-data', profileData);
      this.showModal = false;
    },
    async getTables() {
      let tablesRef = await firebase
        .firestore()
        .collection('tables');
      tablesRef.onSnapshot(snap => {
        this.tables = [];
        snap.forEach(doc => {
          let table = doc.data();
          table.id = doc.id;
          this.tables.push(table);
        });
        this.tableCount();
      });
    },
    async getMessageBoard() {
      let tablesRef = await firebase
        .firestore()
        .collection('messages');
      tablesRef.onSnapshot(snap => {
        this.messages = [];
        snap.forEach(doc => {
          let message = doc.data();
          message.id = doc.id;
          this.messages.push(message);
        });
      });
    },
  },

  created() {
    this.user = firebase.auth().currentUser;
    this.getTables();
    this.getMessageBoard();
  },
};
</script>

<style lang="scss" scoped src="./Tables.scss"></style>
