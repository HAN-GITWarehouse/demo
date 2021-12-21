<template>
  <component
    v-if="page != null"
    :is="page.component"
    :mobile="mobile"
    :language="language"
    :user="user"
    :key="page.id"
    :page="page"
    :catalog_id="catalog_id"
    :next_chapter_id="next_chapter_id"
    @changeId="idChange"
    @changeMenu="changeMenu"
    v-cloak
  >
    <div class="logout">
      <img class="click" @click="toggleLogout" src="../assets/img/logout.svg" />
      <div @click="logout">
        {{ language == "cn" ? "退出登录" : "LOGIN OUT" }}
      </div>
    </div>
    <div
      class="cover"
      :class="{ active: showLogout }"
      @click.self="toggleLogout"
    >
      <div class="dialog">
        <div class="text" :class="language">{{ $t("confirm_login_out") }}</div>
        <div class="confirm click" :class="language" @click="logout">
          {{ $t("confirm") }}
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import g2fhwVideo from "../component/home";
import g2fhwMenu from "../component/menu";
import g2fhwQuestion from "../component/question";
import g2fhwPicture from "../component/picture";
import g2fhwUltimateQuestion from "../component/ultimate.question";
import * as sso from "../api/sso";
import * as coursewareStorage from "../data/courseware";
import * as token from "../data/token";
import * as config from "../config/config";
import * as lastId from "../data/last.id";
import { getContent } from "../api/data";
import { sendStatement } from "../service/statement";

