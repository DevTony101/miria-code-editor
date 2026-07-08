import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Documentation from "../views/Documentation.vue";

const routes: any = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/docs",
    name: "Documentation",
    component: Documentation,
    redirect: "/docs/overview",
    children: [
      { path: "overview", component: () => import("../views/docs/Overview.vue") },
      { path: "getting-started", component: () => import("../views/docs/GettingStarted.vue") },
      { path: "variables", component: () => import("../views/docs/Variables.vue") },
      { path: "control-flow", component: () => import("../views/docs/ControlFlow.vue") },
      { path: "enums", component: () => import("../views/docs/Enums.vue") },
      { path: "functions", component: () => import("../views/docs/Functions.vue") },
      { path: "oop", component: () => import("../views/docs/OOP.vue") },
      { path: "namespaces", component: () => import("../views/docs/Namespaces.vue") },
      { path: "dictionaries", component: () => import("../views/docs/Dictionaries.vue") },
      { path: "exceptions", component: () => import("../views/docs/Exceptions.vue") },
      { path: "strings-arrays", component: () => import("../views/docs/StringsArrays.vue") },
      { path: "native-libs", component: () => import("../views/docs/NativeLibs.vue") }
    ]
  },
  {
    path: "/404",
    name: "404",
    props: true,
    component: () => import("../views/NotFound.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
