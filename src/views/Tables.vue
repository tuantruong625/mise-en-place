<template>
  <section class="table-container">
    <header class="table-header">
      <h1 class="table-header__title">Main Dining Room</h1>
      <p class="table-header__details">
        Occupied tables: <span class="table-header__details--occupied">{{ occupiedTables }}</span>
        | Empty tables: <span class="table-header__details--empty">{{ emptyTables }}</span>
      </p>
    </header>

    <main class="table-main">
      <div class="card" v-for="table in tables" :key="table.id" @click="hostTable(table.id, user.displayName, table)">
        <dl class="card-details">
          <dt :class="{ 'card-details__title-open' : table.isOpen, 'card-details__title-occupied' : !table.isOpen  }">{{ table.id }}</dt>
          <dd class="card-details__server">
            <!-- Replace avatarImagePlaceholder with user.photoURL -->
            <img class="card-details__server--image" :src="avatarImagePlaceholder" alt="Avatar image for servers">
            {{ table.serverId }}
          </dd>
        </dl>
      </div>
    </main>

    <!-- <modal v-if="tableModal" @close="tableModal = false">
      <h3 slot="header">Would you like to remove yourself from the table?</h3>
      <div slot="body" class="display-name__body">
        <button class="display-name__body--button" @click="removeHost()">Confirm</button>
      </div>
    </modal>   -->

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

export default {
  components: {
    Modal,
  },
  data() {
    return {
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
    hostTable(tableId, userId, table){
      const tableIsYours = userId == table.serverId;
      const tableIsTaken = userId != table.serverId;
      const tableIsEmpty = table.serverId == '';

      if (tableIsEmpty){
        firebase
          .firestore()
          .collection('tables')
          .doc(tableId)
          .update({
            isOpen: false,
            serverId: userId,
          });
      }

      if (tableIsTaken){
        return;
      }

      if (tableIsYours){
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
  },

  created() {
    this.user = firebase.auth().currentUser;
    this.getTables();
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  min-height: calc(100vh - 96px);
  margin-top: 5.8rem;
  color: #495057;
  background-image: url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%2376c9ba' fill-opacity='0.1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  display: grid;
  grid-template-areas:
  "header"
  "table-main";
  grid-template-rows: 5rem auto;
}

.table-header {
  grid-area: header;
  justify-self: center;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 1.25rem;
  }

  &__details {
    margin-top: 0.5rem;
    &--occupied {
      color: #FF6B6B;
    }

    &--empty {
      color: #2F9E44;
    }
  }
}

.card {
  width: 150px;
  height: 150px;
  background: #EFEEEE;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  justify-self: center;
  align-self: center;
}

.card-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  &__title-open {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    margin-top: auto;

    &::before {
      content: '';
      display: flex;
      margin-right: 0.25rem;
      margin-left: -0.16rem;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #F0F0F3;
      box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.7), inset -2px -2px 4px rgba(174, 174, 192, 0.2);
    }

    &::after {
      margin-left: auto;
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #2F9E44;
    }
  }

  &__title-occupied {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    margin-top: auto;

    &::before {
      content: '';
      display: flex;
      margin-right: 0.25rem;
      margin-left: -0.16rem;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #F0F0F3;
      box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.7), inset -2px -2px 4px rgba(174, 174, 192, 0.2);
    }

    &::after {
      margin-left: auto;
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #FE7373;
    }
  }

  &__server {
    display: flex;
    padding: 0.5rem;
    align-items: center;
    text-transform: capitalize;
    margin-top: auto;

    &--image {
      width: 1.25rem;
      margin-right: 0.25rem;
      border-radius: 100px;
      border: 1px solid #282E72;
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    }

  }
}

.table-main {
  grid-area: table-main;
  margin: 0 10rem 5rem 10rem;
  display: grid;
  grid-template-columns: auto auto auto auto;
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
    background: #282E72;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    width: 16.5rem;
    height: 3.25rem;
    color: #fff;
    margin: 1rem 0;
      &:disabled {
        background: #282E72;
        opacity: 75%;
      }
    }
  }
}

</style>
