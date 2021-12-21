<template>
  <div class="video-box flex-center">
    <slot></slot>
    <img class="video-header" src="../assets/header.png"/>
    <img class="ultimate" src="../assets/ultimate.gif"/>
    <div class="cover" @click="jump"></div>
  </div>
</template>

<script>
import * as StatementService from '../service/statement'
import * as ExamTimeStorage from '../data/exam.time'
import { behaviorStart } from '../api/data'

export default {
  props: ['page'],
  data () {
    return {
      behavior: {},
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      ExamTimeStorage.stop()
      ExamTimeStorage.set(200)
    },

    // 做题
    jump () {
      this.ultimate()
      this.question()
      this.page.id = this.page.child[0].id
    },

    // 终极测试开始
    ultimate () {
      const statement = StatementService.newStatement()
      statement.resources_id = this.page.id
      statement.start_time = StatementService.getTime()
      behaviorStart(statement).then(({ data }) => {
        this.page.statement = data.data
      })
    },

    // 开始答题
    async question () {
      const questionData = this.page.child[0]
      const statement = StatementService.newStatement()
      statement.resources_id = questionData.id
      statement.start_time = StatementService.getTime()
      const res = await behaviorStart(statement)
      questionData.statement = res.data.data
    }
  },
}
</script>

<style lang="scss" scoped>
.video-box {
  width: 1677px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  background: url("../assets/img/home_bg.jpg") 0 0 / 100% 100% no-repeat;
  border-left: 2px solid #001b50;
  border-right: 2px solid #001b50;

  .video-header {
    width: 100%;
    height: 130px;
    position: absolute;
    top: -17px;
    left: 0;
  }

  .ultimate {
    width: 850px;
    height: 680px;
    margin-top: 50px;
  }

  .video {
    width: 1230px;
    height: 765px;
    margin: 0 auto;
    background: url("../assets/video-box.png") 0 0 / 100% 100% no-repeat;
    position: relative;

    .des {
      width: 250px;
      height: 55px;
      position: absolute;
      top: 17px;
      right: 90px;
      font-size: 30px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 3px;
      text-align: center;
      line-height: 55px;
    }

    video,
    .state {
      width: 1088px;
      height: 614px;
      position: absolute;
      left: 54px;
      bottom: 82px;
    }

    .state {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .video-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 70px;
    width: 100%;
    background: url("../assets/video-controller/yj-01.png") no-repeat 0 0 / 100% 100%;

    .controller {
      display: flex;
      margin-top: 18px;
      justify-content: space-between;
      margin: 17px 30px 0 33px;

      .pause {
        width: 60px;
        height: 44px;
        border-radius: 5px;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .progress-box {
        width: 1300px;
        height: 11px;
        position: absolute;
        left: 108px;
        border-radius: 10px;
        top: 32px;
        background: url("../assets/video-controller/yj-04.png") no-repeat 0 0 /
          100% 100%;

        .progress {
          width: 200px;
          background: black;
          height: 8px;
          margin-top: 3px;
          float: right;
        }

        .dot {
          width: 24px;
          height: 24px;
          position: absolute;
          bottom: -8px;
          left: -2px;
        }
      }

      .others {
        width: 224px;
        display: flex;
        justify-content: space-between;

        .jump {
          box-sizing: border-box;
          width: 140px;
          padding: 0 10px;
          border-radius: 10px;
          color: #fff;
          background: #001b50;
          letter-spacing: 2px;
          font-size: 16px;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .back,
          .next {
            cursor: pointer;
          }

          .disable {
            cursor: not-allowed;
            color: gray;
          }
        }

        .volume {
          width: 62px;
          height: 32px;
          display: flex;
          align-items: flex-end;
          margin-top: 4px;

          .voice {
            width: 8px;
            height: 13px;
            background-color: #001b50;
            margin-right: 4px;
            border-radius: 5px;
            cursor: pointer;
          }

          .voice-1 {
            height: 18px;
          }

          .voice-2 {
            height: 23px;
          }

          .voice-3 {
            height: 28px;
          }

          .voice-4 {
            height: 32px;
          }

          .active {
            background-color: #ff6000;
          }
        }
      }
    }
  }

  .cover {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
  }

  @keyframes progress {
    from {
      width: 0;
    }

    to {
      width: 1300px;
    }
  }
}
</style>