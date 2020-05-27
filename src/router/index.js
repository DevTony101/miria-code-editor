import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Documentation from "../views/Documentation";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/docs",
    name: "Documentation",
    component: Documentation,
  },
  {
    path: "/404",
    name: "404",
    props: true,
    component: () => import("../views/NotFound.vue"),
  },
  {
    path: "*",
    redirect: { name: "404", params: { resource: "page" } },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
