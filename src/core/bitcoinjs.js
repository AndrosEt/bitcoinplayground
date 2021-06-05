import * as bitcoinjs from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
import Antd from 'ant-design-vue'
import Vue from 'vue'




const instance = {
  /**
   * Generate a random mnemonic words following BIP39 standard
   * @returns {string}
   */
  generateMnemonic: function (size) {
    return bip39.generateMnemonic(size*32/3)
  },

  /**
   * Generate a Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin
   * address from a given seed and path
   * @param seed
   * @param path
   */
  generateSegWitAddrWithSeedAndPath: function (seed, path, callback) {
    // Safe check

    bip39.mnemonicToSeed(seed).then(bytes => bytes.toString('hex')).then(seed => {

      const root = bitcoinjs.bip32.fromSeed(
        Buffer.from(seed, 'hex')
      );

      const node = root.derivePath(path);
      const address = bitcoinjs.payments.p2wpkh({pubkey: node.publicKey,}).address
      callback(address)
    }).catch(reason => {
      callback(reason)
    })

  },
  /**
   * Generate an n-out-of-m Multisignature (multi-sig) Pay-To-Script-Hash (P2SH) bitcoin address
   * @param publicKeys
   * @param n
   * @param m
   * @returns {string}
   */
  generateNofMAddress: function (publicKeys, n, m) {
    try {
      const pubkeys = publicKeys.map(hex => Buffer.from(hex, 'hex'));
      const {address} = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2ms({m, n, pubkeys}),
      });
      return address
    } catch (e) {
      return e.toString()
    }
  }
}

export default instance
