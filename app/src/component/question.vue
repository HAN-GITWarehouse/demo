<template>
  <div class="container">
    <slot></slot>

    <div class="title" :class="language">
      {{ language == "cn" ? "课后测试" : "Self—check" }}
    </div>

    <img
      class="nextClass"
      @click="nextClass"
      v-show="showNextClass"
      src="../assets/img/next_active.png"
      alt=""
    />

    <div class="content">
      <div class="scroll_box">
        <div class="info">
          <div class="index">
            {{ language == "cn" ? "第" : "Question：" }} {{ page.index }} /{{
              page.total
            }}
            <span v-if="language === 'cn'">题</span>
          </div>
        </div>

        <div class="question_head">
          <span style="color: #db0815" :class="language"
            >[{{
              page.content.select == 0
                ? language == "cn"
                  ? "单选题"
                  : "Single Choice"
                : language == "cn"
                ? "多选题"
                : "Multiple Choice"
            }}]</span
          >
          {{ page.content.label }}
        </div>

        <div class="option_list">
          <div
            :class="
              item.selected !== undefined && item.selected
                ? 'option active'
                : 'option ' + item.selected
            "
            v-for="(item, index) in page.content.options"
            :key="item.id"
            @click="selected(item, index)"
            :ref="`item-${index}`"
          >
            <div :class="'context'">{{ prefix[index] }}、{{ item.label }}</div>
            <div class="icon_box">
              <img
                v-show="analysisShow && item.right"
                src="../assets/img/correct.png"
                alt=""
              />
              <img
                v-show="analysisShow && !item.right"
                class="wrong"
                src="../assets/img/wrong.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div
          class="analysis"
          v-show="this.analysisShow"
          :class="{ active: this.analysisShow }"
        >
          <div class="tip">
            <img src="../assets/img/tip.png" alt="" />
            <div class="subTitle" :class="language">
              {{ language == "cn" ? "答题解析:" : "Feedback:" }}
            </div>
          </div>
          <div class="result">
            <span>{{ language == "cn" ? "你的答案:" : "Your Answer:" }}</span
            ><span class="txt" v-for="item in selecteds" :key="item.id">{{
              prefix[item.index]
            }}</span>
          </div>
          <div class="result">
            <span>{{ language == "cn" ? "正确答案:" : "Correct Answer:" }}</span
            ><span class="txt" v-for="item in rights" :key="item.id">{{
              prefix[item.index]
            }}</span>
          </div>
          <div class="text">
            <span>{{ language == "cn" ? "试题解析:" : "Feedback:" }}</span
            ><span class="txt">{{ page.content.prompt }}</span>
          </div>
        </div>

        <div class="btn_group">
          <div style="float: right">
            <div
              v-show="showAgain"
              :class="{ active: this.showAgain, language }"
              class="btn click again"
              @click="again"
            >
              {{ language == "cn" ? "再来一次" : "Try Again" }}
            </div>
            <div>
              <div
                class="btn click next en"
                v-if="language == 'cn'"
                :class="language"
                v-show="showNext"
                @click="nextQuestion"
              >
                {{ this.page.index === 2 ? "下一页" : "下一题" }}
              </div>

              <div
                class="btn click next en"
                v-else
                :class="language"
                v-show="showNext"
                @click="nextQuestion"
              >
                {{ this.page.index === 2 ? "Next Page" : "Next" }}
              </div>
            </div>
            <div
              class="btn click confirm"
              :class="language"
              v-show="showConfirm"
              @click="confirm"
            >
              {{ language == "cn" ? "确认" : "Submit" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <foot @returnToMenu="returnToMenu" :language="language"></foot>
  </div>
</template>

<script>
import { sendStatement } from "../service/statement";
import foot from "../component/foot";

export default {
  props: ["page", "mobile", "language"],
  inject: ["reload"],
  components: {
    foot,
  },
  data() {
    return {
      prefix: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"], // 选项索引
      imgUrl: "", // gif地址
      number: 0,
      showAgain: false, // 再来一次
      showConfirm: false,
      showNext: false,
      showNextClass: false, // 显示下一章节
      analysisShow: false,
      selecteds: [],
      rights: [],
    };
  },
  created() {
    this.init();
    console.log("this is question data title :", this.page);
  },
  computed: {
    type() {
      switch (this.page.content.select) {
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
  methods: {
    // 初始化
    init() {
      console.log(
        "question vue, init: ",
        this.page.id,
        this.page.next_id,
        this.next_chapter_id
      );
      this.page.content.options.forEach((v, index) => {
        v.index = index;
      });
    },
    // 返回到目录
    returnToMenu() {
      this.$emit("changeId", "5e1e2425-0606-4e99-9238-414bfa9c1794");
    },
    complete() {
      if (this.page.next_id === undefined || this.page.next_id === null) {
        this.showNextClass = true;
      } else {
        this.showNext = true;
      }

      this.showConfirm = false;
      this.showAgain = false;
    },
    checkRight() {
      const options = this.page.content.options;
      const wrongs = options.filter((v) => {
        const right =
          v.right === 1
            ? v.selected !== undefined && v.selected
            : v.selected === undefined || !v.selected;
        console.log("question vue, check right: ", v.selected, v.right, right);
        return !right;
      });

      console.log("question vue, check right, wrongs: ", wrongs, wrongs.length);

      if (wrongs.length == 0 || this.number > 1) {
        this.showAnswer();
        this.complete();

        return;
      }

      this.showAgain = true;
      this.showConfirm = false;
    },
    changeItem(index, item) {
      this.$set(this.page.content.options, index, item);
      console.log(
        "question vue, selected item: ",
        item,
        this.page.content.options
      );
    },
    clearSelected() {
      this.page.content.options.forEach((v, idx) => {
        v.selected = undefined;
        this.changeItem(idx, v);
      });
    },
    showAnswer() {
      this.selecteds = this.page.content.options.filter(
        (item) => item.selected !== undefined
      );
      this.rights = this.page.content.options.filter(
        (item) => item.right === 1
      );

      this.analysisShow =
        this.page.content.prompt !== undefined &&
        this.page.content.prompt !== null &&
        this.page.content.prompt.length > 0;
      console.log(
        "question vue, check right, analysis show(none multiple choice): ",
        this.page.content.select,
        this.analysisShow
      );
    },
    // 选择
    selected(item, index) {
      if (this.analysisShow) {
        return;
      }

      if (this.page.content.select == 0 || this.page.content.select == 2) {
        this.clearSelected();
      }

      item.selected = item.selected ? undefined : true;
      this.changeItem(index, item);

      // sendStatement(this, this.page, this.page.id, "", true, this.page);

      this.showAgain = false;
      this.showConfirm = true;
    },
    // 确认
    confirm() {
      this.number++;
      this.checkRight();
    },
    // 下一题
    nextQuestion() {
      // 页面结束
      if (this.page.last_view === undefined || this.page.last_view === null) {
        sendStatement(this, this.page, this.page.id, 0, true, this.page);
      }

      this.$emit("changeId", this.page.next_id);
    },

    // 再来一次
    again() {
      this.clearSelected();

      this.analysisShow = false;
      this.showAgain = false;
      this.showConfirm = false;
    },

    // 跳转到下一章节
    nextClass() {
      this.$emit("changeId", this.next_chapter_id);
    },
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

  .nextClass {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    height: 50px;
    cursor: pointer;
  }

  .title {
    width: 510px;
    height: 80px;
    background-color: #48bebe;
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
          height: 150px;
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

          .icon_box {
            width: 40px;
            height: 32px;
            display: flex;
            justify-content: center;
            margin-right: 15px;
            margin-top: 75px;

            img {
              height: 100%;
            }

            .correct {
              width: 100%;
              height: auto;
            }
          }
        }

        .option.active {
          font-weight: bold;
        }
      }

      .analysis {
        width: 100%;
        padding: 15px 20px;
        background-color: #f1efef;
        visibility: hidden;
        transition: all 0.35s ease-out;
        transform: translateY(-20px);
        opacity: 0;

        .tip {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          color: #b60611;
          letter-spacing: 4px;
          margin-bottom: 15px;

          img {
            height: 26px;
            margin-right: 15px;
          }
        }

        .result {
          font-weight: bold;
          font-size: 38px;
          margin-bottom: 4px;

          span:nth-of-type(n + 1) {
            margin-right: 10px;
            font-weight: normal;
            font-size: 38px;
          }
        }

        .text {
          font-size: 38px;
          font-weight: normal;
          letter-spacing: 2px;
        }

        &.active {
          animation: fadeInDown 0.35s ease-out forwards;
        }
      }

      .btn_group {
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

        .again.active {
          animation: enlarge 0.5s 3 ease-in alternate both;
        }

        .next {
          background: #48bebe;
        }

        .confirm,
        .again {
          background: #48bebe;
          border: 1px solid #bfe8eb;
          color: #fff;
        }

        .again {
          background: #db0815;
        }

        .analysis {
          background: none;
          border: 1px solid #858484;
          color: #a19f9f;
        }

        .analysis:active {
          background-color: #db0815;
          color: #fff;
        }
      }
    }
  }
}

@keyframes enlarge {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.25);
  }

  50% {
    transform: scale(1.5);
  }

  75% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translateY(-20px);
    -ms-transform: translateY(-20px);
    transform: translateY(-20px);
  }

  100% {
    visibility: visible;
    opacity: 1;
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .title {
      width: 48vw;
      height: 5.5vh;
      border-bottom-left-radius: 5vh;
      border-bottom-right-radius: 5vh;
      font-size: 2.5vh;
      margin-bottom: 4vh;
    }

    .content {
      margin-bottom: 3vh;

      .scroll_box {
        width: 85%;

        .info {
          font-size: 1.8vh;
          margin-top: 0;
          margin-bottom: 1.1vh;
        }

        .question_head {
          padding: 2vh 2.5vh;
          font-size: 2.6vh;
          word-wrap: break-word;
          white-space: normal;
        }

        .option_list {
          margin-top: 4.5vh;

          .option {
            min-height: 2.5vh;
            margin-bottom: 2.5vh;

            .context {
              padding: 0.7vh 0 0.7vh 1.5vw;
              font-size: 2.2vh;
              letter-spacing: 0.1vw;
              word-break: break-all;
            }

            .icon_box {
              width: 6vw;
              height: 2.5vh;
              display: flex;
              justify-content: center;
              margin-right: 1vw;
              flex-shrink: 0;

              .icon {
                margin-top: 0.5vh;
                width: 4vw;
                height: auto;
                margin-right: 3vw;
              }
            }
          }
        }

        .analysis {
          width: 100%;
          padding: 2vh 4vw;
          background-color: #f1efef;
          visibility: hidden;
          transition: all 0.35s ease-out;
          transform: translateY(-20px);
          opacity: 0;

          .tip {
            display: flex;
            align-items: center;
            font-size: 2.3vh;
            font-weight: bold;
            color: #b60611;
            letter-spacing: 0.5vw;
            margin-bottom: 1.5vh;

            img {
              height: 2.3vh;
              margin-right: 2vw;
            }
          }

          p {
            font-size: 1.8vh;
            letter-spacing: 0.3vw;
          }
        }

        .btn_group {
          .btn {
            width: 120px;
            height: 48px;
            padding: 6px 2px;
            font-size: 48px;
            border-radius: 10px;
            letter-spacing: 2px;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          }
        }
      }
    }
  }
  .mask {
    .good {
      width: 70vw;

      div {
        font-size: 2.5vh;
        letter-spacing: 0.5vw;
      }
    }
  }
}

