<template>
  <div :class="{'tools-container': isPc, 'tools-container-mb': !isPc}">
    <div class="header">
      <FunctionSwitch class="function-switch" :style="{'filter': showQrDialog ? 'blur(5px)': 'unset'}"
                      @selected-index="updateFunctionIndex"
      ></FunctionSwitch>
    </div>
    <div class="body" :style="{'filter': showQrDialog ? 'blur(5px)': 'unset'}">
      <div v-if="functionIndex === 0" class="tools-mnemonic tool">
        <p class="tips">Generate a random mnemonic</p>
        <div class="mnemonic-detail">
          <a-popover placement="bottom" trigger="click" v-model="showPopover">
            <template slot="content">
              <p class="select-item" @click="changeWords(18)">18 words</p>
              <p class="select-item" @click="changeWords(21)">21 words</p>
              <p class="select-item" @click="changeWords(24)">24 words</p>
            </template>
            <div class="words-select">{{mnemonicWordsNumber}} words
              <a-icon type="down" class="arrows"/>
            </div>
          </a-popover>
          <div class="btn" @click="generateMnemonicWords">Generate</div>
        </div>

        <div class="result-detail">
          <div class="address">{{mnemonicWords}}</div>
          <div class="operates">
            <a-icon type="qrcode" class="qr-code" @click="displayQR"/>
            <div class="copy" @click="copyMnemonic">Copy</div>
          </div>
        </div>
      </div>
      <div v-if="functionIndex === 1" class="tools-segwit-addr tool">
        <p class="tips">Generate a SegWit address</p>
        <a-textarea
          class="seed-input input"
          placeholder="Please enter your seed here."
          v-model="seed"
          spellcheck="false"
          :auto-size="{ minRows: 1, maxRows: 6 }"
        />

        <a-textarea
          class="path-input input"
          placeholder="Please enter your path here."
          v-model="path"
          spellcheck="false"
          :auto-size="{ minRows: 1, maxRows: 6 }"
        />
        <div class="btn-container">
          <div class="btn" @click="generateSegWitAddr">
            <span v-if="!loading">Generate</span>
            <a-icon v-if="loading" type="loading"/>
          </div>
        </div>

        <div class="result-detail">
          <div class="address">{{address}}</div>
          <div class="operates">
            <a-icon type="qrcode" class="qr-code" @click="displayQR"/>
            <div class="copy" @click="copyAddr">Copy</div>
          </div>
        </div>
      </div>
      <div v-if="functionIndex === 2" class="tools-multi-sig-addr tool">
        <div class="address-item" v-for="(item,index) in bitcoinAddrs" :key="index">
          <a-textarea
            class="address-input input"
            placeholder="Please enter the address here."
            v-model="item.address"
            spellcheck="false"
            :auto-size="{ minRows: 1, maxRows: 6 }"
          />
          <a-icon v-if="bitcoinAddrs.length > 1 && index === bitcoinAddrs.length - 1" type="minus" class="add-btn btn" @click="popAddress"/>
          <a-icon v-if="index === bitcoinAddrs.length - 1" type="plus" class="add-btn btn" @click="addAddress"/>
        </div>

<!--        <div class="btn-container">-->
<!--          <a-icon type="plus" class="add-btn btn" @click="addAddress"/>-->
<!--        </div>-->
        <div class="btn-container">
          <a-input class="n-input input" type="number" placeholder="Enter the N here." v-model="N"/>
          <a-input class="n-input input" type="number" placeholder="Enter the M here." v-model="M"/>
          <div class="btn" @click="generateMultiSigAddress">Generate</div>
        </div>
        <div class="result-detail">
          <div class="address">{{address}}</div>
          <div class="operates">
            <a-icon type="qrcode" class="qr-code" @click="displayQR"/>
            <div class="copy" @click="copyAddr">Copy</div>
          </div>
        </div>
      </div>
    </div>
    <QRDialog
      :class="{'dialog': isPc, 'dialog-out': !showQrDialog}"
      @closeDialog="closeDialog"
      v-bind:qrInfo="qrData"
      v-show="showQrDialog"></QRDialog>
  </div>
</template>

