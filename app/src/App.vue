<template>
  <div id="app">
    <router-view v-if="isReload"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () { // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isReload: true
    }
  },
  methods: {
    reload () {
      this.isReload = false
      this.$nextTick(() => {
        this.isReload = true
      })
    }
  }
}
</script>

<style lang="scss">

*::-webkit-scrollbar {
  width: 0 !important
}

* {
  -ms-overflow-style: none;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
  color: #09263c;
}

ul {
  list-style: none;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

body {
  box-sizing: border-box;
  height: 100%;
  margin: 0;
  color: #09263C;
}

html {
  height: 100%;
}

#app {
  height: 100%;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.click {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.en {
  letter-spacing: normal !important;
}

//@font-face {
//  font-family: 'bold';
//  src: url("./assets/font/BOLD.OTF");
//}
//
//@font-face {
//  font-family: 'light';
//  src: url("./assets/font/LIGHT.OTF");
//}
//
//@font-face {
//  font-family: 'medium';
//  src: url("./assets/font/MEDIUM.OTF");
//}
//
//@font-face {
//  font-family: 'normal';
//  src: url("./assets/font/NORMAL.OTF");
//}
//
//@font-face {
//  font-family: 'regular';
//  src: url("./assets/font/REGULAR.OTF");
//}
</style>
