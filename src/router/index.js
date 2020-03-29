import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';
import SignIn from '../views/SignIn/SignIn';

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
    path: '/sign-up',
    name: 'sign-up',
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp/SignUp.vue'),
  },

  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/review',
        name: 'review',
        component: () => import(/* webpackChunkName: "about" */ '../views/Review/Review.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "about" */ '../views/Menu/Menu.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/tables',
        name: 'tables',
        component: () => import(/* webpackChunkName: "about" */ '../views/Tables/Tables.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
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
