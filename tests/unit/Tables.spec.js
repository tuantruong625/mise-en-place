import { shallowMount } from '@vue/test-utils';
import tables from '@/views/Tables.vue';

describe('Tables View', () => {

  it('add name to table', async() => {
    const table = jest.fn(() => {
      return Promise.resolve('result of add name to table');
    });

    const wrapper = shallowMount(tables);

    wrapper.setData({
      displayName: 'foobar@gmail.com',
    });

    wrapper.setMethods({ table });

    wrapper.find('[data-test=table]').trigger('click');

    expect(table).toHaveBeenCalled();
  });
});
