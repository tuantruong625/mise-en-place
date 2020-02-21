<template>
  <section>
    <h1  class="menu-container">Menu</h1>
    <div class="navbars">
      <ul>
        <li><a href="#food" @click="showFood = true, showDrinks = false">Food</a></li>
        <li><a href="#drinks" @click="showDrinks = true, showFood = false">Drinks</a></li>
      </ul>
    </div>
    <div style="width: 50%; float:right">
      <div v-show="showFood">
        <h1>FOOD</h1>
        <button class="buttons" v-for="fooditem in fooditems[1].items" :key="fooditem.id">
          {{  fooditem.name }}
          {{  `$` + fooditem.price }}
        </button>
      </div>
    
      <div v-show="showDrinks">
        <h1>DRINKS</h1>
        <button class="buttons" v-for="fooditem in fooditems[0].items" :key="fooditem.id">
          {{  fooditem.name }}
          {{  `$` + fooditem.price }}
        </button>
      </div>
      <div v-show="showMainFoods">
        <h1>MAINS</h1>
        <button class="buttons" v-for="foodmains in showMains" :key="foodmains.id">
          {{  foodmains }}
        </button>
      </div>
    </div>
    <div style="width: 50%; float:right">
      <div>
        <h1 class="lineHeader">FOOD</h1>
      </div>
      <button class="myButton">APPS</button>
      <button class="myButton">SIDES</button>
      <button class="myButton">SALADS</button>
      <button class="myButton">SANDWITCHES</button>
      <button class="myButton" @click="showFood = false, showDrinks = false, showMainFoods = true">MAINS</button>
      <button class="myButton">DESSERT</button>
      <div>
        <h1 class="lineHeader">DRINKS</h1>
      </div>
      <button class="myButton">COLD DRINKS</button>
      <button class="myButton">WINE</button>
      <button class="myButton">COCKTAILS</button>
      <button class="myButton">BEER</button>
      <button class="myButton">HOT DRINKS</button>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase';
const db = firebase.firestore();
export default {
  name: 'Menu',
  data() {
    return {
      fooditems: [],
      showSections: 1,
      showDrinks: false,
      showFood: true,
      showMains:[],
      showMainFoods: true,
    };
  },
  methods:{
    async getFoodMenu(){
      const menuRef = await firebase.firestore().collection('menu');
      menuRef.onSnapshot(snap => {
        snap.forEach(doc => {
          let fooditem = doc.data();
          this.fooditems.push(fooditem);

        });
      });
    },
    async getFoodCategory(){
      const menuRef = await firebase.firestore().collection('menu').doc('food').collection('items')
        .where('category', '==', 'mains').then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let mainFoods = doc.data();
            this.showMains.push(mainFoods);
          });
        });
      menuRef.onSnapshot(snap => {
        snap.forEach(doc => {
          let fooditem = doc.data();
          this.fooditems.push(fooditem);

        });
      });
    },
  },
  created(){
    this.getFoodMenu();
    this.getFoodCategory();
  }, 
  showDrinkMenu(){
  },
  showFoodMen(){
    const showDrinks =true;
    const showFood = true;
    
    if (showDrinks == true){
      showFood == false;
    }
    else if (showFood == true){
      showDrinks == false;
    }
    else {
      showFood == true;
    }
  },
};
</script>

<style lang="scss" scoped>
  .html{
    background: #E5E5E5;
  }
  .menu-container {
    position: absolute;
    padding-left: 400px;
    width: 66px;
    height: 32px;
    left: 564px;
    top: 131px;
    font-family: Roboto Slab;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 32px;
    color: #495057;
  }

  .navbars {
    font-size: 24px;
    text-align: center;
    font-family: Roboto Slab;
    font-style: normal;
    font-weight: bold;
    color: #495057;
    padding-top: 50px;
    padding-left: 200px;
  }
  

  ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  padding-left:720px;
}

li {
  float: left;
}

li a {
  display: block;
  text-align: center;
  padding: 34px 5px;
  text-decoration: none;
  
}

li a:hover {
  text-decoration: underline;
}

.buttons{
  width: 350px;
  height: 60px;
  left: 90px;
  top: 303px;
  padding: 16px 10px;
  text-align: center;
  font-size: 25px;
  margin: 20px 20px;
  background: #EFEEEE;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 6px 6px 16px rgba(209, 205, 199, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.divider{
    width:5px;
    height:auto;
    display:inline-block;
}
.button:hover {
    background-color: #e7e7e7;}



    .myButton {
	box-shadow: 3px 4px 0px 0px #899599;
	background:linear-gradient(to bottom, #ededed 5%, #bab1ba 100%);
	background-color:#ededed;
	border-radius:15px;
	border:1px solid #d6bcd6;
	display:inline-block;
	cursor:pointer;
	color:#3a8a9e;
	font-family:Arial;
	font-size:19px;
  font-weight: bold;
  margin: 20px 20px;
  height: 150px;
  width: 160px;
	text-decoration:none;
	text-shadow:0px 1px 0px #e1e2ed;
}
.myButton:hover {
	background:linear-gradient(to bottom, #bab1ba 5%, #ededed 100%);
	background-color:#bab1ba;
}
.myButton:active {
	position:relative;
	top:1px;
}
  .lineHeader{
  overflow:hidden;
  font-size: 50px;
  font-weight: bold;
  }
.lineHeader:after{
  content:'';
  display:inline-block;
  width:100%; height:100%;
  margin-right:-100%;
  border-bottom:1px solid #000;
}
</style>
