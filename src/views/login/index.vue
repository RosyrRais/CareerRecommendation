<template>
  <div class=" h-screen py-100">
  <div class="hero  bg-base-200 h-500 ">
    <div class="hero-content flex-col lg:flex-row-reverse ">
      <div class="text-center lg:text-left mx-50">
        <h1 class="text-5xl font-bold">Login now!</h1>
        <p class="py-6">还在为本科毕业找工作而苦恼?<br>登陆立即享受大学生就业推荐服务,准备好你的简历了吗</p>
      </div>
      <div class="card shrink-0  max-w-sm shadow-2xl bg-base-100 w-400">
        <form class="card-body">
          <div class="form-control" v-if="loginWay === 'password'">
            <label class="label">
              <span class="label-text">账号</span>
            </label>
            <input v-model="info.user_name" placeholder="account" class="input input-bordered" required />
          </div>
          <div class="form-control" v-if="loginWay === 'password'">
            <label class="label">
              <span class="label-text">密码</span>
            </label>
            <input  v-model="info.password" type="password" placeholder="password" class="input input-bordered" required @keyup.enter="loginPassword"/>
          </div>
          <div class="form-control" v-if="loginWay === 'email'">
            <label class="label">
              <span class="label-text">邮箱</span>
            </label>
            <div class="inline">
              <input v-model="info.email" placeholder="e-mail" class="input input-bordered w-200" required />
              <button type="button"  class="btn btn-warning btn-sm ml-10 h-40 w-110" @click='sendCode' :disabled='isSendingCode || countdown > 0'>
                {{ countdown > 0 ? `重新发送(${countdown})` : '发送验证码' }}
              </button>
            </div>
          </div>
          <div class="form-control" v-if="loginWay === 'email'">
            <label class="label">
              <span class="label-text">验证码</span>
            </label>
            <input  v-model="info.code"  placeholder="Verification code" class="input input-bordered" required @keyup.enter="loginEmail"/>
          </div>

          <label class="label">
            <a href="#" class="label-text-alt link link-hover" @click="router.push('/findPassword')">忘记密码?</a>
            <a href="#" class="label-text-alt link link-hover" @click="setWayEmail" v-if="loginWay === 'password'">邮箱登录</a>
            <a href="#" class="label-text-alt link link-hover" @click="setWayPassword" v-if="loginWay === 'email'">密码登录</a>
          </label>
            <button type="button" class="btn btn-primary" @click="loginPassword" v-if="loginWay === 'password'">Login</button>
          <button type="button" class="btn btn-primary" @click="loginEmail" v-else>Login</button>
        </form>
      </div>
    </div>
  </div>
  </div>

</template>

<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { ElNotification } from "element-plus";
import { useRequest } from "vue-hooks-plus";
import { passwordLoginAPI, emailLoginAPI, sendEmailCodeAPI } from "@/apis";
import { useMainStore } from "@/stores";

const loginStore = useMainStore().useLoginStore();
const loginWay = ref("  ")
// 发送验证码按钮参数
const isSendingCode = ref(false);
const countdown = ref(0);

if(localStorage.getItem("way") !== null){
  loginWay.value = localStorage.getItem("way") as string;
  console.log(localStorage.getItem("way"))
  console.log(loginWay.value)
}else{
  loginWay.value = 'password'
  console.log(loginWay.value)
}
const info = ref({
  user_name: '',
  password: '',
  email: '',
  code: ''
});

const cleanForm = () => {
  info.value =   {
    user_name: '',
    password: '',
    email: '',
    code: ''
  };
}

const loginPassword = () => {
  useRequest(() => passwordLoginAPI({
    user_name: info.value.user_name,
    password: info.value.password
  }), {
    onSuccess(res:any){
      console.log(res);
      if(res.code === 200) {
        ElNotification.success('登陆成功');
        loginStore.setLogin(true)
        loginStore.setToken(res.data.token)
        loginStore.setUserName(info.value.user_name);
        loginStore.setAvatarUrl(res.data.avatar);
        loginStore.setUserType(res.data.type);
        loginStore.setUserEmail(res.data.email);
        cleanForm()
        if(res.data.type === 1) {
          router.push('/home')
        }else {
          router.push('/enterprise/enterpriseInfo')
        }
      }else{
        ElNotification.error(res.msg);
      }
    },
    onError(e){
      ElNotification.error('登录失败，请重试' + e);
    }
  })
}

const loginEmail = () => {
  useRequest(() => emailLoginAPI({
    email: info.value.email,
    code: info.value.code
  }), {
    onSuccess(res:any){
      console.log(res);
      if(res.code === 200) {
        ElNotification.success('登陆成功');
        loginStore.setLogin(true);
        loginStore.setToken(res.data.token);
        loginStore.setUserName(info.value.user_name);
        loginStore.setUserType(res.data.type);
        loginStore.setUserEmail(res.data.email);
        if(res.data.type === 1) {
          router.push('/home')
        }else {
          router.push('/enterprise/enterpriseInfo')
        }
      }else{
        ElNotification.error(res.msg);
      }
    },
    onError(e){
      ElNotification.error('登录失败，请重试' + e);
    }
  })
}

const setWayEmail = () => {
  loginWay.value = 'email';
}
const setWayPassword = () => {
  loginWay.value = 'password';
}

const IsEmail = (str: string) => {
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return  reg.test(str);
}

const sendCode = () => {
  if(info.value.email==="") {
    ElNotification.warning("先填写信息");
  } else if(!IsEmail(info.value.email)) {
    ElNotification.warning("请确认邮箱地址格式");
  } else {
    useRequest(() => sendEmailCodeAPI({
      email: info.value.email
    }), {
      onSuccess(res:any){
        console.log(res);
        if(res.code === 200 && res.msg ==="OK") {
          ElNotification.success('发送成功');
        }else{
          ElNotification.error(res.msg)
        }
      },
      onError(e){
        ElNotification.error('发送失败，请重试' + e);
      }
    })

    isSendingCode.value = true;
    countdown.value = 10;

    const countInterval = setInterval(()=>{
      countdown.value--;
      if(countdown.value <= 0){
        clearInterval(countInterval);
        isSendingCode.value = false;
      }
    },1000)
  }
}
</script>