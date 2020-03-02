<template>
  <section class="menu-container">
    <header class="menu-header">
      <h1 class="menu-header__title">Menu</h1>

      <nav class="menu-nav">
        <span class="menu-nav__link"><a href="#food" @click="showFood = true, showDrink = false">Food</a></span>
        <span class="menu-nav__link"><a href="#drinks" @click="showDrink = true, showFood = false">Drink</a></span>
      </nav>
    </header>
    <div v-show="showFood">
      <ul class="menu-item-container" v-for="menu in restaurant.menu" :key="menu.id">
        <li class="menu-item-container__title">{{ menu.title }}</li>

        <li class="menu-item-card" v-for="item in menu.menuItems" :key="item.id">
          <span class="menu-item-card__name">{{ item.name }}</span>
          <span class="menu-item-card__price">${{ item.price }}</span>
        </li>
      </ul>
    </div>

    <div v-show="showDrink">
      <ul class="menu-item-container" v-for="menu in drinks.menu" :key="menu.id">
        <li class="menu-item-container__title">{{ menu.title }}</li>

        <li class="menu-item-card" v-for="item in menu.menuItems" :key="item.id">
          <span class="menu-item-card__name">{{ item.name }}</span>
          <span class="menu-item-card__price">${{ item.price }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'Menu',
  data() {
    return {
      restaurant: {},
      showFood: true,
      showDrink: false,
      drinks: {},
    };
  },
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
  .menu-container {
    min-height: calc(100vh - 96px);
    color: #495057;
    margin-top: 5.8rem;
    background-image: url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%2376c9ba' fill-opacity='0.1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .menu-header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 0.25rem;
    padding-top: 2rem;

    &__title {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }

  .menu-nav {
    margin: 1rem 0;
    &__link {
      margin: 0 0.5rem;
    }
  }

  .menu-item-container {
    margin: 1rem;
    display: grid;
    grid-template-areas:
    "header header header";

    &__title {
      margin-right: auto;
      font-size: 1.25rem;
      grid-area: header;
    }
  }

  .menu-item-card {
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

    &__name {
      text-transform: capitalize;
    }

    &__price {

    }
  }
</style>
