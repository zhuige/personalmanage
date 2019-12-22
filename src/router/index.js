import Vue from "vue";
import Router from "vue-router";
import { Notification } from "element-ui";
Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/",
    redirect: "/login",
    hidden: true
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/systemInfo",
    component: Layout,
    children: [
      {
        path: "systemInfo",
        name: "systemInfo",
        component: () => import("@/views/systemInfo/index"),
        meta: { title: "个人信息管理", icon: "form" }
      }
    ]
  },

  {
    path: "/expenses",
    component: Layout,
    children: [
      {
        path: "expenses",
        name: "expenses",
        component: () => import("@/views/expenses/index"),
        meta: { title: "个人开支管理", icon: "dashboard" }
      }
    ]
  },

  {
    path: "/remeber",
    component: Layout,
    children: [
      {
        path: "remeber",
        name: "remeber",
        component: () => import("@/views/remeber/index"),
        meta: { title: "备忘录信息管理", icon: "nested" }
      }
    ]
  },
  {
    path: "/relation",
    component: Layout,
    children: [
      {
        path: "relation",
        name: "Form",
        component: () => import("@/views/relation/index"),
        meta: { title: "个人关系信息管理", icon: "link" }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

router.beforeEach((to, from, next) => {
  if (!(to.fullPath === "/login")) {
    let token = sessionStorage.getItem("token");
    if (token) {
      next();
    } else {
      Notification({
        type: "error",
        title: "失败",
        message: "请登陆",
        duration: 1500
      });
      next("/login");
    }
  } else {
    next();
  }
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
