import { shallowMount } from '@vue/test-utils';
import SignIn from '@/views/SignIn.vue';

describe('SignIn View', () => {
  it('Renders Sign page', () => {
    const wrapper = shallowMount(SignIn);

    expect(wrapper).toBeDefined();
  });

  it('contains a sign in button',() => {
    const wrapper = shallowMount(SignIn);

    expect(wrapper.find('[data-test=signInButton]').exists()).toBeTruthy();
  });

  it('View the home page with valid sign in', async() => {
    const signin = jest.fn(() => {
      return Promise.resolve('result of signInWithEmailAndPassword');
    });

    const wrapper = shallowMount(SignIn);

    wrapper.setData({
      email: 'foobar@gmail.com',
      password: 'password!',
    });

    wrapper.setMethods({ signin });

    wrapper.find('[data-test=signInButton]').trigger('click');

    expect(signin).toHaveBeenCalled();
  });
});
