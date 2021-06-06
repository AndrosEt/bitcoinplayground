import Vue from "vue";
import FunctionSwitch from "../../src/components/FunctionSwitch";
import { shallowMount } from '@vue/test-utils'
import {mount} from '@vue/test-utils'


describe("FunctionSwitch.test.js", () => {

  it('Can switch the function', async () => {

    const wrapper = shallowMount(FunctionSwitch, {
      mocks: {
        $isPc: () => true
      }
    })

    expect(wrapper.vm.selectedIndex).toBe(0)
    const function1 = wrapper.findAll('a').at(0)
    const function2 = wrapper.findAll('a').at(1)
    const function3 = wrapper.findAll('a').at(2)

    // expect(wrapper.vm.$data.address.length > 0).toBe(true)
    function3.trigger('click')
    expect(wrapper.vm.selectedIndex).toBe(2)

    function2.trigger('click')
    expect(wrapper.vm.selectedIndex).toBe(1)

    function1.trigger('click')
    expect(wrapper.vm.selectedIndex).toBe(0)

    // wrapper.vm.onSelected(2, {
    //   name: 'N-of-M Addr',
    // })

  })


});
