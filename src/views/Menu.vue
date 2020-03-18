<template>
  <section class="menu-container">
    <header class="menu-header">
      <div class="menu-header-left">
        <h1 class="menu-header__title">Table</h1>
        <select class="menu-header-select" v-model="tableId" @change="populateOrdersFromTable($event)">
          <option class="menu-header-select__item" v-for="table in tables" :key="table.id">
            {{ table }}
          </option>
        </select>

      </div>
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
      <h2 class="menu-order__title">Order Number
        <span class="menu-order__title--number">#12312</span>
      </h2>

      <div class="order-items-container">
        <transition-group name="slide-up" tag="ul" appear class="order-items-wrapper" v-for="(item, itemIndex) in order" :key="itemIndex">
          <li class="order-item" @click="openModificationModal(itemIndex)" :key="itemIndex">
            <span class="order-item__name">{{ item.name }}</span>
            <span class="order-item__price">${{ item.price }}</span>
          </li>
          <span class="order-item__modification" :key="itemIndex + 1">{{ item.modifications }}</span>
        </transition-group>
      </div>

      <ul class="order-totals">
        <li>Total</li>
      </ul>

      
      <button class="display-name__body--button"  >Send</button>
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
        <button class="display-name__body--button"  @click="deleteItemOffOrder()">Delete</button>
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
      filteredTableList: [],
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
    filterTableList(){
      // eslint-disable-next-line no-console
      console.log(this.tables);
    },
    populateOrdersFromTable(e){
      this.getOrderFromTables();
    },
    deleteItemOffOrder(){
      const arraysAreEmpty = this.order ==null&&this.modifications==null;
      if (arraysAreEmpty){
        alert('Order is empty');
      }
      else {
        this.order.splice(this.itemIndex, 1);
        this.modifyModal = false;
      }

    },
    deleteModification(){
      this.modifiedItem = '';
      this.order[this.itemIndex].modifications = this.modifiedItem;
      this.modifyModal=false;
      firebase
        .firestore()
        .collection('tables')
        .doc(this.tableId)
        .update({
          order: this.order,
        });
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
      this.order[this.itemIndex].modifications = this.modifiedItem;
      this.modifyModal=false;

      firebase
        .firestore()
        .collection('tables')
        .doc(this.tableId)
        .update({
          order: this.order,
        });

    },
    openModificationModal(itemIndex){
      this.itemIndex = itemIndex;
      this.modifyModal=true;
    },
    highlighted(item) {
      item.isHighlighted = !item.isHighlighted;
      this.order.push(item);

      setTimeout(() => {
        item.isHighlighted = false;
      }, 1000);

      firebase
        .firestore()
        .collection('tables')
        .doc(this.tableId)
        .update({
          order: this.order,
        });
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
    this.filterTableList();
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
      font-size: 1.5rem;
      color: #495057;
    }
  }

  .menu-header-left {
    display: flex;
    align-items: center;
  }

  .menu-header-select {
    height: 2rem;
    width: 5rem;
    overflow: hidden;
    margin-left: 0.5rem;
    background: #EFEEEE;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    color: #76c9ba;
    font-weight: 600;
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
      transition: all .2s;
    }

    &__card:hover {
      transform: translateY(-3px);
      box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
      transition: all .2s;
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
    background: #EFEEEE;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    margin: 1.5rem;
    padding: 1.5rem;

    &__title {
      font-size: 1.5rem;
      color: #495057;

      &--number {
        color: #76c9ba;
      }
    }
  }

  .order-items-container {
    height: 30rem;
    overflow: scroll;
  }

  .order-items-wrapper {
    margin: 1rem 0;
    /*border: 1px solid blue;*/
    text-transform: capitalize;
    list-style: circle;

  }

  .order-item {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem;

    &__price {
      margin-left: auto;
    }

    &__modification {
      padding-left: 1rem;
      text-transform: none;
      font-style: italic;
    }
  }

  .order-totals {
    border-top: 1px solid #495057;
  }
</style>
