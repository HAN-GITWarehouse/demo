<template>
  <div class="container">
    <slot></slot>

    <div class="title" :class="language">
      {{ language == "cn" ? "终极测试" : "Final Assessment" }}
    </div>
    <div class="content">
      <Loading class="loading" v-show="calculation" />
      <div class="scroll_box">
        <div class="info">
          <div class="index">
            {{ language == "cn" ? "第" : "Question" }} {{ page.index }} /{{
              page.total
            }}
            <span v-if="language === 'cn'">题</span>
          </div>
          <div class="heart" :class="language">
            {{ language == "cn" ? "答题用时" : "Answer Time" }}：{{
              currentTime
            }}
            <span v-if="language === 'cn'">秒</span><span v-else>Seconds</span>
          </div>
        </div>

        <div class="question_head">
          <span style="color: #db0815"
            >[{{
              content.select == 0
                ? language == "cn"
                  ? "单选题"
                  : "Single Choice"
                : language == "cn"
                ? "多选题"
                : "Multiple Choice"
            }}]</span
          >{{ content.label }}
        </div>

        <div :class="[language === 'cn' ? 'Cnoption_list' : 'option_list']">
          <div
            class="option"
            v-for="(item, index) in content.options"
            :key="item.id"
            @click="check(item, index)"
            :ref="`item-${index}`"
          >
            <div class="context">{{ prefix[index] }}、{{ item.label }}</div>
          </div>
        </div>

        <div class="btn_group">
          <div
            class="btn submit click"
            v-show="showSubmit"
            :class="language"
            @click="submit"
            id="btn1"
          >
            {{ language == "cn" ? "提交" : "Submit" }}
          </div>
          <div
            class="btn confirm click"
            v-show="showConfirm"
            :class="language"
            @click="confirm"
          >
            {{ language == "cn" ? "确认" : "Next" }}
          </div>
        </div>
      </div>
    </div>

    <foot @returnToMenu="returnToMenu" :language="language"></foot>

    <div class="mask" :class="{ active: fail }">
      <!--    失败-->
      <div class="fail" :class="{ active: fail }">
        <div class="failContent">
          <div class="score">
            <p :class="language">
              {{ language == "cn" ? "答对:" : "Correct:"
              }}<span>{{ chapter.total_right }}</span>
            </p>
            <div :class="language">|</div>
            <p :class="language">
              {{ language == "cn" ? "答错:" : "Wrong:"
              }}<span>{{ chapter.total_wrong }}</span>
            </p>
            <div :class="language">|</div>
            <p :class="language">
              {{ language == "cn" ? "得分:" : "Score:"
              }}<span>{{ chapter.score }}</span>
            </p>
          </div>
          <div class="tips">
            <p :class="language">
              {{
                language == "cn"
                  ? "很遗憾的告知您，"
                  : "Unfortunately, your score does not meet the passing benchmark；"
              }}
            </p>
            <p :class="language">
              {{
                language == "cn"
                  ? "没有考核成功，请重新挑战"
                  : "Please try again."
              }}
            </p>
          </div>
        </div>
        <div class="again" @click="toHome"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendStatement } from "../service/statement";
import { getReport } from "../api/data";
import foot from "../component/foot";
import Loading from "./loading";