export default {
  components: {
    g2fhwVideo,
    g2fhwMenu,
    g2fhwQuestion,
    g2fhwPicture,
    g2fhwUltimateQuestion,
  },
  data() {
    return {
      page: null,
      catalog_id: "5e1e2425-0606-4e99-9238-414bfa9c1794",
      next_chapter_id: null,
      env_path: {
        development: "dev",
        production: "pro",
        test: "test",
      },
      user: "",
      showLogout: false, // 显示退出弹窗
      mobile: false, // 是不是移动端
      language: false, // 语言
    };
  },
  watch: {
    "page.id"(val) {
      console.log(
        "index history push state: ",
        { id: this.page.id },
        "",
        `?id=${this.page.id}`
      );
      window.history.pushState({ id: this.page.id }, "", `?id=${this.page.id}`);
    },
  },
  created() {
    this.language = this.getLang();
    let id = this.getResourceId();
    lastId.set(id);

    if (!sso.isLogin()) {
      sso.login();
      return;
    }

    if (id === config.HOME_ID) {
      this.language = "cn";
      this.page = {
        id: id,
        component: "g2fhwVideo",
      };
      return;
    }

    window.addEventListener("popstate", (event) => {
      console.log(
        "index history push state: ",
        { id: event.state.id },
        "",
        `?id=${event.state.id}`
      );
      this.loadPage(event.state.id);

      return false;
    });

    this.loadPage(id);
  },
  methods: {
    loadPage(id) {
      console.log("index created, current page id: ", id, this.language);

      lastId.set(id);

      this.isMobile();

      const callback = (res) => {
        console.log("index vue resource result: ", res.data);
        if (!res.data.success) {
          if (res.data.code === 40001) {
            sso.login();
          }

          return;
        }

        // 0=>课件，1=>视频，2=>图片，3=>文本，4=>富文本，5=>菜单，6=>题目，7=>动题，8=>终极测试，9=>动态资源，10=>gif提示
        const components = {
          1: "g2fhw-video",
          2: "g2fhw-picture",
          5: "g2fhw-menu",
          6: "g2fhw-question",
          7: "g2fhw-question",
          8: "g2fhw-ultimate-question",
          10: "g2fhw-picture",
        };

        const resource = res.data.data;
        if (resource.type !== undefined) {
          resource.component = components[resource.type];
        }

        this.page = resource;
        const finish =
          this.page.last_view === undefined || this.page.last_view === null
            ? false
            : this.page.last_view;
        if (!finish) {
          console.log("index vue, statement: ", this.page);
          sendStatement(this, this.page, this.page.id, 0, true, this.page);
        }

        console.log("index vue page: ", this.page);

        if (localStorage.getItem("state")) {
          localStorage.removeItem("state");
        }

        const version = "2.0";
        const edition = localStorage.getItem("edition");
        console.log(edition);

        if (edition && edition !== version) {
          localStorage.clear();
        }

        localStorage.setItem("edition", version);

        const courseware = coursewareStorage.get();
        console.log("use", this.user);
        if (courseware == null) {
          console.log("courseware is null.");
          return;
        }

        console.log(this.$route);
        this.user = courseware.user;

        console.log(
          "index created, current page id: ",
          id,
          this.language,
          courseware.user
        );
      };

      getContent(id).then(callback.bind(this));
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
    getResourceId() {
      const lastid = lastId.get();
      if (this.$route.query.logout) {
        return config.HOME_ID;
      }

      let id =
        this.$route.query.id !== undefined && this.$route.query.id !== null
          ? this.$route.query.id
          : this.$route.query.pageid;
      console.log("index get resource id,  url query id:", id);

      if (id !== undefined && id !== null && id.trim().length > 0) {
        return id;
      }

      id = lastid;
      console.log(
        "index get resource id, local storage last id:",
        id,
        id === null
      );
      if (!(id === null)) {
        console.log(
          "index get resource id, local storage last id, out:",
          id,
          id !== null
        );
        return id;
      }

      console.log(
        "index get resource id, start get courseware statement last page id:",
        id
      );
      const courseware = coursewareStorage.get();
      if (
        courseware !== null &&
        courseware !== undefined &&
        courseware.statement !== null &&
        courseware.statement.last_page !== undefined &&
        courseware.statement.last_page != null
      ) {
        console.log(
          "index page id, courseware.statement.last_page: ",
          courseware.statement.last_page
        );
        id = courseware.statement.last_page;
        if (id !== undefined && id !== null && id.trim().length > 0) {
          return id;
        }
      }

      console.log("index get resource id, courseware.statement.last_page:", id);
      return config.HOME_ID;
    },
    // 是不是移动端
    isMobile() {
      const agent = navigator.userAgent;
      const arr = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod",
      ];
      arr.some((v) => {
        if (agent.includes(v)) {
          this.mobile = true;
          return true;
        }
      });
    },
    // 退出登录
    logout() {
      // window.location.href = `${process.env.NODE_ENV === 'development' ? baseURL.auth : location.origin}/sso/${this.env_path[process.env.NODE_ENV]}`
      console.log("index page, to logout: ", token);
      token.del();
      location.href = `/?id=${config.HOME_ID}&lang=cn&logout=1`;
    },
    changeMenu(options) {
      console.log("index vue, change menu: ", options);
      this.next_chapter_id = options.next_chapter_id;
      this.catalog_id = options.catalog_id;

      this.loadPage(options.id);
    },
    changeNextChapterId(id) {
      console.log("index vue, change next chapter id: ", id);
      this.next_chapter_id = id;
    },
    changeCatalogId(id) {
      this.catalog_id = id;
    },
    // 切换页面id
    idChange(id) {
      if (id === undefined || id === null) {
        id = this.catalog_id;
      }

      this.loadPage(id);
    },
    // 显示退出
    toggleLogout() {
      if (this.mobile) {
        //移动端浏览器
        this.showLogout = !this.showLogout;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.logout {
  position: fixed;
  top: 25px;
  right: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;

  img {
    width: 45px;
    padding-bottom: 15px;
  }

  img:hover + div,
  div:hover {
    visibility: visible;
    opacity: 1;
  }

  img:hover {
    content: url("../assets/img/logout_active.svg");
  }

  div {
    padding: 7px 16px;
    letter-spacing: 1px;
    font-size: 18px;
    border-radius: 30px;
    background: #db0815;
    color: white;
    transition: all 0.5s;
    visibility: hidden;
    opacity: 0;
    cursor: pointer;
  }
}

.cover {
  display: none;
}

@media only screen and (max-width: 812px) {
  .logout {
    top: 30px;
    right: 30px;
    align-items: flex-end;

    img {
      width: 130px;
      padding-bottom: 30px;
    }

    img:hover + div,
    div:hover {
      visibility: hidden;
      opacity: 0;
    }

    img:hover {
      content: "";
    }

    div {
      padding: 80px 200px 80px;
      letter-spacing: 1px;
      font-size: 25px;
    }
  }

  .cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    opacity: 0;
    transition: all 0.5s ease-out;

    .dialog {
      width: 400px;
      height: 200px;
      background: url("../assets/img/logout_dialog.png") 0 0 /100% 100% no-repeat;
      text-align: center;
      opacity: 0;

      .text {
        width: 100%;
        margin-top: 80px;
        color: white;
        font-size: 25px;
        letter-spacing: 3px;
        font-weight: bold;
        text-align: center;
      }

      .confirm {
        display: inline-block;
        color: white;
        font-size: 25px;
        margin-top: 20px;
        text-align: center;
        letter-spacing: 2px;
      }
    }
  }

  .cover.active {
    visibility: visible;
    opacity: 1;

    .dialog {
      animation: bounceIn 0.5s ease-out forwards;
    }
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    -webkit-transform: scale(0.3);
    -ms-transform: scale(0.3);
    transform: scale(0.3);
  }

  50% {
    opacity: 1;
    -webkit-transform: scale(1.05);
    -ms-transform: scale(1.05);
    transform: scale(1.05);
  }

  75% {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }
}
</style>
