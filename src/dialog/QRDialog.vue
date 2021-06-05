<template>
  <div class="dialog-container">
    <div class="dialog-bg"></div>
    <div v-if="!isStartBindEmail && isPc" class="dialog-box qr-dialog-box" @click="errorMessage = ''">
      <i @click="closeDialog()"></i>
      <div class="i-qr-code" id="qrcode" ref="qrcode"></div>
    </div>
    <div v-if="!isPc" class="qr-dialog-box-mobile">
      <div class="first-row">
        <i @click="closeDialog()"></i>
      </div>
      <div class="i-qr-code" id="qrcode-mobile" ref="qrcodeMobile"></div>
    </div>
  </div>
</template>
<script>
  import QRCode from 'qrcodejs2';


  export default {
    name: "QRDialog",
    data() {
      return {
        show: true,
        isStartBindEmail: false,
        isStartResend: false,
        info: '',
        isPc: true,
      }
    },
    props: {
      qrInfo: {}
    },
    watch: {
      qrInfo: {
        immediate: true,
        handler(value) {
          if (value !== undefined) {
            this.info = value
            this.showAccountQR()
          }
        }
      }
    },
    methods: {
      showAccountQR() {
        if (this.$refs.qrcode) {
          this.$refs.qrcode.innerHTML = "";
        }
        if (this.$refs.qrcodeMobile) {
          this.$refs.qrcodeMobile.innerHTML = "";
        }
        this.$nextTick(() => {
          this.qrcode();
        })
      },
      qrcode() {
        new QRCode(this.isPc ? 'qrcode' : 'qrcode-mobile', {
          correctLevel: QRCode.CorrectLevel.M,
          width: 150,
          height: 150,
          text: this.info
        });
      },
      closeDialog() {
        this.$emit('closeDialog', false)
      }
    }
  }
</script>

<style lang="scss">
  .dialog-container {
    height: 100%;

    .qr-dialog-box {
      text-align: center;
      background-color: white;
      border-radius: 4px;
      width: 320px;
      overflow: auto;
      max-height: 90%;
      height: fit-content;
      padding: 16px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;

      i {
        align-self: flex-end;
        width: 12px;
        height: 12px;
        background: url('../assets/dialog/ic-close.svg') center no-repeat;
        background-size: contain;
        cursor: pointer;
      }

      .i-qr-code {
        margin-top: 12px;
      }

      .tips {
        margin-top: 24px;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #616577;
      }

    }

    .qr-dialog-box-mobile {
      position: absolute;
      display: flex;
      flex-direction: column;
      text-align: center;
      width: 100%;
      min-height: 100%;
      left: 0;
      top: 1.173rem;
      padding: 0.933rem 0.533rem;
      background-color: white;
      border-top-left-radius: 0.427rem;
      border-top-right-radius: 0.427rem;

      a {
        position: absolute;
        top: 0.533rem;
        right: 0.533rem;
        width: 0.427rem;
        height: 0.427rem;
        background: url('../assets/dialog/ic-close.svg') center no-repeat;
        background-size: contain;
      }

      span {
        font-size: 0.373rem;
        color: #616577;
      }

      .first-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 0.267rem;
        justify-content: space-between;

        span {
          font-size: 0.587rem;
          color: #242C45;
        }

        i {
          margin-top: -1rem;
          width: 0.427rem;
          height: 0.427rem;
          background: url('../assets/dialog/ic-close.svg') center no-repeat;
          background-size: contain;
          cursor: pointer;
        }
      }

      .i-qr-code {
        display: flex;
        justify-content: center;
        margin-top: 0.853rem /* 64/75 */
      ;
      }

      .tips {
        font-weight: 400;
        color: #9DA3B9;
        font-size: 0.373rem /* 28/75 */
      ;
        line-height: 0.6rem /* 45/75 */
      ;
        margin-top: 0.32rem /* 24/75 */
      ;
      }

      .import-app {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #3963EF;
        font-size: 0.427rem /* 32/75 */
      ;
        line-height: 0.6rem /* 45/75 */
      ;
        border: 1px solid #3C68EB;
        border-radius: 0.107rem /* 8/75 */
      ;
        height: 1.173rem /* 88/75 */
      ;
        margin-top: 0.853rem /* 64/75 */
      ;
      }
    }
  }

  .dialog-bg {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    height: 100%;
    background: rgba(31, 34, 46, 0.7);
  }
</style>
