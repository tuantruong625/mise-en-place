<template>
  <section class="order-container order">
    <h2 class="order__title">
      Order Number
      <span class="order__title--number">#{{ orderNumber }}</span>
    </h2>

    <div class="order-items-wrapper">
      <transition-group name="slide-up" tag="ul" appear class="order__items" v-for="(item, itemIndex) in order" :key="itemIndex">
        <li class="order__items--item"  :key="itemIndex">
          <span class="order__items--item-name">{{ item.name }}</span>
          <span class="order__items--item-price">{{ item.price.toFixed(2) }}</span>
        </li>
        <span class="order__items--ites-modification" :key="itemIndex + 1">{{ item.modifications }}</span>
      </transition-group>
    </div>

    <div class="order-notes">
      <ul class="order-notes__total">
        <li class="order-notes__total--text"><span class="order-total__text--label">Subtotal: </span>{{ subTotal }}</li>
        <li class="order-notes__total--text"><span class="order-total__text--label">Tax: </span>{{ tax }}</li>
        <li class="order-notes__total--text"><span class="order-total__text--label">Total: </span>{{ total }}</li>
      </ul>

      <div class="order-notes__button-group">
        <button class="order-button order-button__edit" @click="backButton()">Edit</button>
        <button class="order-button order-button__print" @click="clearTable()">Print</button>
      </div>
    </div>

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

        window.print();
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

<style lang="scss" src="./Review.scss"></style>
<style>
@media print {  
  .order-container {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    align-content: center !important;
    color: #000 !important;
    position: fixed !important;
  }

  .order__title {
    display: flex !important;
    justify-content: center !important;
    font-size: 1.25rem !important;
    margin-bottom: 1rem !important;
  }

  .order-items-wrapper {
    grid-template-columns: auto !important;
    justify-self: center !important;
    margin: 0 !important;
    list-style-type: none !important;
  }

  .order__items {
    font-size: 1rem !important;
  }

  .order__items--item-name {
    margin: 0 !important;
  }

  .order-notes__button-group {
    display: none !important;
  }
    
}
</style>
