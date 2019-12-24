<template>
  <div class="container">
    <div style="width:400px">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="账号：">
          <el-input v-model="form.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="昵称：">
          <el-input v-model="form.realname" @blur="updateUserInfo"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.email" @blur="updateUserInfo"></el-input>
        </el-form-item>
        <el-form-item label="兴趣爱好：" >
          <el-input v-model="form.hobbies" @blur="updateUserInfo"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-button v-waves type="primary" size="medium" @click="resetPassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </div>

    <reset-password ref="dialog"/>
  </div>
</template>

<script>
import resetPassword from './components/resetPassword'
import http from "@/utils/request";
export default {
  data() {
    return {
      form: {}
    };
  },
  components:{
      resetPassword
  },
  computed:{
      token (){
          return sessionStorage.getItem('token');
      }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
      resetPassword(){
          this.$refs.dialog.init()
      },
    getUserInfo() {
      http({
        url: "users/userInfo",
        method: "get"
      }).then(res => {
        this.form = res.data.data;
      });
    },
    updateUserInfo(){
        http({
        url: "users/updateUserInfo",
        method: "post",
        data:this.form
      }).then(res => {
          this.$eventBus.$emit('getUserInfo');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
