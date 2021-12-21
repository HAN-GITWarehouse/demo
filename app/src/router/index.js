import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "*",
      name: "index",
      component: () => import("../views/index"),
    },
    {
      path: "/callback",
      name: "callback",
      component: () => import("../views/callback"),
    },
    {
      path: "/report",
      name: "report",
      component: () => import("../views/report"),
    },
  ],
})

export default router
