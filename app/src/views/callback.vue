<template>
  <div>

  </div>
</template>
<script>
import * as data from '../api/data'
import * as token from '../data/token'
import * as coursewareStorage from '../data/courseware'

export default {
  data () {
    return {
      active: false,
    }
  },
  created () {
    const query = this.$route.query
    token.set(query.token)
    this.getJson()
  },
  methods: {
    goHome () {
      location.href = '/?logout=true'
    },
    async getJson () {
      const res = await data.loadJson()
      console.log(res)
      if (res.data == null) {
        console.log('callback response data is null.')
        return
      }

      if (
          res.data.page.child == null ||
          !Array.isArray(res.data.page.child) ||
          res.data.page.child.length === 0
      ) {
        return
      }

      coursewareStorage.set(res.data)
      this.goHome()
    },
  },
}
</script>
