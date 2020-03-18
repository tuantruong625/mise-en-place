<template>
  <section class="menu-container">
    <header class="menu-header">
      <h1 class="menu-header__title">Menu</h1>
      <select v-model="tableId" @change="populateOrdersFromTable($event)">
        <option v-for="table in tables" :key="table.id">
          {{ table }}
        </option>
      </select>

      <nav class="menu-nav">
        <span class="menu-nav__link"><a href="#food" @click="showFood = true, showDrink = false">Food</a></span>
        <span class="menu-nav__link"><a href="#drinks" @click="showDrink = true, showFood = false">Drink</a></span>
      </nav>
    </header>

    <main class="menu-items">
      <div v-show="showFood" class="menu-items__header">
        <span v-for="menu in restaurant.menu" :key="menu.id">
          <span class="menu-items__header--link" :class="{ active: activeHeader(menu.title) }" @click="selectedHeader(menu.title)">{{ menu.title }}</span>
        </span>
      </div>

      <ul v-show="showFood" class="menu-item-wrapper" v-for="menu in filteredList" :key="menu.id">
        <li class="menu-item-wrapper__card" v-for="item in menu.menuItems" :key="item.id" @click="highlighted(item)" :class="{ 'highlighted' : item.isHighlighted  }">
          <span class="menu-item-wrapper__card--name" >{{ item.name }}</span>
          <span class="menu-item-wrapper__card--price">${{ item.price }}</span>
        </li>
      </ul>

      <div v-show="showDrink" class="menu-items__header">
        <span v-for="menu in drinks.menu" :key="menu.id">
          <span class="menu-items__header--link" :class="{ active: activeHeader(menu.title) }" @click="selectedHeader(menu.title)">{{ menu.title }}</span>
        </span>
      </div>

      <ul v-show="showDrink" class="menu-item-wrapper" v-for="menu in filteredDrinkList" :key="menu.id">
        <li class="menu-item-wrapper__card" v-for="item in menu.menuItems" :key="item.id" @click="highlighted(item)" :class="{ 'highlighted' : item.isHighlighted  }">
          <span class="menu-item-wrapper__card--name">{{ item.name }}</span>
          <span class="menu-item-wrapper__card--price">${{ item.price }}</span>
        </li>
      </ul>
    </main>

    <aside class="menu-order">
      <h2>Order Number #12312</h2>
      <button class="display-name__body--button"  @click="deleteItemOffOrder()">Delete</button>
      <button class="display-name__body--button"  @click="sendOrder()">Send</button>
      <ul v-for="(item, itemIndex) in order" :key="itemIndex">
        <li class="card" @click="openModificationModal(itemIndex)">
          <span class="menu-item-wrapper__card--name">{{ item.name }}</span>
          <span class="menu-item-wrapper__card--price">${{ item.price }}</span>
          <span class="menu-item-wrapper__card--price">{{ modifications[itemIndex] }}</span>
        </li>
      </ul>
    </aside>
    <modal v-if="modifyModal" @close="modifyModal = false">
      <h3 slot="header">What would you like to modify?</h3>
      <div slot="body" class="display-name__body">

        <label for="display-name" class="display-name__body--label">
          <span>Modification</span>
          <input class="display-name__body--input" type="text" name="modify-item" id="modify-item" v-model="modifiedItem">
        </label>
        <button class="display-name__body--button" :disabled="!modifiedItem" @click="modifyItem()">Add Modification</button>
        <button class="display-name__body--button" @click="deleteModification()">Delete Modification</button>
      </div>
    </modal>
  </section>
</template>

