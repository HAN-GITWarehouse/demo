<template>
  <div class="background">
    <slot></slot>
    <div class="content">
      <div class="study_time">
        {{ language == "cn" ? "已累计学习时长" : "Seat Time: " }}
        <span>{{ hour }}</span
        >{{ language == "cn" ? "小时" : "h" }} <span>{{ minute }}</span
        >{{ language == "cn" ? "分" : "m" }}
      </div>

      <div class="menu_list">
        <div
          class="menu_item"
          :class="item.state"
          :data-show="item.show"
          v-for="(item, index) of page.menu_list"
          :key="item.id"
          @click="jump(item, index)"
        >
          <div class="lang" :class="language" :id="item.id">
            {{ item.label }}
          </div>
          <img src="../assets/img/arrow.png" alt="" />
        </div>
      </div>

      <div class="state_list">
        <div class="state_item">
          <div class="not_yet"></div>
          <div class="status">
            {{ language == "cn" ? "未开始" : "Not started" }}
          </div>
        </div>
        <div class="state_item">
          <div class="learning"></div>
          <div class="status">
            {{ language == "cn" ? "进行中" : "In progress" }}
          </div>
        </div>
        <div class="state_item">
          <div class="finish"></div>
          <div class="status">
            {{ language == "cn" ? "已完成" : "Completed" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendStatement } from "../service/statement";
import * as StudyTime from "../data/studyTime";

export default {
  name: "Home",
  props: ["page", "language"],
  data() {
    return {
      hour: "00", // 学习小时
      minute: "00", // 学习分钟
      showUltimate: false, // 是否显示终 极测试
      content: "",
    };
  },
  filters: {
    filterStatus(val) {
      console.log("test components filter ________", val);
      switch (val) {
        case 0:
          return "";
        case 1:
          return "studying";
        case 2:
          return "finish";
        default:
          return "";
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      console.log("menu vue, page: ", this.page);
      this.countTime();

      let studying = this.page.menu_list.filter((v) => v.chapter_state !== 2);

      console.log("menu vue, menu list: ", this.page.menu_list);

      this.page.menu_list.forEach((v) => {
        if (
          studying !== null &&
          studying.length > 0 &&
          v.id === studying[0].id
        ) {
          v.state = "studying";
        } else {
          v.state = v.chapter_state == 2 ? "finish" : "";
        }
      });

      console.log("menu vue, menu list: ", this.page.menu_list);
    },

    // 跳转
    jump(val, index) {
      console.log("test data resource:", val);
      if (val.state === "" || val.state.length == 0) {
        return;
      }

      if (this.page.menu_list.length - 1 === index && val.chapter_state === 2) {
        this.$router.push({
          path: "/report",
          query: {
            id: "81d903a0-f4c4-495c-947a-edc8091b4fc4",
          },
        });
      }

      StudyTime.set(val.id, val.chapter_time);

      console.log("val.child[0].id: ", val.child[0]);

      const menu_options = {
        id: val.child[0],
        catalog_id: this.page.id,
        next_chapter_id: this.page.menu_list[index + 1]
          ? this.page.menu_list[index + 1].child[0]
          : null,
      };

      this.$emit("changeMenu", menu_options);

      sendStatement(this, this.page, this.page.id, 0, true, this.page);
    },

    // 计算学习时长
    countTime() {
      console.log("menu vue, countTime: ", this.page.learning_time);
      const time = this.page.learning_time;

      let hour = Math.floor(time / 60 / 60);
      hour = hour < 1 ? "0" : hour;

      let minute = Math.floor((time - hour * 60 * 60) / 60);
      minute = minute < 1 ? "1" : minute;

      this.hour = hour;
      this.minute = minute;

      console.log(
        "menu vue, countTime, hour, minute: ",
        this.page.learning_time,
        this.hour,
        (this.minute = minute)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.background {
  width: 100%;
  min-height: 100%;
  background: url("../assets/img/bg.jpg") 0 0 / 100% 100% no-repeat;
  display: flex;
  justify-content: center;
  position: relative;
  overflow-y: auto;

  .content {
    width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .study_time {
      width: 550px;
      height: 80px;
      font-size: 30px;
      background-color: #09263c;
      border-bottom-left-radius: 80px;
      border-bottom-right-radius: 80px;
      color: #ffffff;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6vh;

      span {
        font-size: 38px;
        margin-bottom: 1px;
        color: #ffffff;
      }
    }

    .menu_list {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;

      .menu_item {
        flex: 1;
        width: 100%;
        background-color: #d9d9d9;
        border-radius: 16px;
        opacity: 0.7;
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        margin-bottom: 25px;
        align-items: center;
        cursor: pointer;

        .lang {
          font-size: 30px;
          font-weight: bold;
          letter-spacing: 8px;
        }

        img {
          width: 45px;
          vertical-align: center;
        }
      }

      .menu_item:last-of-type {
        margin-bottom: 0;
      }

      .menu_item.studying {
        opacity: 1;
        background-color: #db0815;
        box-shadow: 0 0.8vh 0 #b60611;

        .lang {
          color: #ffffff;
        }
      }

      .menu_item.finish {
        opacity: 1;
        background-color: #48bebe;
        box-shadow: 0 8px 0 #4aaaaa;

        .lang {
          color: #ffffff;
        }
      }
    }

    .state_list {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin: 30px 0 20px 0;

      .state_item {
        font-size: 22px;
        margin-left: 40px;
        display: flex;
        align-items: center;

        div:first-of-type {
          width: 22px;
          height: 22px;
        }

        div:last-of-type {
          margin-left: 8px;
          opacity: 0.8;
          line-height: 22px;
        }

        .not_yet {
          background-color: #d9d9d9;
        }

        .learning {
          // background-color: #48BEBE;
          background-color: #db0815;
        }

        .finish {
          // background-color: #DB0815;
          background-color: #48bebe;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .background {
    .content {
      width: 85%;

      .menu_list {
        .menu_item {
          max-height: 100px;

          .lang {
            font-size: 36px;
          }

          img {
            width: 50px;
          }
        }
      }

      .state_list {
        align-items: center;
        justify-content: center;

        .state_item {
          //font-size: 1.8vh;
          //margin-left: 2vw;

          div:first-of-type {
            //display: inline-block;
            width: 20px;
            height: 20px;
          }

          &:first-of-type {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>
