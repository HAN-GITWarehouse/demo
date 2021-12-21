<template>
  <div class="container">
    <div class="content">
      <div class="report">
        <div class="title" :class="language">
          {{ language == "cn" ? "答题报告" : "Answer Report" }}
        </div>
        <div class="statistics">
          <div class="item">
            <img src="../assets/img/report_right.png" alt="" />
            <div class="text">
              <span
                >{{ language == "cn" ? "答对" : "Correct" }}：{{
                  chapter.total_right
                }}</span
              >
            </div>
          </div>
          <div class="item">
            <img src="../assets/img/report_wrong.png" alt="" />
            <div class="text">
              <span
                >{{ language == "cn" ? "答错" : "Wrong" }}：{{
                  chapter.total_wrong
                }}</span
              >
            </div>
          </div>
          <div class="item">
            <img src="../assets/img/report_score.png" alt="" />
            <div class="text">
              <span
                >{{ language == "cn" ? "得分" : "Point" }}：{{
                  chapter.score
                }}</span
              >
            </div>
          </div>
          <div class="item">
            <img src="../assets/img/report_time.png" alt="" />
            <div class="text">
              <span
                >{{ language == "cn" ? "答题用时" : "Time" }}：{{
                  chapter.answer_time
                }}{{ language == "cn" ? "秒" : "seconds" }}</span
              >
            </div>
          </div>
        </div>
        <div class="success">
          <div class="head" :class="language">
            {{
              language == "cn"
                ? "恭喜你成功通过"
                : "Congratulations on your successful completion."
            }}
          </div>
          <div class="tip" :class="language">
            {{
              language == "cn"
                ? "您已完成章节所有课程,并取得优异成绩,"
                : "You have completed all the chapters and received an excellent grade, keep it up!"
            }}
          </div>
          <div class="hope" v-if="language === 'cn'">请继续加油哦!</div>
        </div>
      </div>
      <div class="analysis_box">
        <div class="headline">
          <span :class="language">{{
            language == "cn" ? "答题解析" : "Answer Sheet"
          }}</span>
          <span :class="language">{{
            language == "cn"
              ? "点击题号可查看解析"
              : "Click on the question number to view the analysis"
          }}</span>
        </div>

        <div class="list">
          <div
            class="list_item"
            v-for="(item, index) in question"
            @click="changeIndex(index)"
            :key="item.id"
          >
            <div
              :style="
                item.selected !== undefined && item.selected
                  ? 'background-color:#d9d9d9'
                  : item.correct === 1
                  ? 'background-color:#48bebe'
                  : 'background-color:#db0815'
              "
              @click="selectItem(item, index)"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <div class="decrypt">
          {{ language == "cn" ? "题目解密" : "View Feedback" }}
        </div>

        <div class="scroll_box">
          <div class="subject">
            {{ currentIndex + 1 }}、{{ currentQuestion.label }}
          </div>
          <div
            class="option"
            v-for="(item, index) in currentQuestion.options"
            :key="item.id"
            :class="{ active: item.selected === 1 }"
          >
            {{ prefix[index] }}、{{ item.label }}
          </div>

          <div class="analysis">
            <div class="your_answer">
              {{ language == "cn" ? "你的答案" : "Your Answer" }}：<span
                v-for="item in checkedArr"
                :key="item"
                >{{ prefix[item] }}</span
              >
              <img
                src="../assets/img/report_right.png"
                alt=""
                v-if="currentQuestion.correct === 1"
              />
              <img src="../assets/img/report_wrong.png" alt="" v-else />
            </div>
            <div class="correct_answer">
              {{ language == "cn" ? "正确答案" : "Correct Answer" }}：<span
                v-for="item in rightArr"
                :key="item"
                >{{ prefix[item] }}</span
              >
            </div>
            <div>
              {{ language == "cn" ? "试题解析" : "Feedback" }}：{{
                currentQuestion.prompt
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <foot :language="language" @returnToMenu="returnToMenu"></foot>
  </div>
</template>

<script>
import { getReport } from "../api/data";
import foot from "../component/foot";
import * as config from "../config/config";

export default {
  name: "report",
  components: {
    foot,
  },
  data() {
    return {
      language: "",
      chapter: {},
      question: [],
      currentIndex: 0,
      prefix: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
      checkedArr: [],
      rightArr: [],
      timer: null,
    };
  },
  computed: {
    currentQuestion() {
      if (this.question.length > 0) {
        this.checkedArr = [];
        this.rightArr = [];
        const current = this.question[this.currentIndex];
        current.options.forEach((v, index) => {
          if (v.selected) this.checkedArr.push(index);
          if (v.right) this.rightArr.push(index);
        });
        return current;
      } else {
        return {};
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    // 获取数据
    init() {
      console.log("lang: ", this.getLang());
      this.language = this.getLang();
      let chapter_id =
        this.$route.query.id !== undefined && this.$route.query.id !== null
          ? this.$route.query.id
          : "81d903a0-f4c4-495c-947a-edc8091b4fc4";
      console.log("index get resource id,  url query id:", chapter_id);
      if (
        chapter_id === undefined ||
        chapter_id === null ||
        chapter_id.trim().length === 0
      ) {
        return;
      }

      const callback = (res) => {
        if (!res.data.success) {
          return;
        }

        this.chapter = res.data.data.chapter;
        this.question = res.data.data.question;

        console.log("test ---- get data :", this.chapter);

        if (this.chapter.total_wrong >= 4) {
          this.$router.push({
            path: "/index",
            query: {
              id: "7cc25bfd-da79-449b-9b8e-d86cb1a40621",
            },
          });
          return;
        }
      };

      getReport(chapter_id, this.language).then(callback.bind(this));
    },
    getLang() {
      if (
        this.$route.query.id !== null &&
        this.$route.query.id === config.HOME_ID
      ) {
        localStorage.setItem("lang", "cn");
        return "cn";
      }

      console.log("index page language query lang: ", this.$route.query.lang);
      if (this.$route.query.lang != null) {
        localStorage.setItem("lang", this.$route.query.lang);
        return this.$route.query.lang;
      }

      if (localStorage.getItem("lang") != null) {
        return localStorage.getItem("lang");
      }

      return "cn";
    },
    // 返回到目录
    returnToMenu() {
      this.$router.push({
        path: "/index",
        query: {
          id: "5e1e2425-0606-4e99-9238-414bfa9c1794",
        },
      });
    },
    // 更换答题
    changeIndex(index) {
      this.currentIndex = index;
    },
    selectItem(item, index) {
      item.selected = !item.selected;
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    padding: 33px 37px;
    background-color: #e6e6e6;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;

    .report {
      flex: 1;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        width: 510px;
        height: 80px;
        background: #09263c;
        border-bottom-left-radius: 80px;
        border-bottom-right-radius: 80px;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 44px;
        font-weight: bold;
        letter-spacing: 20px;
      }

      .statistics {
        width: 100%;
        padding: 25px 34px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          display: flex;
          padding: 19px 37px 13px 31px;
          align-items: center;

          img {
            width: 28px;
            margin-right: 13px;
            margin-top: 6px;
          }

          .text {
            font-weight: bold;
            letter-spacing: 1px;
            font-size: 22px;
            display: flex;
            align-items: flex-end;

            span {
              display: inline-block;
              font-size: 36px;
              //vertical-align: bottom;
              line-height: 36px;
            }
          }
        }
      }

      .success {
        width: 543px;
        height: 600px;
        margin-top: 70px;
        background: url("../assets/img/report_bg.png") 0 0 / 100% 100% no-repeat;
        display: flex;
        flex-direction: column;
        align-items: center;

        .head {
          font-weight: bold;
          text-align: center;
          font-size: 27px;
          margin-top: 55px;
          color: #343434;
          letter-spacing: 2px;
        }

        .tip {
          width: 290px;
          font-size: 24px;
          margin-top: 30px;
          text-align: center;
          letter-spacing: 2px;
          opacity: 0.6;

          &.en {
            width: 320px;
            line-height: 28px;
            margin-top: 15px;
          }

          &.cn {
            width: 340px;
            line-height: 42px;
            margin-top: 12px;
          }
        }

        .hope {
          font-size: 24px;
          letter-spacing: 2px;
          font-weight: bold;
        }
      }
    }

    .analysis_box {
      width: 700px;
      height: 100%;
      background-color: #fff;
      margin-left: 30px;
      padding: 58px 50px 30px 50px;
      display: flex;
      flex-direction: column;

      .headline {
        border-bottom: 1px solid #c7c7c7;
        color: #061841;
        padding-bottom: 10px;

        span:first-of-type {
          font-size: 34px;
          font-weight: bold;
          margin-right: 7px;
          letter-spacing: 4px;
        }

        span:last-of-type {
          font-size: 26px;
          letter-spacing: 2px;

          &.en {
            font-size: 14px;
          }
        }
      }

      .list {
        margin-top: 35px;
        display: flex;
        flex-wrap: wrap;

        .list_item {
          flex: 0 0 13.3333%;
          //width: 80px;
          height: 80px;
          margin-right: 3.5%;

          margin-bottom: 21px;
          cursor: pointer;

          div,
          img {
            width: 100%;
            border-radius: 16px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          div {
            background: #c7c7c7;
            opacity: 0.8;
            color: #ffffff;
            font-size: 30px;
            font-weight: bold;
          }

          &:nth-of-type(6n) {
            margin-right: 0;
          }

          &:nth-of-type(n + 7) {
            margin-bottom: 0;
          }
        }
      }

      .decrypt {
        font-size: 26px;
        border-bottom: 1px solid #c7c7c7;
        padding-bottom: 10px;
        margin-top: 60px;
      }

      .scroll_box {
        flex: 1;
        overflow-y: scroll;

        .subject {
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 2px;
          margin-top: 25px;
        }

        .option {
          font-size: 18px;
          padding-left: 25px;
          margin-top: 20px;

          &.active {
            font-weight: bold;
          }
        }

        .analysis {
          margin-top: 26px;
          padding: 10px 14px;
          background-color: rgba(219, 8, 21, 0.07);

          .your_answer,
          .correct_answer {
            font-size: 18px;
            font-weight: bold;

            span {
              display: inline-block;
              margin-right: 5px;
            }
          }

          .your_answer {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            img {
              width: 26px;
              margin-left: 20px;
            }
          }

          div:last-of-type {
            font-size: 16px;
            margin-top: 10px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 812px) {
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      padding: 33px 37px;
      background-color: #e6e6e6;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      overflow: hidden;

      .report {
        flex: 1;
        height: 100%;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
          width: 510px;
          height: 80px;
          background: #09263c;
          border-bottom-left-radius: 80px;
          border-bottom-right-radius: 80px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 44px;
          font-weight: bold;
          letter-spacing: 20px;
        }

        .statistics {
          width: 100%;
          padding: 25px 34px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .item {
            display: flex;
            padding: 19px 37px 13px 31px;
            align-items: center;

            img {
              width: 28px;
              margin-right: 13px;
              margin-top: 6px;
            }

            .text {
              font-weight: bold;
              letter-spacing: 1px;
              font-size: 22px;
              display: flex;
              align-items: flex-end;

              span {
                display: inline-block;
                font-size: 36px;
                margin-top: 5px;
              }
            }
          }
        }

        .success {
          width: 603px;
          height: 620px;
          margin-top: 70px;
          background: url("../assets/img/report_bg.png") 0 0 / 100% 100%
            no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;

          .head {
            font-weight: bold;
            text-align: center;
            font-size: 32px;
            margin-top: 35px;
            color: #343434;
            letter-spacing: 2px;

            &.en {
              width: 460px;
              line-height: 36px;
              margin-top: 40px;
            }
          }

          .tip {
            width: 290px;
            font-size: 24px;
            margin-top: 30px;
            text-align: center;
            letter-spacing: 2px;
            opacity: 0.6;

            &.en {
              width: 420px;
              line-height: 28px;
              margin-top: 10px;
            }
          }

          .hope {
            font-size: 24px;
            letter-spacing: 2px;
            font-weight: bold;
          }
        }
      }

      .analysis_box {
        width: 700px;
        height: 100%;
        background-color: #fff;
        margin-left: 30px;
        padding: 58px 50px 30px 50px;
        display: flex;
        flex-direction: column;

        .headline {
          border-bottom: 1px solid #c7c7c7;
          color: #061841;
          padding-bottom: 10px;

          span:first-of-type {
            font-size: 34px;
            font-weight: bold;
            margin-right: 7px;
            letter-spacing: 4px;
          }

          span:last-of-type {
            font-size: 20px;
            letter-spacing: 2px;

            &.en {
              font-size: 14px;
            }
          }
        }

        .list {
          margin-top: 35px;
          display: flex;
          flex-wrap: wrap;

          .list_item {
            flex: 0 0 13.3333%;
            //width: 80px;
            height: 80px;
            margin-right: 3.5%;

            margin-bottom: 21px;
            cursor: pointer;

            div,
            img {
              width: 100%;
              border-radius: 16px;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            div {
              background: #c7c7c7;
              opacity: 0.8;
              color: #ffffff;
              font-size: 30px;
              font-weight: bold;
            }

            &:nth-of-type(6n) {
              margin-right: 0;
            }

            &:nth-of-type(n + 7) {
              margin-bottom: 0;
            }
          }
        }

        .decrypt {
          font-size: 26px;
          border-bottom: 1px solid #c7c7c7;
          padding-bottom: 10px;
          margin-top: 60px;
        }

        .scroll_box {
          flex: 1;
          overflow-y: scroll;

          .subject {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 25px;
          }

          .option {
            font-size: 18px;
            padding-left: 25px;
            margin-top: 20px;

            &.active {
              font-weight: bold;
            }
          }

          .analysis {
            margin-top: 26px;
            padding: 10px 14px;
            background-color: rgba(219, 8, 21, 0.07);

            .your_answer,
            .correct_answer {
              font-size: 18px;
              font-weight: bold;

              span {
                display: inline-block;
                margin-right: 5px;
              }
            }

            .your_answer {
              display: flex;
              align-items: center;
              margin-bottom: 10px;

              img {
                width: 26px;
                margin-left: 20px;
              }
            }

            div:last-of-type {
              font-size: 16px;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 2340px) {
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      padding: 33px 37px;
      background-color: #e6e6e6;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      overflow: hidden;

      .report {
        flex: 1;
        height: 100%;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
          width: 510px;
          height: 80px;
          background: #09263c;
          border-bottom-left-radius: 80px;
          border-bottom-right-radius: 80px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 44px;
          font-weight: bold;
          letter-spacing: 20px;
        }

        .statistics {
          width: 100%;
          padding: 25px 34px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .item {
            display: flex;
            padding: 19px 37px 13px 31px;
            align-items: center;

            img {
              width: 28px;
              margin-right: 13px;
              margin-top: 6px;
            }

            .text {
              font-weight: bold;
              letter-spacing: 1px;
              font-size: 22px;
              display: flex;
              align-items: flex-end;

              span {
                display: inline-block;
                font-size: 36px;
                margin-top: 5px;
              }
            }
          }
        }

        .success {
          width: 603px;
          height: 620px;
          margin-top: 70px;
          background: url("../assets/img/report_bg.png") 0 0 / 100% 100%
            no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;

          .head {
            font-weight: bold;
            text-align: center;
            font-size: 32px;
            margin-top: 35px;
            color: #343434;
            letter-spacing: 2px;

            &.en {
              width: 460px;
              line-height: 36px;
              margin-top: 40px;
            }
          }

          .tip {
            width: 290px;
            font-size: 24px;
            margin-top: 30px;
            text-align: center;
            letter-spacing: 2px;
            opacity: 0.6;

            &.en {
              width: 420px;
              line-height: 28px;
              margin-top: 10px;
            }
          }

          .hope {
            font-size: 24px;
            letter-spacing: 2px;
            font-weight: bold;
          }
        }
      }

      .analysis_box {
        width: 700px;
        height: 100%;
        background-color: #fff;
        margin-left: 30px;
        padding: 58px 50px 30px 50px;
        display: flex;
        flex-direction: column;

        .headline {
          border-bottom: 1px solid #c7c7c7;
          color: #061841;
          padding-bottom: 10px;

          span:first-of-type {
            font-size: 50px;
            font-weight: bold;
            margin-right: 7px;
            letter-spacing: 4px;
          }

          span:last-of-type {
            font-size: 38px;
            letter-spacing: 2px;

            &.en {
              font-size: 14px;
            }
          }
        }

        .list {
          margin-top: 35px;
          display: flex;
          flex-wrap: wrap;

          .list_item {
            flex: 0 0 13.3333%;
            //width: 80px;
            height: 80px;
            margin-right: 3.5%;

            margin-bottom: 21px;
            cursor: pointer;

            div,
            img {
              width: 100%;
              border-radius: 16px;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            div {
              background: #c7c7c7;
              opacity: 0.8;
              color: #ffffff;
              font-size: 30px;
              font-weight: bold;
            }

            &:nth-of-type(6n) {
              margin-right: 0;
            }

            &:nth-of-type(n + 7) {
              margin-bottom: 0;
            }
          }
        }

        .decrypt {
          font-size: 50px;
          font-weight: bold;
          border-bottom: 1px solid #c7c7c7;
          padding-bottom: 10px;
          margin-top: 60px;
        }

        .scroll_box {
          flex: 1;
          overflow-y: scroll;

          .subject {
            font-size: 40px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 25px;
          }

          .option {
            font-size: 40px;
            padding-left: 25px;
            margin-top: 20px;

            &.active {
              font-weight: bold;
            }
          }

          .analysis {
            margin-top: 26px;
            padding: 10px 14px;
            background-color: rgba(219, 8, 21, 0.07);

            .your_answer,
            .correct_answer {
              font-size: 40px;
              font-weight: bold;

              span {
                display: inline-block;
                margin-right: 5px;
              }
            }

            .your_answer {
              display: flex;
              align-items: center;
              margin-bottom: 10px;

              img {
                width: 50px;
                margin-left: 40px;
              }
            }

            div:last-of-type {
              font-size: 40px;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
