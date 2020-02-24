<template>
  <section class="menu-container">
    <h1>Menu</h1>
    <ul v-for="menuType in restaurant.menu" :key="menuType.id">
      <li>
        {{ menuType.title }}
      </li>
      <li v-for="item in menu.menuItems" :key="item.id">
        <div>
          {{ item.name }}
          {{ item.price }}
        </div>
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
  }
</style>
