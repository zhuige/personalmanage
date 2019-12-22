<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    width="400px"
    @close="dialogClose"
  >
    <el-form ref="form" :model="form" :rules="rule" label-width="80px">
      <el-form-item label="旧密码：" prop="oldPassword">
        <el-input v-model="form.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input v-model="form.newPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" @click="submit">确 定</el-button>
      <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import http from "@/utils/request";
export default {
  data() {
    return {
      dialogVisible: false,
      form: { oldPassword: "", newPassword: "" },
      rule: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.$refs.form.resetFields();
      this.form = { oldPassword: "", newPassword: "" };
    },
    submit() {
      this.$refs.form.validate(
        validate => {
          if(validate) {
            http({
              url: "users/resetPassword",
              method: "post",
              data: this.form
            }).then(res => {
              if (res.data.success) {
                this.$notify({
                  title: "成功",
                  type: "success",
                  message: res.data.msg,
                  duration: 1500
                });
                this.dialogVisible = false;
              } else {
                this.$notify({
                  title: "失败",
                  type: "error",
                  message: res.data.msg,
                  duration: 1500
                });
              }
            });
          }
        }
      );
    }
  }
};
</script>

<style></style>
