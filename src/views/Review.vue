<template>
  <section class="review-container">
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
        <button class="order-button send-button">Edit</button>
        <button class="order-button send-button" @click="clearTable()">Print</button>
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
    async getOrderFromTables() {
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
    this.getOrderFromTables();
  },
};
</script>
<style lang="scss" scoped>
  .review-container {
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
</style>