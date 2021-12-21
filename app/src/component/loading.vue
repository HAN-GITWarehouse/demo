<template>
  <div class="loading-container">
    <div class="loading-description">
      {{ language == 'cn' ? '终极测试已提交成功，您可以关闭此页面。若考试不通过我们将另外组织考核。感谢您的支持！' : ' The test result has been submitted successfully; you can close this page.If you fail the test, we will organize another one. Thank you for your support....' }}
    
     
    </div>
    <div class="ball-container">
      <div class="ball-one"></div>
      <div class="ball-two"></div>
      <div class="ball-three"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",

  data() {
    return {
      language:localStorage.getItem('lang')
    };
  },
};
</script>

<style lang="scss" scoped>
.grid {
  background-image: -webkit-linear-gradient(top, transparent 49px, #bfbebe 50px),
    -webkit-linear-gradient(left, transparent 49px, #bfbebe 50px);

  background-size: 50px 50px;
  background-repeat: repeat; /*先画个网格，便于布局*/
}

/*loading-container*/

.loading-container {
  width: 20%;
  height: 20%;
  background: #48BEBE;
  border-radius: 10px;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.ball-container::after {
  content: "";
  display: block;
  clear: both;
}

.ball-container div {
  position: relative;
  width: 15px;
  height: 15px;
  background-color: grey;
  float: left;
  border-radius: 50%;
  margin-right: 20px;
}

.ball-one {
  -webkit-animation-name: ball-animation;
  -webkit-animation-duration: 1.5s;
  -webkit-animation-iteration-count: infinite;
}

.ball-two {
  -webkit-animation-name: ball-animation;
  -webkit-animation-duration: 1.5s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-delay: 0.25s;
}

.ball-three {
  -webkit-animation-name: ball-animation;
  -webkit-animation-duration: 1.5s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-delay: 0.5s;
}

/*加载描述信息*/
.loading-description {
  font-size: 20px;
  text-align: left;
  padding-left: 14px;
  margin-bottom: 10px;
  color: #fff;
  padding: 10px;
}

@-webkit-keyframes ball-animation {
  0% {
    -webkit-transform: scale(0);
    opacity: 0;
  }

  75% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
}
</style>
