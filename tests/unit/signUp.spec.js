import { shallowMount } from '@vue/test-utils';
import SignIn from '@/views/SignUp/SignUp.vue';
import Tables from '@/views/Tables/Tables.vue';

describe('SignUp View', () => {
  it('Renders Sign up page', () => {
    const wrapper = shallowMount(SignIn);

    expect(wrapper).toBeDefined();
  });


  it('sign up for a new account', async() => {
    const signUp = jest.fn(() => {
      return Promise.resolve('result of createUserWithEmailAndPassword');
    });

    const wrapper = shallowMount(SignIn);

    wrapper.setData({
      email: 'foobar@gmail.com',
      password: 'password!',
      confirmPassword: 'password!',
    });

    wrapper.setMethods({ signUp });

    wrapper.find('[data-test=signUpButton]').trigger('click');

    expect(signUp).toHaveBeenCalled();
  });
});
