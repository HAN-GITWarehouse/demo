<template>
  <div class="container">

    <div class="pagination">
      <div class="prev">
        <img class="prev_in " src="../assets/img/prev_inactivity.png" alt="">
      </div>
      <div class="next">
        <img class="next_ac" src="../assets/img/next_active.png" alt="">
        <img class="next_in" src="../assets/img/next_inactivity.png" alt="">
      </div>
    </div>

    <div class="footer">
      <div class="operation">
        <div class="studied">
          <img src="../assets/img/clock.png" alt="">
          <div>已学习 00:00</div>
        </div>
        <div class="menu">目录</div>
      </div>
    </div>

    <div class="class_test">
      <img src="../assets/img/class_test.gif" alt="">
    </div>
  </div>
</template>

<script>
import * as StatementService from "../service/statement";
import * as CurrentVideo from "../data/currentVideo";
import {behaviorStart} from "../api/data";
import baseURL from "../api/base.url";

export default {
    props: ["page"],
    data() {
        return {
            volume: [1, 1, 0, 0, 0], // 音量控制
            flag: true, // 播放暂停
            video: {}, // 播放器
            duration: "", // 视频长度
            currentTime: 0, // 当前播放进度
            width: 0, // 进度条长度
            progressTimer: null, // 进度条计时器
            timer: null, // 行为计时器
            toast: false, // 提示
            preload: false, //加载完成
            disable: true, // 下一节可点击状态
            env: process.env.NODE_ENV,
            next: false, // 下一节
            publicPath: process.env.BASE_URL,
            baseUrl: baseURL.api,
            start: false, // 是否重新开始学习
            last: 0,
        };
    },
    created() {
        this.loadFont();
    },
    filters: {
        fontSize(val) {
            let size = "";
            if (val >= 10) {
                size = "1rem";
            }
            if (val > 7 && val < 10) {
                size = "1.4rem";
            }
            if (val <= 7) {
                size = "1.8rem";
            }
            return `fontSize: ${size}`;
        },
    },
    mounted() {
    // this.init();
    },
    watch: {
        preload(val) {
            if (val) this.video.currentTime = this.currentTime;
        },
    },
    methods: {
    // 加载字体
        loadFont() {
            $webfont.load(".menu,.studied", "39c47e6419cc453b9d58fb691d28a831", "Source-Han-Sans-Medium");
            $webfont.load(".center", "7f7c80b39f594d5c83ea8b8cc02ae140", "Source-Han-Normal");
            $webfont.draw();
        },
        // 视频初始化
        init() {
            const video = document.querySelector("video");
            this.video = video;
            video.addEventListener("loadeddata", this.loadData);
            video.addEventListener("play", this.play);
            video.addEventListener("pause", this.pause);
            video.addEventListener("ended", this.ended);
            video.addEventListener("timeupdate", this.timeUpdate);
        },

        // 加载数据
        loadData() {
            const statement = this.page.statement;
            // 有学习行为记录
            if (statement) {
                this.currentTime = statement.current;
                this.last = statement.current;
            }
            this.duration = this.video.duration;
            // 视频已学习完成
            console.log(this.duration, this.currentTime);
            if (this.duration - this.currentTime <= 1) {
                this.currentTime = 0;
            }
            this.video.volume = 0.4;
            // 加载完成
            this.preload = true;
        },

        // 播放切换
        videoPlay(flag) {
            if (flag) {
                this.video.pause();
            } else {
                this.video.play();
            }
        },

        // 开始播放
        play() {
            this.flag = false;
            this.addBehavior(true);
            // 记录视频播放时长提交行为
            this.timer = setInterval(() => {
                this.addBehavior();
                CurrentVideo.set(this.page.id, this.currentTime);
            }, 1000);
        },

        // 暂停
        pause() {
            this.flag = true;
            this.video.pause();
            this.clear();
            this.addBehavior();
        },

        // 视频播放完成
        ended() {
            this.video.removeEventListener("pause", this.pause);
            this.video.removeEventListener("play", this.play);
            this.addBehavior();
            this.clear();
            this.flag = true;
            this.toast = true;
        },

        // 时间变化
        timeUpdate() {
            this.width = (this.video.currentTime * 1475) / this.duration;
            this.currentTime = this.video.currentTime;
            this.start = this.currentTime === 0;
            // 禁止快进
            if (this.page.statement && this.data.statement.type === 1) return;
            if (this.currentTime - this.last > 2) {
                this.video.currentTime = this.last;
            } else {
                this.last = this.currentTime;
            }
        },

        // 音量变化
        voiceChange(val) {
            this.volume.forEach((item, index) => {
                if (index <= val) {
                    this.volume.splice(index, 1, 1);
                } else {
                    this.volume.splice(index, 1, 0);
                }
            });
            this.video.volume = (val + 1) * 0.2;
        },

        // 添加行为 type 0 进行中 1 已完成
        addBehavior(start) {
            const state = this.page.statement;
            const statement = StatementService.newStatement();
            statement.resources_id = this.page.id;
            statement.current = this.currentTime;
            // 已学完
            if (state && state.type === 1) {
                statement.type = 1;
            }

            statement.start_time = StatementService.getTime();
            const callback = (res)=>{
              // this.page.data.statement = res.data.data;
            }

            behaviorStart(statement).then(callback.bind(this)) 
            this.page.save();
        },

        // 清除定时器
        clear() {
            clearInterval(this.timer);
        },

        // 时间格式
        timeFilter(time) {
            let result = parseInt(time);
            let h = Math.floor(result / 60 / 60 % 60) < 10 ? "0" + Math.floor(result / 60 / 60 % 60) : Math.floor(result / 60 / 60 % 60);
            let m =
          Math.floor((result / 60) % 60) < 10
              ? "0" + Math.floor((result / 60) % 60)
              : Math.floor((result / 60) % 60);
            let s =
          Math.floor(result % 60) < 10
              ? "0" + Math.floor(result % 60)
              : Math.floor(result % 60);
            let res = "";
            res += `${h}:${m}:${s}`;
            return res;
        },

        // 返回目录
        back() {
            this.clear();
            this.page.id = this.page.parent.id;
        },

        // 开始答题
        async jump() {
            const statement = StatementService.newStatement();
            statement.resources_id = this.page.child[0].id;
            statement.start_time = StatementService.getTime();

            const callback =(res)=>{
              if(!res.success){
                console.error(res)
                return
              }

              this.page.child[0].statement = res.data.data;
              this.page.id = this.page.child[0].id;
              this.page.save();
            }

            behaviorStart(statement).then(callback.bind(this))
        },

        // 下一节
        toNext() {
            this.clear();
            if (this.next)
                this.page.id = this.page.next.id;
        },
    },
    beforeDestroy() {
        console.log("销毁");
        this.clear();
    }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../assets/img/bg.jpg") 0 0/ 100% 100% no-repeat;
  overflow: hidden;

  .pagination {

    .prev:hover {

    }

    .next:hover .next_in {

    }

    .next:hover .next_ac {
      transform: translate(-22px, -50%);
      //animation: bounceIn 1s both;
    }

    .next:hover .next_in {
      opacity: 0;
    }

    .prev_in, .next_ac, .next_in {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      transition: all .7s ease-in-out;
      opacity: 1;
    }

    .prev_in, .next_in {
      width: 54px;
    }

    .prev_in {
      left: 0;
    }

    .next_in {
      right: 0;
    }

    .next_ac {
      width: 131px;
      z-index: 2;
    }

    .next_ac {
      right: 0;
      transform: translate(132px, -50%);
    }
  }

  .footer {
    width: 100%;
    height: 76px;
    background: url("../assets/img/footer.png") 0 0 / cover no-repeat;
    position: fixed;
    bottom: 0;


    .operation {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .studied {
        width: 204px;
        height: 37px;
        background: #48BEBE;
        border-radius: 6px;
        display: flex;
        align-items: center;
        padding-left: 15px;
        color: #ffffff;

        img {
          width: 20px;
          height: 20px;
        }

        div {
          font-size: 22px;
          margin-left: 16px;
        }
      }

      .menu {
        width: 75px;
        height: 37px;
        border: 1px solid #FFFFFF;
        border-radius: 6px;
        color: #ffffff;
        text-align: center;
        line-height: 37px;
        margin-left: 34px;
        margin-right: 33px;
        cursor: pointer;
        letter-spacing: 2px;
      }
    }
  }

  .class_test {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 38px;
    background-color: #fff;
    display: none;

    img {
      width: 850px;
    }
  }
}

@keyframes bounceIn {
  from {
    transform: translateX(100px);
  }
  to {
    transform: translateX(0);
  }
}
</style>
