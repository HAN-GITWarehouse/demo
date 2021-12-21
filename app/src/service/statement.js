import { behaviorEnd, behaviorStart } from "../api/data"
import * as StatementService from "../service/statement"

export const getTime = () => {
  return Math.round(new Date().getTime() / 1000)
}

export const newStatement = () => {
  const data = {
    checked: false,
    current: 0,
    type: 0,
    score: 0,
  }

  return data
}

/**
 *
 * @param _this vue全局对象
 * @param item 执行对象
 * @param targetId 要跳转的页面Id
 * @param current 学习进度
 * @param finish 是否完成
 * @param data 答题数据
 * @param delay 跳转延迟
 * @returns {Promise<void>}
 */
export const sendStatement = (
  _this,
  item,
  targetId,
  current = 0,
  finish,
  data,
  delay = 0
) => {
  if (data === undefined || data === null || data === {}) {
    return
  }

  let statement = StatementService.newStatement()
  let dataStatement = item.statement
  statement.resources_id = item.id
  statement.resources_type = item.type
  statement.lang = localStorage.getItem("lang")
  statement.data = data ? data : {}
  if (finish) statement.type = 1
  // if (dataStatement) {
  //   statement.id = dataStatement.id
  //   statement.current = current ? current : dataStatement.current
  //   statement.end_time = StatementService.getTime()
  //   behaviorEnd(statement).then((res) => {
  //     if (!res.success) {
  //       console.error("statement end service: ", res)
  //     }
  //   })
  // } else {

  // }

  statement.start_time = StatementService.getTime()
  behaviorStart(statement).then((res) => {
    if (!res.data.success) {
      console.error("statement start service: ", res)
    }
  })
}
