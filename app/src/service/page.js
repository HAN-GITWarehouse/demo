import * as coursewareStorage from "../data/courseware"
import * as lastIdStorage from "../data/last.id"
import Tree from "../utils/tree"
import Resource from "../data/resources"
export default class Page {
  constructor(options) {
    // console.log('service page constructor: ', options)
    this._map = options.map
    this._courseware = options.courseware

    if (options.courseware == null) {
      return
    }

    this._root = options.courseware.page.child[0]

    if (options.id) {
      this.build(options.id)
    }
  }

  build(id) {
    this._id = id
    if (this._id.includes(":")) {
      this._visualData = this._map.get(this._id)
      this._realData = new Tree().findRealNode(this._root, this._visualData)
    } else {
      this._visualData = Resource.find(this._id)
      this._realData = Resource.find(this._id)
    }

    if (this._realData === undefined || this._realData === null) {
      return
    }

    if (this._realData.index === undefined) {
      return
    }

    // console.log('real data: ', this._id, this._realData);
    this.index = this._realData.index
    this.type = this._realData.component
    this.pages = this._courseware
  }

  set id(id) {
    this.build(id, true)
    lastIdStorage.set(id)
  }

  get id() {
    return this._id
  }

  get data() {
    return this._realData
  }

  get label() {
    return this._realData.label
  }

  get child() {
    const child = []
    console.log("service page child: ", this._id, this._visualData)
    this._visualData.child.forEach((v) => {
      child.push(
        new Page({
          id: v.id,
          courseware: this._courseware,
          map: this._map,
        })
      )
    })

    return child
  }

  save() {
    coursewareStorage.set(this._courseware)
  }
}
