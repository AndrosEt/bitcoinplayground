import FunctionSwitch from "../../src/components/FunctionSwitch";
import BitcoinjTools from "../../src/components/BitcoinjTools";
import {mount} from '@vue/test-utils'
import Vue from 'vue'

import {shallowMount} from '@vue/test-utils'

// const functionSwitchWrapper = mount(FunctionSwitch)
const bitcoinjToolsWrapper = mount(BitcoinjTools)
document.execCommand = jest.fn().mockReturnValue(true);

describe("BitcoinjTools.test.js", () => {

  it('Generate a random mnemonic words following BIP39 standard', async () => {

    // switch to function 3
    const functionSwitch = bitcoinjToolsWrapper.findComponent(FunctionSwitch)
    const function3 = functionSwitch.findAll('a').at(2)

    function3.trigger('click')
    functionSwitch.vm.$emit('selected-index', 2)
    await bitcoinjToolsWrapper.vm.$nextTick()

    // test index of the function
    expect(functionSwitch.vm.selectedIndex).toBe(2)
    expect(bitcoinjToolsWrapper.vm.functionIndex).toBe(2)

    // enter the address and n&m
    expect(bitcoinjToolsWrapper.html()).toContain('tools-multi-sig-addr')
    expect(bitcoinjToolsWrapper.vm.$data.address).toBe('')
    bitcoinjToolsWrapper.vm.$data.bitcoinAddrs.push({address: '02ccce2142b01a93742a14868c83d10b6207385fc4d0fde86dd4227ab64c978801'})
    bitcoinjToolsWrapper.vm.$data.bitcoinAddrs.push({address: '034834b13f7ffceafcd22980acfe771ea7a26236f31f5f2a9dcad601dc00b8c160'})
    bitcoinjToolsWrapper.vm.$data.bitcoinAddrs.push({address: '034834b13f7ffceafcd22980acfe771ea7a26236f31f5f2a9dcad601dc00b8c160'})
    bitcoinjToolsWrapper.vm.$data.N = 3
    bitcoinjToolsWrapper.vm.$data.M = 2
    bitcoinjToolsWrapper.vm.addAddress()
    bitcoinjToolsWrapper.vm.popAddress()
    // function test
    bitcoinjToolsWrapper.vm.generateMultiSigAddress()

    expect(bitcoinjToolsWrapper.vm.$data.address.length > 0).toBe(true)

    // copy test
    bitcoinjToolsWrapper.vm.copyAddr()
    const copyHtml=document.body.outerHTML
    expect(copyHtml).toContain(`<textarea readonly="" class="textarea" style="display: none;"></textarea>`)

    // QR code test
    expect(bitcoinjToolsWrapper.html().includes('<div class="dialog-container dialog" style="">')).toBe(false)
    bitcoinjToolsWrapper.vm.displayQR()
    await bitcoinjToolsWrapper.vm.$nextTick()
    expect(bitcoinjToolsWrapper.html().includes('<div class="dialog-container dialog" style="">')).toBe(true)
    bitcoinjToolsWrapper.vm.closeDialog()
    await bitcoinjToolsWrapper.vm.$nextTick()
    expect(bitcoinjToolsWrapper.html().includes('<div class="dialog-container dialog" style="">')).toBe(false)


  })

  it('Generate a SegWit bitcoin address.', async () => {
    // clean up
    bitcoinjToolsWrapper.vm.$data.address = ''

    // switch to function 2
    const functionSwitch = bitcoinjToolsWrapper.findComponent(FunctionSwitch)
    const function2 = functionSwitch.findAll('a').at(1)

    function2.trigger('click')
    functionSwitch.vm.$emit('selected-index', 1)
    await bitcoinjToolsWrapper.vm.$nextTick()

    // test index of the function
    expect(functionSwitch.vm.selectedIndex).toBe(1)
    expect(bitcoinjToolsWrapper.vm.functionIndex).toBe(1)

    // enter the seed and path
    expect(bitcoinjToolsWrapper.html()).toContain('tools-segwit-addr')
    expect(bitcoinjToolsWrapper.vm.$data.address).toBe('')
    bitcoinjToolsWrapper.vm.$data.seed = '8a4092057d2bb5c5b381ac46c75cb998f5ff94806bc8d687d97359df4f5184e091b4da676ef16b6ef44941a9883e3b9a9479c379c81b896e6c51b8dc2039000e'
    bitcoinjToolsWrapper.vm.$data.path = 'm/44/0/0/0'
    // function test
    bitcoinjToolsWrapper.vm.generateSegWitAddr()
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(bitcoinjToolsWrapper.vm.$data.address.length > 0).toBe(true)
  })

  it('Generate an multi-sig (P2SH) bitcoin address', async () => {
    // clean up
    bitcoinjToolsWrapper.vm.$data.address = ''

    // switch to function 1
    const functionSwitch = bitcoinjToolsWrapper.findComponent(FunctionSwitch)
    const function2 = functionSwitch.findAll('a').at(0)

    function2.trigger('click')
    functionSwitch.vm.$emit('selected-index', 0)
    await bitcoinjToolsWrapper.vm.$nextTick()

    // test index of the function
    expect(functionSwitch.vm.selectedIndex).toBe(0)
    expect(bitcoinjToolsWrapper.vm.functionIndex).toBe(0)

    // enter the seed and path
    expect(bitcoinjToolsWrapper.html()).toContain('tools-mnemonic')
    expect(bitcoinjToolsWrapper.vm.$data.mnemonicWords).toBe('')
    // function test case 1
    bitcoinjToolsWrapper.vm.changeWords(18)
    bitcoinjToolsWrapper.vm.generateMnemonicWords()
    expect(bitcoinjToolsWrapper.vm.$data.mnemonicWords.split(' ').length).toBe(18)

    // function test case 2
    bitcoinjToolsWrapper.vm.changeWords(21)
    bitcoinjToolsWrapper.vm.generateMnemonicWords()
    expect(bitcoinjToolsWrapper.vm.$data.mnemonicWords.split(' ').length).toBe(21)

    // function test case 3
    bitcoinjToolsWrapper.vm.changeWords(24)
    bitcoinjToolsWrapper.vm.generateMnemonicWords()
    expect(bitcoinjToolsWrapper.vm.$data.mnemonicWords.split(' ').length).toBe(24)
  })

});
