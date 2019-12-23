<template>
  <el-dialog
    :title="type === 'add' ? '记一笔' : '编辑'"
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @closed="dialogClose"
  >
    <el-form ref="form" :model="form" :rules="rule" label-width="80px">
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="时间：" prop="date">
        <el-date-picker
          value-format="timestamp"
          v-model="form.date"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="类型：" prop="state">
        <el-select v-model="form.state" placeholder="请选择">
          <el-option label="收入" value="1"> </el-option>
          <el-option label="支出" value="2"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额：" prop="money">
        <el-input v-model="form.money">
          <template slot="append">元(仅支持两位小数)</template>
        </el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" v-model="form.remark"> </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-waves size="medium" type="primary" @click="submit"
        >确定</el-button
      >
      <el-button v-waves size="medium" @click="dialogVisible = false"
        >取消</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import http from "@/utils/request";

export default {
  data() {
    const validate = (rule, value, callback) => {
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的金额"));
      } else {
        callback();
      }
    };
    return {
      type: "add",
      loading: false,
      dialogVisible: false,
      form: {
        title: "",
        state: "1",
        date: "",
        remark: "",
        money: ""
      },
      rule: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        date: [{ required: true, message: "请输入日期", trigger: "blur" }],
        state: [{ required: true, trigger: "change" }],
        money: [{ validator: validate, trigger: "blur" }]
      }
    };
  },
  methods: {
    init(type, item) {
      let obj = JSON.parse(JSON.stringify(item));
      this.type === type;
      if (type === "edit") {
        this.form = item;
      }
      this.dialogVisible = true;
    },
    dialogClose() {
      this.$refs.form.resetFields();
      this.form = {
        title: "",
        state: "1",
        date: "",
        remark: "",
        money: ""
      };
    },
    submit() {
      this.$refs.form.validate(validate => {
        if (validate) {
          this.loading = true;
          if(this.type ==='add'){
              this.onAdd();
          }else{
              this.onUpadte();
          }
        }
      });
    },
    onUpadte(){
    http({ url: "expenses/edit", data: this.form, method: "post" })
            .then(res => {
              this.$notify({
                title: "成功",
                message: "编辑成功",
                duration: 1500,
                type: "success"
              });
              this.$parent.getList();
              this.dialogVisible = false;
            })
            .finally(() => {
              this.loading = false;
            });
    },
    onAdd(){
        http({ url: "expenses/add", data: this.form, method: "post" })
            .then(res => {
              this.$notify({
                title: "成功",
                message: "添加成功",
                duration: 1500,
                type: "success"
              });
              this.$parent.getList();
              this.dialogVisible = false;
            })
            .finally(() => {
              this.loading = false;
            });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-input__inner {
  max-width: 270px;
}
/deep/.el-textarea__inner {
  min-height: 150px !important;
}
</style>
