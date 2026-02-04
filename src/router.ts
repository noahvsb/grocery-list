import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ListView from "@/views/ListView.vue";

const router = createRouter({
  history: createWebHistory("/grocery-list/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/:code",
      name: "list",
      component: ListView,
      props: true,
    },
  ],
});

export default router