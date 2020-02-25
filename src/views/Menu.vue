<template>
  <section class="menu-container">
    <header class="menu-header">
      <h1 class="menu-header__title">Menu</h1>

      <nav class="menu-nav">
        <span class="menu-nav__link">Food</span>
        <span class="menu-nav__link">Drink</span>
      </nav>
    </header>

    <ul class="menu-item-container" v-for="menu in restaurant.menu" :key="menu.id">
      <li class="menu-item-container__title">{{ menu.title }}</li>

      <li class="menu-item-card" v-for="item in menu.menuItems" :key="item.id">
        <span class="menu-item-card__name">{{ item.name }}</span>
        <span class="menu-item-card__price">${{ item.price }}</span>
      </li>
    </ul>

  </section>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'Menu',
  data() {
    return {
      restaurant: {},
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
  },
  created() {
    this.getRestaurantData('foodMenu').then(response => {
      this.restaurant = response;
    });
  },
};
</script>

<style lang="scss" scoped>
  .menu-container {
    background: #EFEEEE;
    min-height: calc(100vh - 96px);
    color: #495057;
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
    margin: 1rem 5rem;
    display: grid;
    grid-gap: 1.5rem;
    justify-items: center;
    grid-template-columns: auto auto auto;
    // grid-template-areas: "header header header";

    &__title {
      margin-right: auto;
      font-size: 1.25rem;
      grid-column: 1 / span 3;
      // grid-area: header;
    }
  }

  .menu-item-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #EFEEEE;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    width: 100%;
    height: 60px;

    &__name {
      margin-left: 1rem;
      text-transform: capitalize;
    }

    &__price {
      margin-right: 1rem;
    }

  }
</style>
