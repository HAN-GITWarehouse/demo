<template>
  <div class="footer">
    <img src="../assets/img/logo.svg" alt="" class="logo">
    <div class="operation">
      <div class="studied" v-if="user">
        <div class="username">{{ user.username }}</div>
        <img src="../assets/img/clock.svg" class="clock" alt="">
        <div class="time">
          <span class="txt">{{ language=='cn' ? '已学习' : "Studied" }}</span>
          <span class="num">{{ timeFilter(studyTime) }}</span>
          </div>
      </div>
      <div class="menu click" :class="language" @click="backToMenu">{{ language=='cn' ? '目录' : 'Contents' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['page','language', 'user', 'studyTime'],
  name: 'foot',
  data () {
    return {}
  },
  methods: {
    backToMenu () {
      this.$emit('returnToMenu')
    },
    // 时间格式化
    timeFilter (time) {
      let result = parseInt(time)
      let m =
          Math.floor((result / 60) % 60) < 10
              ? '0' + Math.floor((result / 60) % 60)
              : Math.floor((result / 60) % 60)
      let s =
          Math.floor(result % 60) < 10
              ? '0' + Math.floor(result % 60)
              : Math.floor(result % 60)
      let res = ''
      switch (this.language) {
        case 'cn':
          res += `${m}:${s}`
          break
        case 'en':
          res += `${m}:${s}`
          break
        default:
          res += `${m}:${s}`
          break
      }
      return res
    },
  }
}
</script>

<style scoped lang="scss">
.footer {
  flex-shrink: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(0, 36, 60);

  .logo {
    height: 40px;
    margin-left: 66px;
  }

  .operation {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;


    .studied {
      height: 100%;
      height: 40px;
      background: #48BEBE;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 5px;

      .username {
        font-size: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        text-align: center;
        color: #FFFFFF;
      }

      img {
        margin-left: 10px;
        margin-top: 2px;
        height: 20px;
      }
    
      .time {
        padding: 10px;
       
        margin-left: 10px;
        color: #ffffff;
        .txt{
            font-size: 25px;
              color: #ffffff;
        }
        .num{
               padding-left: 5px;
          font-size:30px;
            color: #ffffff;
        }
      }
    }

    .menu {
      height: 40px;
      padding: 3.5px 10px;
      border: 1px solid #FFFFFF;
      border-radius: 6px;
      color: #ffffff;
      margin-right: 41px;
      font-size: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      letter-spacing: 4px;
      margin-left: 35px;
    }
  }
}
@media only screen and (max-width: 812px) {
.footer {
  flex-shrink: 0;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(0, 36, 60);

  .logo {
    height: 60px;
    margin-left: 66px;
  }

  .operation {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;


    .studied {
      height: 100%;
      height: 90px;
      background: #48BEBE;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 5vw;

      .username {
        font-size: 55px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        text-align: center;
        color: #FFFFFF;
      }

      img {
        margin-left: 10px;
        margin-top: 2px;
        height: 55px;
      }
      .time {
        padding: 10px;
       
        margin-left: 10px;
        color: #ffffff;
        .txt{
            font-size: 55px;
              color: #ffffff;
        }
        .num{
          padding-left: 10px;
          font-size:60px;
            color: #ffffff;
        }
      }
    }

    .menu {
      height: 82px;
      padding: 3.5px 10px;
      border: 1px solid #FFFFFF;
      border-radius: 6px;
      color: #ffffff;
      margin-right: 41px;
      font-size: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      letter-spacing: 4px;
      margin-left: 35px;
    }
  }
}
}

@media only screen and (max-width: 2340px) {
.footer {
  flex-shrink: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(0, 36, 60);

  .logo {
    height: 72px;
    margin-left: 66px;
  }

  .operation {
    padding-left: 30px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .studied {
      height: 70px;
      background: #48BEBE;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 5vw;

      .username {
        font-size: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        text-align: center;
        color: #FFFFFF;
      }

      img {
        margin-left: 10px;
        margin-top: 2px;
        height: 55px;
      }

      .time {
        padding: 10px;       
        margin-left: 0px;
        color: #ffffff;

        .txt{
            font-size: 40px;
            color: #ffffff;
        }

        .num{
          padding-left: 10px;
          font-size:40px;
          color: #ffffff;
        }
      }
    }

    .menu {
      height: 70px;
      width: 240px;
      padding: 3.5px 10px;
      border: 1px solid #FFFFFF;
      border-radius: 6px;
      color: #ffffff;
      margin-right: 41px;
      font-size: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      letter-spacing: 4px;
      margin-left: 35px;
    }
  }
}
}

</style>