<script>
  import FunctionSwitch from '../components/FunctionSwitch'
  import bitcoinjs from '../core/bitcoinjs'
  import QRDialog from "../dialog/QRDialog"

  export default {
    name: "BitcoinjTools",
    components: {
      FunctionSwitch,
      QRDialog
    },
    data() {
      return {
        mnemonicWordsNumber: 24,
        mnemonicWords: '',
        isPc: true,
        showQrDialog: false,
        showPopover: false,
        functionIndex: 0,
        address: '',
        seed: '',
        path: '',
        loading: false,
        qrData: '',
        bitcoinAddrs: [
          {
            address: ''
          },
          {
            address: ''
          }
        ],
        N: '',
        M: '',
        isPc: document.documentElement.clientWidth || document.body.clientWidth > 500
      }
    },
    methods: {
      generateMnemonicWords() {
        this.mnemonicWords = bitcoinjs.generateMnemonic(this.mnemonicWordsNumber)
      },
      displayQR() {
        this.qrData = this.functionIndex === 0 ? this.mnemonicWords: this.address
        this.showQrDialog = true
      },
      closeDialog() {
        this.showQrDialog = false
      },
      changeWords(wordNumber) {
        this.mnemonicWordsNumber = wordNumber
        this.showPopover = false
      },
      copyMnemonic() {
        this.copyData(this.mnemonicWords)
      },
      copyAddr() {
        this.copyData(this.address)
      },
      copyData(dataString) {
        let textarea = document.createElement("textarea");
        textarea.value = dataString;
        textarea.readOnly = true;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("Copy");
        textarea.className = "textarea";
        textarea.style.display = "none";
        this.$message.info('Copy success!');
      },
      updateFunctionIndex(index) {
        this.address = ''
        this.mnemonicWords = ''
        this.functionIndex = index
      },
      generateSegWitAddr() {
        if (this.seed.length > 0 && this.path.length > 0) {
          this.loading = true
          const that = this
          setTimeout(function () {
            bitcoinjs.generateSegWitAddrWithSeedAndPath(that.seed, that.path, function (data) {
              that.address = data
              that.loading = false
              console.log(data)
            })
          }, 500)

        }
      },
      addAddress () {
        this.bitcoinAddrs.push({address: ''})
      },
      popAddress () {
        this.bitcoinAddrs.pop()
      },
      generateMultiSigAddress() {
        const publicKeys = this.bitcoinAddrs.map(item => {
          return item.address
        }).filter(item =>
          item.length > 0
        )
        this.address = bitcoinjs.generateNofMAddress(publicKeys, Number(this.N), Number(this.M))
      }
    }
  }
