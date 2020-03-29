import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import firebase from 'firebase';
import 'firebase/firestore';
import '@/scss/index.scss';

Vue.use(firebase);

firebase.initializeApp({
  apiKey: 'AIzaSyBuXZ3Unex92rjtlhWaOt0QLcRfwMo95UU',
  authDomain: 'mise-en-place-3331f.firebaseapp.com',
  databaseURL: 'https://mise-en-place-3331f.firebaseio.com',
  projectId: 'mise-en-place-3331f',
  storageBucket: 'mise-en-place-3331f.appspot.com',
  messagingSenderId: '946468448921',
  appId: '1:946468448921:web:f39782d297a623c5626608',
  measurementId: 'G-T8JK89ZBQR',
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

export const db = firebase.firestore();
