<template>
  <el-dialog
    v-loading="loading"
    title="提示"
    :visible.sync="dialogVisible"
    width="500px"
    @closed="dialogClose"
  >
    <div>
      <el-form
        :model="dialogFrom"
        :rules="rules"
        ref="dialogForm"
        label-width="100px"
        :close-on-click-modal="false"
      >
        <el-form-item label="账号名：" prop="username">
          <el-input v-model="dialogFrom.username"></el-input>
        </el-form-item>
      </el-form>
      <div class="wxText">我们会发送到账号所绑定的QQ邮箱，请发送后到邮箱查看</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button></span
    >
  </el-dialog>
</template>

<script>
import http from "@/utils/request";
export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogFrom: { username: "" },
      rules: { username: [{ required: true }] }
    };
  },
  methods: {
    dialogClose() {
      this.dialogFrom = {
        username: ""
      };
    },
    onSubmit() {
      this.loading = true;
      this.$refs.dialogForm.validate(validate => {
        if (validate) {
          http({
            method: "post",
            url: "public/sendEmail",
            data: this.dialogFrom
          })
            .then(res => {
              this.$notify({
                title: "成功",
                type: "success",
                message: "发送成功，请前往邮箱查看",
                duration: 1500
              });
              this.dialogVisible = false;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    init() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style scoped>

</style>
