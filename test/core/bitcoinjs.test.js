import Vue from "vue";
import bitcoinjs from "../../src/core/bitcoinjs";

describe("bitcoinjs.test.js", () => {

  beforeEach(() => {
  });

  it('Generate a random mnemonic words.', () => {
    let mnemonic = bitcoinjs.generateMnemonic()
    expect(mnemonic.length).toBeGreaterThan(0);
  });

  it('Generate a SegWit bitcoin address from a given seed and path.', done => {
    let seed = '8a4092057d2bb5c5b381ac46c75cb998f5ff94806bc8d687d97359df4f5184e091b4da676ef16b6ef44941a9883e3b9a9479c379c81b896e6c51b8dc2039000e'
    let path = 'm/44/0/0/0'
    let address = 'bc1qzh7dgddneqnzdh765jemj8qu4669jqgjfx8052'
    bitcoinjs.generateSegWitAddrWithSeedAndPath(seed, path, function (data) {
      expect(data).toEqual(address);
      done();
    })
  });

  it('Can not generate a SegWit bitcoin address from a given seed and path.', done => {
    let seed = 'test seed'
    let path = 'test path'
    // let address = 'bc1qzh7dgddneqnzdh765jemj8qu4669jqgjfx8052'
    bitcoinjs.generateSegWitAddrWithSeedAndPath(seed, path, function (data) {
      expect(data.message !== null).toEqual(true)
      done();
    })
  });

  it('Generate an n-out-of-m Multisignature bitcoin address.', () => {
    let publicKeys = [
      '0214f8af8c079e32c8aabb410973277c5aa16fb26024478ed11590f2ea6591f4b8',
      '02ccce2142b01a93742a14868c83d10b6207385fc4d0fde86dd4227ab64c978801',
      '034834b13f7ffceafcd22980acfe771ea7a26236f31f5f2a9dcad601dc00b8c160'
    ]
    let n = 3
    let m = 2
    let address = '3EneVo88i7VptnSiDGXXqBRNnyBDbtkegT'
    let resultAddress = bitcoinjs.generateNofMAddress(publicKeys, n, m)
    expect(resultAddress).toEqual(address)
  });

  it('Can not generate an n-out-of-m Multisignature bitcoin address.', () => {
    let publicKeys = [
      '0214f8af8c079e32c8aabb410973277c5aa16fb26024478ed11590f2ea6591f4b8',
      '02ccce2142b01a93742a14868c83d10b6207385fc4d0fde86dd4227ab64c978801',
      '034834b13f7ffceafcd22980acfe771ea7a26236f31f5f2a9dcad601dc00b8c160'
    ]
    let n = 3
    let m = 4
    let resultAddress = bitcoinjs.generateNofMAddress(publicKeys, n, m)
    expect(resultAddress.toLowerCase().indexOf('error') !== -1).toEqual(true)
  });
});
