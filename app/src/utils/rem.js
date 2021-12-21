const baseSize = 16

// 设置 rem 函数
function setRem () {
  let designWidth
  const clientWidth = document.documentElement.clientWidth
  if (clientWidth <= 768) {
    designWidth = 1000
  } else {
    designWidth = 1920
  }
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  const scale = document.documentElement.clientWidth / 1920
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
}

// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}