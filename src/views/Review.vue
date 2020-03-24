<template>
  <section class="menu-container">
    <aside class="menu-order">
      <h2 class="menu-order__title">Order Number
        <span class="menu-order__title--number">#{{ orderNumber }}</span>
      </h2>

      <div class="order-items-container">
        <transition-group name="slide-up" tag="ul" appear class="order-items-wrapper" v-for="(item, itemIndex) in order" :key="itemIndex">
          <li class="order-item"  :key="itemIndex">
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
        <button class="order-button send-button" @click="backButton()">Edit</button>
        <button class="order-button print-button" @click="clearTable()">Print</button>
      </div>
    </aside>
  </section>
</template>
<script>
import firebase from 'firebase';
export default {
  data(){
    return {
      user: null,
      tableId: this.$route.query.tableId,
      order: [],
      orderNumber: 0,
      modifyModal: false,
    };
  },
  computed: {
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
  methods:{
    backButton(){
      const tableId = this.tableId;
      this.$router.push({ path: '/menu', query: { tableId } });
    },
    clearTable(){
      this.order = [];
      const clearServerId = '';
      const setTableOpen = true;
      if (this.orderNumber === 999){
        this.orderNumber = 0;
      }
      const orderNumberPush = this.orderNumber+1;

      firebase
        .firestore()
        .collection('tables')
        .doc(this.tableId)
        .update({
          order: this.order,
          serverId: clearServerId,
          isOpen: setTableOpen,
          orderNumber: orderNumberPush,

        });
      //take us back to the tables page
      this.$router.push({ path: '/tables' });
    },
    async getOrderFromMenu() {
      this.order = [];
      const resRef = firebase.firestore().collection('tables');
      const resSnap = await resRef.doc(this.tableId).get();
      this.orderNumber = resSnap.data().orderNumber;
      for (const orders of resSnap.data().order){
        this.order.push(orders);
      }
    },
  },
  created() {
    this.user = firebase.auth().currentUser;
    this.getOrderFromMenu();
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
    grid-template-columns: auto auto 400px auto auto;
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
    &__link {
      font-size: 1.25rem;
      color: #495057;
      text-decoration: none;
      margin-left: 0.5em;
      cursor: pointer;
      cursor: pointer;
    }
  }

  .menu-items {
    display: grid;
    grid-template-rows: 2rem auto 5rem;
    grid-area: items;


    &__header {
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;

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
    grid-template-columns: auto auto auto;

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
      text-transform: capitalize;
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

  .order-total {
    border-top: 1px solid #495057;

    &__text {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      font-size: 1.15rem;

      &--label {
        color: #76c9ba;
      }
    }
  }

  .button-group {
    margin-top: 1rem;
    display: flex;
  }

  .order-button {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    height: 2.5rem;
  }

  .review-button {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }

  .send-button {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
</style>