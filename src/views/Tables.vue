<template>
  <section class="table-container">
    <h1>Main Dining Room</h1>
    <br>
    <h3>occupied tables: <b style="color: red;">{{ occupiedTables }}</b> | empty tables: <b  style="color: green">{{ emptyTables }}</b></h3> 
    <br>
    <div class="column" v-for="table in tables" :key="table.id">
      <div class="table"  @click="hostTable(table.id, user.displayName)">
        <div>
          <span v-if="table.isOpen" class="green-dot" />
          <span v-else class="red-dot" />
          <b>&nbsp;{{ table.id }}</b>
        </div>
        <div>{{ table.serverId }}</div>
      </div>
    </div>
    <modal v-if="tableModal" @close="tableModal = false">
      <h3 slot="header">Would you like to remove yourself from the table?</h3>
      <div slot="body" class="display-name__body">
        <button class="display-name__body--button" @click="removeHost()">Confirm</button>
      </div>
    </modal>  

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
    hostTable(tableId, serverName){
      if (this.tableId == ''){
        this.toggleTable = false;
        this.tableId = tableId;
      }
      else if (this.tableId == tableId){
        this.tableModal = true;
      } 
      else {
        this.tableId = tableId;
        this.toggleTable = false;
      }
      
      firebase
        .firestore()
        .collection('tables')
        .doc(tableId)
        .update({
          isOpen: this.toggleTable,
          serverId: serverName,
        });
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
h1 {
  font-size: 3em;
  text-align: center;
}
h3 {
  font-size: 2em;
  text-align: center;
}
.red-dot{
  height: 25px;
  width: 25px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
}
.green-dot{
  height: 25px;
  width: 25px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
}
.column {
  float: left;
  width: 25%;
  padding: 0 10px;
}
@media screen and (max-width: 600px) {
  .column {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }
}

/* Clear floats after the columns */
.table-container:after {
  content: "";
  display: table;
  clear: both;
}

.table-container {
    background: #EFEEEE;
    min-height: calc(100vh - 96px);
}

.table {
  height: 100px;
  display: block;
  border-radius: 10px;
  background:#EFEEEE;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 16px;
  text-align: center;
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