export default {
  props: ["page", "language"],
  components: {
    foot,
    Loading: Loading,
  },
  data() {
    return {
      fail: false, // 显示失败成绩
      currentTime: "", // 答题用时
      rights: [], // 正确选项
      multipleOptionArr: [],
      prefix: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"], // 索引
      showConfirm: false,
      showSubmit: false,
      showResult: false,
      content: {}, // 显示内容
      totalData: {}, // 题目内容
      chapter: {}, // 章节答题结果
      timer: null, // 学习时长计时器
      resultTimer: null,
      calculation: false,
    };
  },
  computed: {
    type() {
      switch (this.content.select) {
        case 0:
          return "single_choice";
        case 1:
          return "multiple_choice";
        case 2:
          return "judgement";
        default:
          return "single_choice";
      }
    },
  },
  created() {
    this.init();
    // 页面开始行为
  },

  methods: {
    // 初始化
    init() {
      this.updateTime();
      this.content = this.page.content;
      console.log(this.page, this.content);
      console.log("test content english _______", this.content);
      this.rights = this.content.options.filter((v) => {
        console.log("right: ", v.right, "label: ", v.label);
        return v.right;
      });

      if (this.page.index == 1) {
        localStorage.setItem("exam-time", 0);
      }
    },

    // 更新答题时间
    updateTime() {
      const time = localStorage.getItem("myCat");
      this.currentTime = time == null ? 0 : JSON.parse(time);
      this.timer = setInterval(() => {
        console.log("ultimate question interval! line: 142");
        this.currentTime++;
        localStorage.setItem("exam-time", JSON.stringify(this.currentTime));
      }, 1000);
    },

    clearActive() {
      const options = document.querySelectorAll(".option");
      options.forEach((item) => {
        item.classList.remove("active");
      });
      this.content.options.map((item) => {
        item.checked = false;
      });
    },

    // 选择
    check(val, index) {
      // 已打完
      if (this.finish) return false;
      // 多选
      if (this.rights.length > 1) return this.multipleOption(val, index);
      // 单选
      this.singleOption(val, index);
    },

    // 单选
    singleOption(val, index) {
      this.clearActive();
      val.checked = true;
      this.$refs[`item-${index}`][0].classList.add("active");
      console.log("this$refsdom -----", this.$refs[`item-${index}`]);
      if (this.page.next_id) {
        this.showConfirm = true;
      } else {
        this.showSubmit = true;
      }
    },

    // 多选
    multipleOption(val, index) {
      val.checked = !val.checked;
      // 切换字体加粗效果
      this.$refs[`item-${index}`][0].classList.toggle("active");

      if (this.page.next_id) {
        this.showConfirm = true;
      } else {
        this.showSubmit = true;
      }
    },

    // 提交
    submit() {
      console.log("ulimate question, submit all: ", this.page);
      const btn=document.querySelector("#btn1")
      btn.style.background='#cecece'
      sendStatement(
        this,
        this.page,
        this.page.id,
        this.currentTime,
        true,
        this.page
      );

      this.getResult();
    },

    // 确认
    confirm() {
      // 页面行为，下一题

      sendStatement(
        this,
        this.page,
        this.page.id,
        this.currentTime,
        true,
        this.page
      );

      this.$emit("changeId", this.page.next_id);
    },

    toReportPage() {
      this.$router.push({
        path: "/report",
        query: {
          id: "81d903a0-f4c4-495c-947a-edc8091b4fc4",
        },
      });
    },
    // 获取答题结果
    getResult() {
      let interval = null;
      let getCount = 6;

      console.log("ultimate question: ", this.page);
      this.calculation = true;
      const callback = (res) => {
        clearInterval(interval);
        if (getCount <= 0) {
          return;
        }

        getCount--;

        console.log("ultimate question get result: ", res);
        if (!res.data.success) {
          // 分数结果未生成，等会再取
          interval = setInterval(() => {
            console.log("ultimate question interval! line: 232");
            getReport(this.page.parent_id, this.language).then(
              callback.bind(this)
            );
          }, 3 * 1000);
          return;
        }

        this.chapter = res.data.data.chapter;

        // 答题成功
        if (this.chapter.total_wrong < 4) {
          this.toReportPage();
        } else {
          // 答题失败
          this.fail = true;
        }
      };

      getReport(this.page.parent_id, this.language).then(callback.bind(this));
    },

    // 返回到目录
    returnToMenu() {
      this.$emit("changeId", "5e1e2425-0606-4e99-9238-414bfa9c1794");
    },

    // 去首页
    toHome() {
      localStorage.setItem("exam-time", 0);
      this.$emit("changeId", "9789de34-5382-45b6-b19d-301b2fb47ff8");
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.resultTimer);
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: url("../assets/img/bg.jpg") 0 0 / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;

  .title {
    width: 510px;
    height: 80px;
    background-color: #db0815;
    border-bottom-left-radius: 80px;
    border-bottom-right-radius: 80px;
    font-size: 44px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 12px;
    font-weight: bold;
    flex-shrink: 0;
    margin-bottom: 50px;
  }

  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;

    .scroll_box {
      width: 1300px;
      padding-bottom: 30px;

      .info {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 30px;
        margin-bottom: 18px;
      }

      .question_head {
        width: 100%;
        background: url("../assets/img/question_bg.png") 0 0 / 100% 100%
          no-repeat;
        padding: 25px 30px;
        font-size: 36px;
        letter-spacing: 4px;
        font-weight: bold;
        word-wrap: break-word;
        white-space: normal;
      }

      .option_list {
        width: 100%;
        margin-top: 40px;
        .option {
          width: 100%;
          min-height: 70px;
          border: 1px solid #cecccc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 23px;
          cursor: pointer;

          .context {
            flex: 1;
            padding: 10px 10px 10px 25px;
            font-size: 30px;
            word-break: keep-all;
            word-wrap: break-word;
          }
        }
        .option.active {
          font-weight: bold;
        }
      }
      .Cnoption_list {
        width: 100%;
        margin-top: 40px;
        .option {
          width: 100%;
          min-height: 70px;
          border: 1px solid #cecccc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 23px;
          cursor: pointer;

          .context {
            flex: 1;
            padding: 10px 10px 10px 25px;
            font-size: 30px;
          }
        }
        .option.active {
          font-weight: bold;
        }
      }

      .btn_group {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        margin-top: 30px;

        .btn {
          padding: 8px 24px;
          color: #ffffff;
          letter-spacing: 4px;
          border-radius: 14px;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm,
        .submit {
          background: #48bebe;
          border: 1px solid #bfe8eb;
          color: #fff;
        }

        .submit {
          background: #db0815;
        }
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.5s ease-out;

    &.active {
      opacity: 1;
      visibility: visible;
    }

    .fail {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 560px;
      height: 380px;
      background: url("../assets/img/fail.png") no-repeat 0 0 / 100% 100%;

      &.active {
        animation: fadeInDown 0.5s ease-in-out forwards;
      }

      .failContent {
        margin-left: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 450px;
        box-sizing: border-box;
        text-align: center;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }

        .score {
          margin-top: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;

          p {
            font-size: 26px;
            font-weight: bold;
            letter-spacing: 2px;

            span {
              font-size: 34px;
              color: #b60611;
            }
          }

          div {
            margin: 8px 16px 0;
            color: rgba(112, 112, 112, 0.27);
          }

          div.en {
            margin: 8px 8px 0;
          }
        }

        .tips {
          font-size: 24px;
          margin-top: 10px;
          letter-spacing: 2px;
          font-weight: bold;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          ::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }

          div {
            color: rgba(65, 73, 99, 0.7);
          }
        }
      }

      .again {
        width: 340px;
        height: 95px;
        margin: 75px auto 0;
        cursor: pointer;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
      }
    }

    .fail.en {
      .failContent {
        margin-top: 6px;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }

        .head {
          font-size: 20px;

          span {
            font-size: 25px;
          }
        }

        .tips {
          width: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          ::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
        }
      }
    }
  }
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    -webkit-transform: scale(0.3);
    -ms-transform: scale(0.3);
    transform: scale(0.3);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translateY(-100px);
    -ms-transform: translateY(-100px);
    transform: translateY(-100px);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
}
@media only screen and (max-width: 812px) {
  .container {
    width: 100%;
    height: 100%;
    background: url("../assets/img/bg.jpg") 0 0 / 100% 100% no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto;

    .title {
      width: 510px;
      height: 80px;
      background-color: #db0815;
      border-bottom-left-radius: 80px;
      border-bottom-right-radius: 80px;
      font-size: 44px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      letter-spacing: 12px;
      font-weight: bold;
      flex-shrink: 0;
      margin-bottom: 50px;
    }

    .content {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;

      .scroll_box {
        width: 1300px;
        padding-bottom: 30px;

        .info {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 30px;
          margin-bottom: 18px;
        }

        .question_head {
          width: 100%;
          background: url("../assets/img/question_bg.png") 0 0 / 100% 100%
            no-repeat;
          padding: 25px 30px;
          font-size: 36px;
          letter-spacing: 4px;
          font-weight: bold;
          word-wrap: break-word;
          white-space: normal;
        }

        .option_list {
          width: 100%;
          margin-top: 40px;
          .option {
            width: 100%;
            min-height: 70px;
            border: 1px solid #cecccc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 23px;
            cursor: pointer;

            .context {
              flex: 1;
              padding: 10px 10px 10px 25px;
              font-size: 30px;
              word-break: keep-all;
              word-wrap: break-word;
            }
          }
          .option.active {
            font-weight: bold;
          }
        }
        .Cnoption_list {
          width: 100%;
          margin-top: 40px;
          .option {
            width: 100%;
            min-height: 70px;
            border: 1px solid #cecccc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 23px;
            cursor: pointer;

            .context {
              flex: 1;
              padding: 10px 10px 10px 25px;
              font-size: 30px;
            }
          }
          .option.active {
            font-weight: bold;
          }
        }

        .btn_group {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          margin-top: 30px;

          .btn {
            padding: 8px 24px;
            color: #ffffff;
            letter-spacing: 4px;
            border-radius: 14px;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .confirm,
          .submit {
            background: #48bebe;
            border: 1px solid #bfe8eb;
            color: #fff;
          }

          .submit {
            background: #db0815;
          }
        }
      }
    }

    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s ease-out;

      &.active {
        opacity: 1;
        visibility: visible;
      }

      .fail {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 860px;
        height: 500px;
        background: url("../assets/img/fail.png") no-repeat 0 0 / 100% 100%;

        &.active {
          animation: fadeInDown 0.5s ease-in-out forwards;
        }

        .failContent {
          margin-left: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 660px;
          height: 320px;
          box-sizing: border-box;
          text-align: center;
          overflow-y: scroll;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          ::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }

          .score {
            margin-top: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;

            p {
              font-size: 26px;
              font-weight: bold;
              letter-spacing: 2px;

              span {
                font-size: 34px;
                color: #b60611;
              }
            }

            div {
              margin: 8px 16px 0;
              color: rgba(112, 112, 112, 0.27);
            }

            div.en {
              margin: 8px 8px 0;
            }
          }

          .tips {
            font-size: 24px;
            margin-top: 10px;
            letter-spacing: 2px;
            font-weight: bold;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
            ::-webkit-scrollbar {
              display: none; /* Chrome Safari */
            }

            div {
              color: rgba(65, 73, 99, 0.7);
            }
          }
        }

        .again {
          width: 340px;
          height: 95px;
          margin: 75px auto 0;
          cursor: pointer;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          ::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
        }
      }

      .fail.en {
        .failContent {
          margin-top: 6px;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          ::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }

          .head {
            font-size: 20px;

            span {
              font-size: 25px;
            }
          }

          .tips {
            width: auto;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
            ::-webkit-scrollbar {
              display: none; /* Chrome Safari */
            }
          }
        }
      }
    }
  }
}
</style>