@media only screen and (max-width: 2340px) {
  .container {
    .title {
      width: 580px;
      height: 90px;
      border-bottom-left-radius: 5vh;
      border-bottom-right-radius: 5vh;
      font-size: 52px;
      margin-bottom: 40px;
    }

    .content {
      margin-bottom: 30px;

      .scroll_box {
        width: 85%;

        .info {
          font-size: 48px;
          margin-top: 0;
          margin-bottom: 10px;
        }

        .question_head {
          padding: 25px 25px;
          font-size: 48px;
          word-wrap: break-word;
          white-space: normal;
        }

        .option_list {
          margin-top: 45px;

          .option {
            min-height: 80px;
            margin-bottom: 25px;

            .context {
              padding: 15px 25px 15px 25px;
              font-size: 48px;
              letter-spacing: 3px;
              word-break: break-all;
            }

            .icon_box {
              width: 60px;
              height: 42px;
              display: flex;
              justify-content: center;
              margin-right: 20px;
              flex-shrink: 0;
              margin-top: -35px;

              .icon {
                margin-top: 0px;
                width: 40px;
                height: auto;
                margin-right: 3vw;
              }
            }
          }
        }

        .analysis {
          width: 100%;
          padding: 20px 40px;
          background-color: #f1efef;
          visibility: hidden;
          transition: all 0.35s ease-out;
          transform: translateY(-20px);
          opacity: 0;

          .tip {
            display: flex;
            align-items: center;
            font-size: 42px;
            font-weight: bold;
            color: #b60611;
            letter-spacing: 3px;
            margin-bottom: 15px;

            img {
              height: 42px;
              margin-right: 20px;
              margin-left: -10px;
            }
          }

          .result {
            width: 100%;
            clear: both;
            margin-left: -10px;
            .txt {
              padding-left: 10px;
              padding-top: 5px;
            }
          }

          .text {
            width: 100%;
            clear: both;
            margin-left: -10px;
            .txt {
              padding-left: 10px;
              padding-top: 5px;
            }
          }

          p {
            font-size: 38px;
            letter-spacing: 3px;
          }
        }

        .btn_group {
          .btn {
            width: 240px;
            height: 100px;
            padding: 6px 2px;
            font-size: 48px;
            border-radius: 10px;
            letter-spacing: 2px;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          }
        }
      }
    }
  }
  .mask {
    .good {
      width: 70vw;

      div {
        font-size: 2.5vh;
        letter-spacing: 0.5vw;
      }
    }
  }
}
</style>
