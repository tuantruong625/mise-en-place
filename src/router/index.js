import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';
import SignIn from '../views/SignIn';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/sign-in',
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: SignIn,
    // component: () => import(/* webpackChunkName: "about" */ '../views/SignIn.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('sign-in');
  } else if (!requiresAuth && currentUser) {
    next('home');
  } else {
    next();
  }
});

export default router;
