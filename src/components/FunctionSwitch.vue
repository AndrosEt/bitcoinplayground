<template>
  <div class="function-container">
    <div class="function-content">
      <a v-for="(option, index) in selectBillingCycleList"
         v-on:click="onSelected(index, Object.assign(option, {updateList: undefined}))"
         class="function-item"
         :class="{'selected': selectedIndex === index}">{{option.name}}</a>
    </div>
    <a class="selected-bg" ref="selectedBg"></a>

  </div>
</template>

<script>

  export default {
    name: 'FunctionSwitch',
    data() {
      return {
        selectedIndex: 0,
        selectBillingCycleList: [
          {
            name: 'Mnemonic',
          },
          {
            name: 'SegWit Addr',
          },
          {
            name: 'N-of-M Addr',
          }
        ],
        isInit: true
      };
    },
    mounted() {
      const that = this
      setTimeout(function () {
        that.updateUi()
      }, 500)
    },
    methods: {
      onSelected(index, option) {
        this.selectedIndex = index;
        this.updateUi();
        this.$emit('selected-index', index, option);
      },
      updateUi() {
        //calculate new position and width

        let offsetLeft = document.getElementsByClassName('function-item')[this.selectedIndex].offsetLeft;
        let itemWidth = document.getElementsByClassName('function-item')[this.selectedIndex].clientWidth;
        let parentWidth = document.getElementsByClassName('function-content')[0].clientWidth;
        let offset = parentWidth - offsetLeft - itemWidth + Math.min(1, this.selectedIndex) * 5;
        let width = document.getElementsByClassName('function-item')[this.selectedIndex].clientWidth - 5
        document.getElementsByClassName('selected-bg').item(0).setAttribute('style', 'right:' + offset + 'px; width:' + width + 'px');

      }
    }
  };
</script>

<style lang="scss">
  .function-container {
    display: block;
    height: 46px;
    position: absolute;

    .function-content {
      border-radius: 16px;
      height: 48px;
      display: flex;
      flex-direction: row;
      z-index: 1;
      align-items: center;
      width: fit-content;
      background-color: #fff;
      /*padding: 4px;*/
      a {
        font-weight: 500;
        font-size: 16px;
        padding: 0 28px;
        z-index: 1000;
        color: rgb(86, 90, 105);
      }

      .selected {
        font-weight: 600;
        color: #000;
      }
    }

    .selected-bg {
      right: 2px;
      text-align: center;
      font-size: 16px;
      float: right;
      height: 38px;
      border-radius: 12px;
      padding: 0 28px;
      color: #000;
      background-color: rgb(237, 238, 242);
      z-index: 0;
      bottom: 43px;
      position: relative;
      transition-property: right, width;
      transition-duration: 0.4s;

      transition-timing-function: ease;
      /* Safari */
      -webkit-transition-property: right, width;
      -webkit-transition-duration: 0.4s;

      -webkit-transition-timing-function: ease;
    }
  }
</style>
