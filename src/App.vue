<template>
  <div id="app" >
    <router-view/>
  </div>
</template>

<script>

  export default {
    name: 'app',
    components: {
    }
  }
</script>
<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
    background-image: linear-gradient( rgba(245, 207, 0, .2), rgba(253, 235, 135, .2));
  }
</style>
