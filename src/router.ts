import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import ListPage from "@/pages/ListPage.vue";

const router = createRouter({
  history: createWebHistory("/grocery-list/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/:code",
      name: "list",
      component: ListPage,
      props: true,
    },
  ],
});

export default router