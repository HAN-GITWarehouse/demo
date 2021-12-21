<template>
  <div class="container">
    <slot></slot>

    <div class="ppt_box">
      <img class="gif" @click="answerQuestion" :src="imgUrl" alt="" v-if="page.type === 10">
      <div id="sceen" class="sceen" v-else></div>
      <div class="pagination" v-if="page.type!==10">
        <div class="prev" :class="{can: page.prev_id}">
          <img @click="prev" v-if="page.prev_id" class="prev" src="../assets/img/prev_active.png" alt="">
          <img class="prev" v-else src="../assets/img/prev_inactivity.png" alt="">
        </div>
        <div class="next" :class="{can: true}">
          <img @click="next" v-if="showNext||finish" class="next_ac"
               src="../assets/img/next_active.png"
               alt="">
          <img class="next_in" v-else src="../assets/img/next_inactivity.png" alt="">
        </div>
      </div>
    </div>

    <foot @returnToMenu="returnToMenu" :page="page" :user="user" :language="language" :studyTime="studyTime"></foot>
  </div>
</template>

<script>

import * as StudyTime from '../data/studyTime'
import { sendStatement } from '../service/statement'
import { getJson } from '../api/data.js'
import '../utils/animate.min.css'
import foot from '../component/foot'

export default {
  props: ['page', 'user', 'mobile', 'language', 'catalog_id'],
  components: {
    foot
  },
  data () {
    return {
      step: 0, // 动画步骤
      timer: null, // 动画步骤计时器
      timeUpdate: null, // 学习时长计时器
      studyTime: 0, // 学习时长
      toNext: false, // 页面销毁判断
      showNext: false, // '下一页高亮'
      publicPath: '', // 资源基础路径
      finish: false, // 页面已学习
      content_id: '',
      imgUrl: '', // 图片地址
      click_meause_time:null,
      start_time:null,
    }
  },
  watch:{
    finish(val, oldVal){
      console.log("finish:------------- ",val, oldVal,this);
      if(val){
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    if(window.game===undefined){
      this.reload()
      return
    }

    if (this.page.type === 10) {
      return
    }
    
    const complete = ()=>{ 
      const max = 1000*2
      let interval = 0
      interval = setInterval(()=>{  
          console.log('picture interval! line: 89')   
          clearInterval(interval)
          this.finish = true
      }, max)
    }    

    console.log('picture vue mounted, page: ', this.page)

    window.game.complete = complete.bind(this)
    window.game.render(this.page.id, this.language)
  },
  methods: {
    init () {
      console.log('picture page data: ', this.page)

      this.publicPath = process.env.BASE_URL
      this.page = this.page
      this.content_id = this.page.id
      
      console.log('picture resource data: ', this.page)

      this.finish = this.page.last_view ===undefined ? false : this.page.last_view
      
      if (this.page.type === 10) {
        const getJsonCallback = (res)=>{
          console.log(res.data, 'json')
          this.imgUrl = `${process.env.BASE_URL}assets/pages/${this.page.id}/pc/${localStorage.getItem('lang')}/${res.data.frames[0].content[0].url}`
        }

        getJson(this.page.id).then(getJsonCallback.bind(this))
      }

      this.getStudyTime()
      this.updateTime()
    },

    // 获取学习时长
    getStudyTime () {
      const time = StudyTime.getTime(this.page.parent_id)
      if (time) {
        this.studyTime = time
      } else {
        this.studyTime = 0
      }
    },

    // 学习时间累加
    updateTime () {
      this.timeUpdate = setInterval(() => {
        console.log('picture interval! line: 150')   
        this.studyTime++
        StudyTime.set(this.page.parent_id, this.studyTime)
      }, 1000)
    },

    getNextId(){
      console.log('picture get next id: ', this.page.next_id , this.next_chapter_id)
      const id = this.page.next_id ? this.page.next_id : this.next_chapter_id
      if(id === undefined || id === null){
        console.error('next id is error: ', this.page.next_id , this.next_chapter_id)
        return '5e1e2425-0606-4e99-9238-414bfa9c1794'
      }

      return id
    },

    // 下一页ppt
    next () {
      console.log('picture next function: ', this.finish)

      if(this.page.last_view ===undefined || this.page.last_view === null){
        sendStatement(this, this.page, this.page.id, 0, true, this.page)
      }

      this.$emit('changeId', this.getNextId()) 
    },

    // 上一页ppt
    prev () {
      this.$emit('changeId', this.page.prev_id)
    },

    // 开始答题
    answerQuestion () {
      // 是否是测试题
      console.log('picture answer question: ', this.page.type)
      if (this.page.type === 10) {
        this.next()
        return
      }

      const callback = (res)=>{
        // 终极测试
        if (!this.next_chapter_id) {
          localStorage.setItem('exam-time', 0)
        }
      }
    },

    // 返回目录
    returnToMenu () {
      console.log( 'picture return to menu, finish: ', this.finish);
      this.$emit('changeId', this.catalog_id)
    },

  },
  
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timeUpdate)
  }
}
</script>

<style lang="scss" scoped>

.container {
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: #fff;


  .ppt_box {
    display: flex;
    //align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    overflow-y: scroll;

    .sceen{
      height: 100%;
      width: 100%;
    }

    .gif {
      display: block;
      height: 100%;
    }

    .pagination {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
      height: 80px;

      .prev, .next {
        height: 100%;
        cursor: pointer;

        img {
          //width: 100%;
          height: 100%;
        }
      }

      .prev {
        float: left;
      }

      .next {
        float: right;
      }

    }
  }
}


@media only screen and (max-width:812px) {
 .container {
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: #fff;


  .ppt_box {
    display: flex;
    //align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    overflow-y: scroll;

    .sceen{
      height: 100%;
      width: 100%;
    }

    .gif {
      display: block;
      height: 100%;
    }

    .pagination {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
      height: 150px;

      .prev, .next {
        height: 100%;
        cursor: pointer;

        img {
          //width: 100%;
          height: 100%;
        }
      }

      .prev {
        float: left;
      }

      .next {
        float: right;
      }

    }
  }
}
}
</style>