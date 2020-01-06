<template>
  <div class="container" v-loading="loading">
    <div style="width:400px">
      <el-form ref="formData" :model="editFrom" :rules="rule" label-width="120px">
        <el-form-item label="账号：">
          {{ form.username }}
        </el-form-item>
        <el-form-item label="昵称：">
          <template v-if="isEdit">
            <el-input v-model="editFrom.realname"></el-input
          ></template>
          <template v-else>{{ form.realname }}</template>
        </el-form-item>
        <el-form-item label="qq邮箱：" prop="email">
          <template v-if="isEdit">
            <el-input v-model="editFrom.email"></el-input
          ></template>
          <template v-else>{{ form.email }}</template>
        </el-form-item>
        <el-form-item label="兴趣爱好：">
          <template v-if="isEdit">
            <el-input v-model="editFrom.hobbies"></el-input
          ></template>
          <template v-else>{{ form.hobbies }}</template>
        </el-form-item>
        <el-form-item label="密码：">
          <el-button v-waves type="primary" size="medium" @click="resetPassword"
            >修改密码</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="info" @click="onEdit">{{
            !isEdit ? "编辑" : "取消"
          }}</el-button>
          <el-button v-waves type="primary" @click="onSave" v-if="isEdit"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <reset-password ref="dialog" />
  </div>
</template>

<script>
import resetPassword from "./components/resetPassword";
import http from "@/utils/request";
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      if (this.isLogin) {
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
      rule: {
        email: [{ required: true, validator: checkEmail, trigger: "blur" }]
      },
      form: {},
      editFrom: {},
      isEdit: false,
      loading: false
    };
  },
  components: {
    resetPassword
  },
  computed: {
    token() {
      return sessionStorage.getItem("token");
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    onSave() {
      this.$refs.formData.validate(res => {
        if (res) {
          this.updateUserInfo();
          this.isEdit = false;
        }
      });
    },
    onEdit() {
      this.isEdit = !this.isEdit;
      this.editFrom = JSON.parse(JSON.stringify(this.form));
    },
    resetPassword() {
      this.$refs.dialog.init();
    },
    getUserInfo() {
      http({
        url: "users/userInfo",
        method: "get"
      }).then(res => {
        this.form = res.data.data;
        this.editFrom = res.data.data;
      });
    },
    updateUserInfo() {
      this.loading = true;
      http({
        url: "users/updateUserInfo",
        method: "post",
        data: this.editFrom
      })
        .then(res => {
          this.$notify({
            title: "成功",
            message: "编辑成功",
            duration: 1500,
            type: "success"
          });
          this.getUserInfo();
          this.$eventBus.$emit("getUserInfo");
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
