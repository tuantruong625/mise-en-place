import { shallowMount } from '@vue/test-utils';
import SignIn from '@/views/SignIn.vue';

describe.only('SignIn View', () => {
  it('Renders Sign page', () => {
    const wrapper = shallowMount(SignIn);

    expect(wrapper).toBeDefined();
  });

  it('contains a sign in button',() => {
    const wrapper = shallowMount(SignIn);

    expect(wrapper.find('[data-test=signInButton]').exists()).toBeTruthy();
  });
});
