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
        <span class="menu-nav__link" @click="showFood = true, showDrink = false" :class="{ active: showFood }">Food</span>
        <span class="menu-nav__link" @click="showDrink = true, showFood = false" :class="{ active: showDrink }">Drink</span>
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
          <span class="menu-item-wrapper__card--price">${{ item.price.toFixed(2) }}</span>
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
          <span class="menu-item-wrapper__card--price">${{ item.price.toFixed(2) }}</span>
        </li>
      </ul>
    </main>

    <aside class="menu-order">
      <h2 class="menu-order__title">Order Number
        <span class="menu-order__title--number">#{{ orderNumber }}</span>
      </h2>

      <div class="order-items-container">
        <transition-group name="slide-up" tag="ul" appear class="order-items-wrapper" v-for="(item, itemIndex) in order" :key="itemIndex">
          <li class="order-item" @click="openModificationModal(item, itemIndex)" :key="itemIndex">
            <span class="order-item__name">{{ item.name }}</span>
            <span class="order-item__price">{{ item.price.toFixed(2) }}</span>
          </li>
          <span class="order-item__modification" :key="itemIndex + 1">{{ item.modifications }}</span>
        </transition-group>
      </div>

      <ul class="order-total">
        <li class="order-total__text"><span class="order-total__text--label">Subtotal: </span>{{ subTotal }}</li>
        <li class="order-total__text"><span class="order-total__text--label">Tax: </span>{{ tax }}</li>
        <li class="order-total__text"><span class="order-total__text--label">Total: </span>{{ total }}</li>
      </ul>

      <div class="button-group">
        <button class="order-button review-button" @click="reviewOrder()">Review Order</button>
        <button class="order-button send-button">Send</button>
      </div>
    </aside>

    <modal v-if="modifyModal" @close="modifyModal = false" class="menu-modal">
      <h3 slot="header" class="menu-modal__header">
        How would you like to modify <span class="menu-modal__item-name">{{ itemName }}</span>?
      </h3>
      <div slot="body" class="menu-modal-body">
        <button class="modal-button modal-button__remove"  @click="deleteItemOffOrder()">Remove</button>
        <label for="modify-item" class="menu-modal-body__form-group">
          <span class="menu-modal-body__form-group--label">Modification</span>
          <input class="menu-modal-body__form-group--input" type="text" name="modify-item" id="modify-item" v-model="modifiedItem" placeholder="Add modification">
        </label>

        <div class="menu-modal__button-group">
          <button class="modal-button modal-button__add-mod" :disabled="!modifiedItem" @click="modifyItem()">Add Mod</button>
          <button class="modal-button modal-button__remove-mod" @click="deleteModification()">Remove Mod</button>
        </div>
      </div>
    </modal>

  </section>
</template>

<script>
import firebase from 'firebase';
import { pickBy } from 'lodash';
import Modal from '@/components/Modal';
import Calculator from '@/components/Calculator';

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
      tableId: 'Menu',
      tables: [],
      totalCost: 0,
      addButton: true,
      modifyModal: false,
      modifiedItem: '',
      itemIndex: 0,
      filteredTableList: [],
      tableData: [],
      orderNumber: 110,
      itemName: '',
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
    tax() {
      return (this.subTotal * 0.13).toFixed(2);
    },
    subTotal() {
      let total = 0;
      this.order.forEach((item) => {
        total += item.price;
      });
      return total.toFixed(2);
    },
    total() {
      return (this.subTotal * 1.13).toFixed(2);
    },
  },
  methods: {
    reviewOrder(){
      const tableId = this.tableId;
      this.$router.push({ path: '/review', query: { tableId } });
    },
    populateOrdersFromTable(e){
      this.getOrderFromTables();
    },
    deleteItemOffOrder(){
      const arraysAreEmpty = this.order === null && this.modifications === null;
      if (arraysAreEmpty){
        alert('Order is empty');
      }
      else {
        this.order.splice(this.itemIndex, 1);
        this.modifyModal = false;
        firebase
          .firestore()
          .collection('tables')
          .doc(this.tableId)
          .update({
            order: this.order,
          });
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
      const routeIsNull = this.$route.query.tableId === null;
      if (routeIsNull){
        this.tables = '';
      }
      if (gotValueFromRoute){
        this.tableId = this.$route.query.tableId.toString();
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
    openModificationModal(item, itemIndex){
      this.itemName = item.name;
      this.itemIndex = itemIndex;
      this.modifiedItem = '';
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
      this.orderNumber = resSnap.data().orderNumber;
      if (this.order !== null){
        for (const orders of resSnap.data().order){
          this.order.push(orders);
        }
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
          const serverOwnsTable = doc.data().serverId == this.user.displayName;
          if (serverOwnsTable){
            this.tables.push(doc.id);
          }
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
    this.getOrderFromTables();
    this.user = firebase.auth().currentUser;
  },
};
</script>
<style lang="scss" src="./Menu.scss" scoped />