</script>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
  }

  .ant-popover-inner {
    border-radius: 16px !important;
  }

  .ant-popover-inner-content {
    border-radius: 16px;
    padding: 2px !important;

    .select-item {
      padding: 8px;
      margin: 2px;
      cursor: pointer;
      border-radius: 16px;

      &:hover {
        background-color: #f7f8fa;
      }

      &:active {
        background-color: #f7f8fa;
      }
    }
  }

  .dialog {
    .dialog-box {
      box-shadow: 0 0 25px black;
      animation: zoomin 0.3s;
      animation-fill-mode: forwards;
    }

    @keyframes bg-in {
      from {
        background: rgba(31, 34, 46, 0);
      }
      to {
        background: rgba(31, 34, 46, 0.7);
      }
    }
    @keyframes zoomin {
      from {
        opacity: 0;
        transform: scale(1.1) translate(-45%, -45%);
      }
      to {
        opacity: 1;
        transform: scale(1) translate(-50%, -50%);
      }
    }
  }


  .dialog-out {
    .dialog-box {
      animation: zoomout 0.3s;
      animation-fill-mode: forwards;
    }

    @keyframes zoomout {
      from {
        opacity: 1;
        transform: scale(1) translate(-50%, -50%);
      }
      to {
        opacity: 0;
        transform: scale(1.1) translate(-45%, -45%);
      }
    }
  }

  .tools-container {
    width: 100%;
    height: 100%;
    align-items: center;

    .header {
      flex-direction: row;
      padding: 16px;
      height: fit-content;
      justify-content: space-around;
    }

    .body {
      margin-top: 120px;
      .btn {
        cursor: pointer;
        height: 38px;
        font-size: 18px;
        background-color: #F5EF55;
        border-radius: 16px;
        justify-content: center;
        padding: 20px;
        box-shadow: rgba(0, 0, 0, .08) 0px 6px 10px;

        &:hover {
          background-color: #EAE452;
        }
      }
      .tool {
        padding: 8px;
        background-color: #fff;
        border-radius: 24px;
        width: 480px;
        height: fit-content;
        box-shadow: rgba(0, 0, 0, .01) 0px 0px 1px, rgba(0, 0, 0, .04) 0px 4px 8px, rgba(0, 0, 0, .04) 0px 16px 24px, rgba(0, 0, 0, .01) 0px 24px 32px;

        .tips {
          font-size: 16px;
          font-weight: 500;
          padding: 16px 20px 8px 20px;
        }

        .input {
          padding: 10px;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          background-color: rgb(247, 248, 250);
          border-radius: 20px;
          border: 1px solid rgb(237, 238, 242);
        }

        .btn-container {
          width: 100%;
          flex-direction: row;
          justify-content: flex-end;
          .btn {
            width: fit-content;
            margin: 10px;
          }
        }

        .result-detail {
          margin-top: 8px;
          background-color: rgb(247, 248, 250);
          border-radius: 20px;
          border: 1px solid rgb(237, 238, 242);

          .address {
            border-radius: 20px;
            padding: 16px 20px 8px 20px;
          }

          .operates {
            flex-direction: row;
            justify-content: space-between;
            padding: 8px;
            align-items: center;

            .qr-code {
              font-size: 20px;
              margin-left: 12px;
              cursor: pointer;
            }

            .copy {
              cursor: pointer;
              height: 38px;
              font-size: 18px;
              background-color: #F5EF55;
              border-radius: 16px;
              justify-content: center;
              padding: 20px;
              box-shadow: rgba(0, 0, 0, .08) 0px 6px 10px;

              &:hover {
                background-color: #EAE452;
              }
            }
          }
        }
      }


      .tools-mnemonic {
        .mnemonic-detail {
          padding: 8px;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          background-color: rgb(247, 248, 250);
          border-radius: 20px;
          border: 1px solid rgb(237, 238, 242);

          .words-select {
            cursor: pointer;
            height: 38px;
            font-size: 18px;
            width: fit-content;
            background-color: #fff;
            justify-content: center;
            border-radius: 16px;
            padding: 20px;
            box-shadow: rgba(0, 0, 0, .08) 0px 6px 10px;
            flex-direction: row;
            align-items: center;

            .arrows {
              margin-left: 8px;
            }

            &:hover {
              box-shadow: rgba(0, 0, 0, .12) 0px 6px 10px;

            }

          }
        }
      }

      .tools-segwit-addr {

        .path-input {
          margin-top: 10px;
        }



      }

      .tools-multi-sig-addr {

        .address-item {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;

          .address-input {
            width: 350px;
          }

          .add-btn {
            height: 34px;
            padding: 9px;
            margin-left: 10px;
          }
        }

        .btn-container {
          align-items: center;
          margin-top: 20px;
          justify-content: space-between;

          .n-input {
            margin-right: 10px;
          }
          .btn {
            margin-right: 0;
          }
        }
      }
    }

  }

  .tools-container-mb {
    width: 100%;
    height: fit-content;
    align-items: center;

    .header {
      flex-direction: row;
      padding: 16px;
      height: fit-content;
      justify-content: space-around;

    }

    .body {
      margin-top: 2.267rem  /* 170/75 */;
      width: 96%;
      .btn {
        cursor: pointer;
        height: 0.813rem  /* 61/75 */;
        font-size: 0.307rem  /* 23/75 */;
        background-color: #F5EF55;
        border-radius: 0.32rem  /* 24/75 */;
        justify-content: center;
        padding: 0.413rem  /* 31/75 */;
        box-shadow: rgba(0, 0, 0, .08) 0 0.08rem  /* 6/75 */ 0.133rem  /* 10/75 */;

        &:hover {
          background-color: #EAE452;
        }
      }
      .tool {
        padding: 0.187rem  /* 14/75 */;
        background-color: #fff;
        border-radius: 0.507rem  /* 38/75 */;
        width: 100%;
        height: fit-content;
        box-shadow: rgba(0, 0, 0, .01) 0 0 1px, rgba(0, 0, 0, .04) 0 0.053rem  /* 4/75 */ 0.107rem  /* 8/75 */, rgba(0, 0, 0, .04) 0 0.213rem  /* 16/75 */ 0.32rem  /* 24/75 */, rgba(0, 0, 0, .01) 0 0.32rem  /* 24/75 */ 0.427rem  /* 32/75 */;

        .tips {
          font-size: 0.32rem  /* 24/75 */;
          font-weight: 500;
          padding: 0.213rem  /* 16/75 */ 0.267rem  /* 20/75 */ 0.107rem  /* 8/75 */ 0.267rem  /* 20/75 */;
        }

        .input {
          padding: 0.24rem  /* 18/75 */;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          background-color: rgb(247, 248, 250);
          border-radius: 0.413rem  /* 31/75 */;
          border: 1px solid rgb(237, 238, 242);
        }

        .btn-container {
          width: 100%;
          flex-direction: row;
          justify-content: flex-end;
          .btn {
            width: fit-content;
            margin: 0.227rem  /* 17/75 */;
          }
        }

        .result-detail {
          margin-top: 0.173rem  /* 13/75 */;
          background-color: rgb(247, 248, 250);
          border-radius: 0.413rem  /* 31/75 */;
          border: 1px solid rgb(237, 238, 242);

          .address {
            border-radius: 0.413rem  /* 31/75 */;
            padding: 0.32rem  /* 24/75 */ 0.413rem  /* 31/75 */ 0.16rem  /* 12/75 */ 0.413rem  /* 31/75 */;
            font-size: 0.32rem  /* 24/75 */;

          }

          .operates {
            flex-direction: row;
            justify-content: space-between;
            padding: 0.16rem  /* 12/75 */;
            align-items: center;

            .qr-code {
              font-size: 0.413rem  /* 31/75 */;
              margin-left: 0.253rem  /* 19/75 */;
              cursor: pointer;
            }

            .copy {
              cursor: pointer;
              height: 0.813rem  /* 61/75 */;
              font-size: 0.307rem  /* 23/75 */;
              background-color: #F5EF55;
              border-radius: 0.32rem  /* 24/75 */;
              justify-content: center;
              padding: 0.413rem  /* 31/75 */;
              box-shadow: rgba(0, 0, 0, .08) 0 0.08rem  /* 6/75 */ 0.133rem  /* 10/75 */;

              &:hover {
                background-color: #EAE452;
              }
            }
          }
        }
      }


      .tools-mnemonic {
        .mnemonic-detail {
          padding: 0.187rem  /* 14/75 */;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          background-color: rgb(247, 248, 250);
          border-radius: 0.413rem  /* 31/75 */;
          border: 1px solid rgb(237, 238, 242);

          .words-select {
            cursor: pointer;
            height: 0.8rem  /* 60/75 */;
            font-size: 0.32rem  /* 24/75 */;
            width: fit-content;
            background-color: #fff;
            justify-content: center;
            border-radius: 0.333rem  /* 25/75 */;
            padding: 0.427rem  /* 32/75 */;
            box-shadow: rgba(0, 0, 0, .08) 0 0.08rem  /* 6/75 */ 0.133rem  /* 10/75 */;
            flex-direction: row;
            align-items: center;

            .arrows {
              margin-left: 0.24rem  /* 18/75 */;
            }

            &:hover {
              box-shadow: rgba(0, 0, 0, .12) 0 0.08rem  /* 6/75 */ 0.133rem  /* 10/75 */;

            }

          }
        }
      }

      .tools-segwit-addr {

        .path-input {
          margin-top: 10px;
        }

      }

      .tools-multi-sig-addr {

        .address-item {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;

          .address-input {
            width: 6.833rem;
          }

          .add-btn {
            height: 0.693rem  /* 52/75 */;
            padding: 0.227rem  /* 17/75 */;
            margin-left: 0.44rem  /* 33/75 */;
          }
        }

        .btn-container {
          align-items: center;
          margin-top: 0.493rem  /* 37/75 */;
          justify-content: space-between;

          .n-input {
            margin-right: 0.227rem  /* 17/75 */;
            font-size: 0.28rem  /* 21/75 */;
          }
          .btn {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>
