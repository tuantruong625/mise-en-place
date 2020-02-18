<template>
  <section class="table-container">
    <h1>Main Dining Room</h1>
    occupied tables: {{ occupiedTables }} || empty tables: {{ emptyTables }}
    <div v-for="table in tables" :key="table.id">
      <pre> 
            <code>
            <div class="table"  @click="hostTable(table.id, user.displayName)">
              {{ table.id }}
              {{ table.serverId }}
            </div>
            </code>

            </pre>
    </div>
    <!-- <modal v-if="tableModal" @close="tableModal = false">
      <h3 slot="header">Would you like to remove yourself from the table?</h3>
      <div slot="body" class="display-name__body">
        <button class="display-name__body--button" @click="">Confirm</button>
      </div>
    </modal>   -->

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
      serverName: null,
      occupiedTables: 0,
      emptyTables: 0,
      toggleTable: true,
      toggleName: '',
    };
  },
  methods: {
    tableCount(){
      this.occupiedTables =  0;
      this.emptyTables = 0;
      for (var i=0; i<this.tables.length; i++){
        if (this.tables[i].isOpen == true){
          this.emptyTables++;
        }
        else if (this.tables[i].isOpen == false){
          this.occupiedTables++;
        }
      }
    },
    hostTable(tableId, serverName){
      this.serverName = serverName;
      this.toggleTable = !this.toggleTable;
      if (this.toggleTable == false){
        this.toggleName = serverName;
      }
      else {
        this.tableModal = true;
        this.toggleName = '';
      } 
      firebase
        .firestore()
        .collection('tables')
        .doc(tableId)
        .update({
          isOpen: this.toggleTable,
          serverId: this.toggleName,
        });
      this.tableCount();
    },
    addUsername() {
      this.user.updateProfile({
        displayName: this.displayName,
      });
      this.$emit('set-display-name', this.displayName);
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
    background: #EFEEEE;
    min-height: calc(100vh - 96px);
}

.table {
  border-radius: 10px;
  background:#EFEEEE;
  border: 15px solid #EFEEEE;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 50px;
  margin: 20px;
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