<script>
import firebase from 'firebase';
import { pickBy } from 'lodash';
import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
  },
  name: 'Menu',
  data() {
    return {
      user: null,
      restaurant: {},
      showFood: true,
      showDrink: false,
      drinks: {},
      search: 'Appetizers',
      order: [],
      tableId: 'Menu',//this.$route.query.tableId.toString(),
      tables: [],
      totalCost: 0,
      addButton: true,
      modifyModal: false,
      modifiedItem: '',
      itemIndex: 0,
      modifications: [],
    };
  },
  watch: {
    showDrink(value) {
      if (value) {
        this.search = 'Bottled Beer';
      }
    },
    showFood(value) {
      if (value) {
        this.search = 'Appetizers';
      }
    },
  },
  computed: {
    filteredList() {
      return pickBy(this.restaurant.menu, (value, key) => {
        return value.title === this.search;
      });
    },
    filteredDrinkList(){
      return pickBy(this.drinks.menu, (value, key) => {
        return value.title === this.search;
      });
    },
    defaultCategory() {
      return this.showFood ? 'Appetizers' : 'Beer Pint';
    },
  },
  methods: {
    populateOrdersFromTable(e){
      this.getOrderFromTables();
    },
    sendOrder(){
      const orderIsEmpty = this.order == null;
      const orderIsNotEmpty = this.order != null;
      if (orderIsEmpty){
        return;
      }

      if (orderIsNotEmpty){
        firebase
          .firestore()
          .collection('tables')
          .doc(this.tableId)
          .update({
            order: this.order,
          });
      }


    },
    deleteItemOffOrder(){
      const arraysAreEmpty = this.order ==null&&this.modifications==null;
      if (arraysAreEmpty){
        alert('Order is empty');
      }
      else {
        this.order.pop();
        this.modifications.pop();
      }

    },
    deleteModification(){
      this.modifiedItem = '';
      this.modifications[this.itemIndex] = this.modifiedItem;
      //this.order[this.itemIndex].modifications = this.modifiedItem;
      this.modifyModal=false;
    },
    getServerTable(){
      const gotValueFromRoute = this.$route.query.tableId != null;
      const routeIsNull = this.$route.query.tableId == null;
      if (routeIsNull){
        this.tables = '';
      }
      if (gotValueFromRoute){
        this.tableId = this.$route.query.tableId.toString();
        this.getOrderFromTables();
      }


    },
    modifyItem(){
      this.modifications[this.itemIndex] = this.modifiedItem;
      //this.order[this.itemIndex].modifications = this.modifiedItem;
      this.modifyModal=false;

    },
    openModificationModal(itemIndex){
      this.itemIndex = itemIndex;
      this.modifyModal=true;
    },
    highlighted(item) {
      // eslint-disable-next-line no-console
      console.log(item);
      item.isHighlighted = !item.isHighlighted;
      this.order.push(item);
      this.modifications.push('');

      // firebase
      //   .firestore()
      //   .collection('tables')
      //   .doc(this.tableId)
      //   .update({
      //     order: item,
      //   });
    },
    addToOrder(item) {
    },
    selectedHeader(header) {
      this.search = header;
    },
    activeHeader(header) {
      return this.search === header;
    },
    //get order data from tables
    async getOrderFromTables() {
      this.order = [];
      const resRef = firebase.firestore().collection('tables');
      const resSnap = await resRef.doc(this.tableId).get();
      for (const orders of resSnap.data().order){

        this.order.push(orders);
      }

    },
    // Get Table Names for Dropdown list
    async getTables() {
      let tablesRef = await firebase
        .firestore()
        .collection('tables');
      tablesRef.onSnapshot(snap => {
        this.tables = [];
        snap.forEach(doc => {
          this.tables.push(doc.id);
        });
      });
    },
    async getRestaurantData(resId) {
      let restaurant = {};

      // Get Restaurant Data
      const resRef = firebase.firestore().collection('restaurants');
      const resSnap = await resRef.doc(resId).get();
      restaurant = resSnap.data();
      restaurant.id = resSnap.id;

      // Get Restaurant Menu Types
      const menuTypesSnap = await resRef
        .doc(resId)
        .collection('menuTypes')
        .get();
      restaurant.menu = [];
      for (const menuTypeObj of menuTypesSnap.docs) {
        const menuType = menuTypeObj.data();
        menuType['menuItems'] = [];

        const menuItemsSanp = await menuTypeObj.ref
          .collection('menuItems')
          .get();
        for (const menuItem of menuItemsSanp.docs) {
          menuType['menuItems'].push(menuItem.data());
        }
        restaurant.menu.push(menuType);
      }
      return restaurant;
    },
    async getDrinkData(drinkId){
      let drinks = {};

      const resRef = firebase.firestore().collection('restaurants');
      const resSnap = await resRef.doc(drinkId).get();
      drinks = resSnap.data();
      drinks.id = resSnap.id;

      const menuTypesSnap = await resRef
        .doc(drinkId).collection('menuTypes').get();
      drinks.menu = [];
      for (const menuTypeObj of menuTypesSnap.docs){
        const menuType = menuTypeObj.data();
        menuType['menuItems'] = [];

        const menuItemsSnap = await menuTypeObj.ref
          .collection('menuItems').get();
        for (const menuItem of menuItemsSnap.docs){
          menuType['menuItems'].push(menuItem.data());
        }
        drinks.menu.push(menuType);
      }
      return drinks;
    },
  },
  created() {
    this.getTables();
    this.getServerTable();
    this.getRestaurantData('foodMenu').then(response => {
      this.restaurant = response;
    });
    this.getDrinkData('drinkMenu').then(response => {
      this.drinks = response;
    });
    this.user = firebase.auth().currentUser;
  },
};
</script>

<style lang="scss" scoped>
  .card {
    height: 50px;;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
  }
  .menu-container {
    min-height: calc(100vh - 96px);
    color: #495057;
    margin-top: 5.8rem;
    background-image: url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%2376c9ba' fill-opacity='0.1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    display: grid;
    grid-template-columns: auto auto 400px;
    grid-template-rows: 5rem auto;
    grid-template-areas:
    "header header order"
    "items items order";
  }

  .menu-header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

    &__title {
      font-size: 1.25rem;
      color: #adb5bd;
    }
  }

  .menu-nav {
    &__link a {
      color: #495057;
      text-decoration: none;
      margin: 0 0.25rem;
    }
  }

  .menu-items {
    display: grid;
    grid-template-rows: 2rem auto 5rem;
    grid-area: items;


    &__header {
      display: flex;
      justify-content: space-around;

      &--link {
        font-size: 1.25rem;
        cursor: pointer;
        color: #ced4da;
      }
    }
  }

  .menu-item-wrapper {
    display: grid;
    align-self: start;
    grid-template-columns: auto auto;

    &__card {
      justify-self: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem;
      padding: 0 1rem;
      background: #EFEEEE;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      width: 250px;
      height: 60px;
      border-left: 5px solid transparent;
      cursor: pointer;
      user-select: none;
    }
  }

  .active {
    text-decoration: underline #76c9ba;
    color: #495057;
  }

  .highlighted {
    border-left: 5px solid #73c9ba;
  }

  .menu-order {
    grid-area: order;
    border: 1px solid green;
    background: #EFEEEE;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    margin: 1.5rem;
  }
</style>
