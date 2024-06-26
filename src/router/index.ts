import { createRouter, createWebHistory } from "vue-router";
import {
  FindPassword,
  Login,
  Register,
  resume,
  Home,
  EnterpriseInfo,
  StudentsList,
  jobDatabase,
  ApplyCheckResume,
  JobRequireMatch,
  RobotChat,
  Info,
  resetEmail,
} from "@/views";

import pinia from "@/stores/createPinia";
import { useMainStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/findPassword",
      name: "findPassword",
      component: FindPassword
    },
    {
      path: "/resume",
      name: "resume",
      component: resume
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/enterprise/enterpriseInfo",
      name:"enterpriseInfo",
      component:EnterpriseInfo
    },
    {
      path: "/jobDatabase",
      name: "jobDatabase",
      component: jobDatabase
    },
    {
      path: "/enterprise/studentsList",
      name: "studentsList",
      component: StudentsList,
    },
    {
      path: "/enterprise/applyCheckResume",
      name: "applyCheckResume",
      component: ApplyCheckResume,
    },
    {
      path: "/enterprise/jobRequireMatch",
      name: "jobRequireMatch",
      component: JobRequireMatch,
    },
    {
      path: "/robotChat",
      name: "robotChat",
      component: RobotChat,
    },
    {
      path: "/resetEmail",
      name: "resetEmail",
      component: resetEmail,
    },
    {
      path: "/info",
      name: "info",
      component: Info,
    },
  ]
});

router.beforeEach((to, _, next) => {
  const loginStore = useMainStore(pinia).useLoginStore(pinia);
  if(loginStore.loginSession === false && to.path !== "/login" && to.path !== "/register" && to.path !== "/findPassword"){
    next("/login");
  } else {
    if(loginStore.userType === 1){ //学生端
      if(to.path === "/enterprise/enterpriseInfo" ||
         to.path === "/enterprise/studentsList" ||
         to.path === "/enterprise/applyCheckResume" ||
         to.path === "/enterprise/jobRequireMatch") {
        next("/home");
      } else {
        next();
      }
    } else if(loginStore.userType === 2){ //企业端
      if(to.path === "/resume" ||
         to.path === "/home" ||
         to.path === "/jobDatabase" ||
         to.path === "/robotChat") {
        next("/home");
      } else {
        next();
      }
    }
    next();
  }
});

export default router;
