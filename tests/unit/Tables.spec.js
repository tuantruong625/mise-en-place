// import { shallowMount, mount, createLocalVue } from '@vue/test-utils';

// import VueRouter from 'vue-router';
// import tables from '@/views/Tables.vue';
// import routes from '@/router/index.js';

// const localVue = createLocalVue();
// localVue.use(VueRouter);

// describe.only('App', () => {
//   it('renders a child component via routing', async() => {
//     const router = new VueRouter({ routes });
//     const wrapper = mount(tables, { 
//       localVue,
//       router,
//     });

//     router.push('/tables');
//     await wrapper.vm.$nextTick();

//     expect(wrapper.find(tables).exists()).toBe(true);
//   });
// });