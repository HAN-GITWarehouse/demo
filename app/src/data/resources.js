import * as coursewareStorage from './courseware'
import Tree from '../utils/tree'


class Resources {
  constructor () {
    if(!Resources.instance){
      this.init()
      this.courseware={}
    }

    Resources.instance = this
    return Resources.instance
  }
  
  init () {
    const courseware = coursewareStorage.get()
    this.courseware = courseware
    
    if (!courseware) {
      return
    }
    
    const home = courseware.page.child[0]
    const tree = new Tree()    
    this.resources = tree.maps(home)
  }
  
  find (id) {
    return this.resources.get(id)
  }
  
  findNext (id) {
    return this.find(this.find(id).next_id)
  }
  
  findParent (id) {
    return this.find(this.find(id).parent_id)
  }
  
  findParentNext (id) {
    return this.findNext(this.findParent(id).id)
  }
  
  save(){
  
  }
}

const ResourcesInstance = new Resources()
export default ResourcesInstance