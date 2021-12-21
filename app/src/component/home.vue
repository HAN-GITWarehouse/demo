<template>
  <div class="container">
    <div id="sceen" lang="cn">
      <img class="loading" src="/assets/icon/loading.png"/>
    </div>
  </div>
</template>

<script>
import { sendStatement } from '../service/statement'
import * as config from '../config/config'

export default {
  props: ['page', 'language'],
  name: 'Home',
  data () {
    return {
      content: '',
      end: false
    }
  },
  created () {
    console.log(`home.vue this.page.id${this.page.id}, language:${this.language}: `)
    if(this.page.id === config.HOME_ID){
      return
    }

    this.init()
  },
  mounted () {
    console.log("page id, lang:", this.page.id, this.language)
    const start_time = new Date().getTime()
    const complete = ()=>{      
      console.log("page id, lang:", this.page.id, this.language)
    }

    window.game.complete = complete.bind(this)
    window.game.render(this.page.id, this.language)
  },
  methods: {
    init () {
      sendStatement(this, this.page, this.page.next_id, 0, true, this.totalData)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  #sceen{
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: center;
  }

  .loading{
    display:block;
    margin:auto;
    width: 25%;
  }
}
</style>
