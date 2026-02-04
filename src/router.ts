import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory("/grocery-list/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      props: route => ({
        code: typeof route.query.code === "string" ? route.query.code : undefined
      }),
    },
  ],
});

export default router