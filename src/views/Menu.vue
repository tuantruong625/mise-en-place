<template>
  <section class="menu-container">
    <header class="menu-header">
      <h1 class="menu-header__title">Menu</h1>
      <h1>{{ tableId }}  HELLOOOOO</h1>

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
        <li class="menu-item-wrapper__card" v-for="item in menu.menuItems" :key="item.id" @click="highlighted(item)">
          <span class="menu-item-wrapper__card--name">{{ item.name }}</span>
          <span class="menu-item-wrapper__card--price">${{ item.price }}</span>
        </li>
      </ul>

      <div v-show="showDrink" class="menu-items__header">
        <span v-for="menu in drinks.menu" :key="menu.id">
          <span class="menu-items__header--link" :class="{ active: activeHeader(menu.title) }" @click="selectedHeader(menu.title)">{{ menu.title }}</span>
        </span>
      </div> 

      <ul v-show="showDrink" class="menu-item-wrapper" v-for="menu in filteredDrinkList" :key="menu.id">
        <li class="menu-item-wrapper__card" v-for="item in menu.menuItems" :key="item.id">
          <span class="menu-item-wrapper__card--name">{{ item.name }}</span>
          <span class="menu-item-wrapper__card--price">${{ item.price }}</span>
        </li>
      </ul>

      <div class="button-wrapper">
        <button class="action-button increment-button">+</button>
        <span class="action-button quantity">0</span>
        <button class="action-button decrement-button">-</button>
        <button class="action-button modification-button">Modification</button>
        <button class="action-button add-button">Add</button>
      </div>
    </main>

    <aside class="menu-order">
      <h2>Order Number #12312</h2>
    </aside>
  </section>
</template>

<script>
import firebase from 'firebase';
import { pickBy } from 'lodash';

export default {
  name: 'Menu',
  data() {
    return {
      user: null,
      restaurant: {},
      showFood: true,
      showDrink: false,
      drinks: {},
      search: 'Appetizers',
      isHighlighted: false,
      order: [],
      tableId: this.$route.query.tableId.toString(),
    };
  },
  watch: {
    showDrink(value) {
      if (value) {
        this.search = 'Beer Pint';
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
    highlighted(item) {
    
    },
    addToOrder(item) {
      this.order.push(item);
    },
    selectedHeader(header) {
      this.search = header;
    },
    activeHeader(header) {
      return this.search === header;
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
    }
  }

  .active {
    text-decoration: underline #76c9ba;
    color: #495057;
  }

  .button-wrapper {
    align-self: end;
    justify-self: center;
    margin-bottom: 1rem;
    box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    border-radius: 20px;
  }

  .action-button {
    height: 2.5rem;
    background: #EFEEEE;
    border: none;
    color: #73c9ba;
  }

  .increment-button {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    color: #73c9ba;
  }

  .quantity {
    color: #868E96;
  }

  .decrement-button {

  }

  .modification-button {
    color: #73c9ba;

  }

  .add-button {
    background: #73c9ba;
    color: #EFEEEE;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
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