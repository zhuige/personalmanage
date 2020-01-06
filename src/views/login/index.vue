<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">个人信息事务管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="login"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-form-item prop="email" v-if="!isLogin">
        <span class="svg-container">
          <svg-icon icon-class="tree" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.email"
          placeholder="QQ邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <div class="rew-wrapper">
        <div class="rew" @click="onShowDialog">忘记密码</div>
        <div class="type" @click="isLogin = true">登录</div>
        <div class="type" @click="isLogin = false">注册</div>
      </div>
      <div class="login-wrapper">
        <el-button
          v-if="isLogin"
          v-waves
          :loading="loading"
          type="primary"
          @click.native.prevent="login"
          >登陆</el-button
        >
        <el-button
        v-if="!isLogin"
          v-waves
          :loading="loading"
          type="primary"
          @click.native.prevent="register"
          >注册</el-button
        >
      </div>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span>password: any</span>
      </div>-->
    </el-form>
    <dialog-form ref="dialog"></dialog-form>
  </div>
</template>

<script>
import dialogForm from "./dialog";
import { validUsername } from "@/utils/validate";
import http from "@/utils/request";

export default {
  name: "Login",
  components: {
    dialogForm
  },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error("Please enter the correct user name"));
    //   } else {
    //     callback();
    //   }
    // };
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error("The password can not be less than 6 digits"));
    //   } else {
    //     callback();
    //   }
    // };
    const checkEmail = (rule, value, callback) => {
      if(this.isLogin){
        callback();
      }
      const reg = /^\d{5,12}@[qQ][qQ]\.(com|cn)$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的qq邮箱"));
      }
    };
    return {
      isLogin:true,
      loginForm: {
        username: "",
        password: "",
        email: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   this.$router.push({ path: "/" });
    // }
  },
  methods: {
    onShowDialog() {
      this.$refs.dialog.init();
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    login() {
      this.$refs.form.validate(validate => {
        if (validate) {
          http({
            method: "post",
            url: "users/login",
            data: this.loginForm
          }).then(res => {
            if (res.data.success) {
              const token = res.data.data.token;
              sessionStorage.setItem("token", token);
              this.$notify({
                title: "成功",
                type: "success",
                message: "登陆成功",
                duration: 1500
              });
              this.$router.push({ path: "/systemInfo/systemInfo" });
            } else {
              this.$notify({
                title: "失败",
                type: "error",
                message: res.data.msg,
                duration: 1500
              });
            }
          });
          //   this.$router.push({ path: "/" });
        }
      });
    },
    register() {
      this.$refs.form.validate(validate => {
        if (validate) {
          http({
            method: "post",
            url: "users/register",
            data: this.loginForm
          }).then(res => {
            if (res.data.success) {
              this.$notify({
                title: "成功",
                type: "success",
                message: "注册成功，请登录",
                duration: 1500
              });
              this.isLogin = true;
            } else {
              this.$notify({
                title: "失败",
                type: "error",
                message: res.data.msg,
                duration: 1500
              });
            }
          });
          //   this.$router.push({ path: "/" });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.el-dialog__body {
  padding-top: 0;
}
.wxImgWrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.wxText {
  font-size: 18px;
}
.wxImg {
  width: 240px;
}
.rew-wrapper{
 display: flex;
}
.type{
  width: 50px;
  color: white;
  cursor: pointer;
  &:hover {
    color: #409EFF;
  }
}
.rew {
  width: 80px;
  color: white;
  cursor: pointer;
  &:hover {
    color: #409EFF;
  }
}
.login-wrapper {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  .el-button {
    flex: 1;
  }
}
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
