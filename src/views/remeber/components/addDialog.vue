<template>
  <el-dialog
    :title="type === 'add' ? '新增备忘录' : '编辑备忘录'"
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
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.date"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="优先级：" prop="state">
        <el-select v-model="form.state" placeholder="请选择">
          <el-option label="重要（高）" value="1"> </el-option>
          <el-option label="一般（中）" value="2"> </el-option>
          <el-option label="次要（低）" value="3"> </el-option>
        </el-select>
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
    return {
      type: "add",
      loading: false,
      dialogVisible: false,
      form: {
        title: "",
        state: "1",
        date: "",
        remark: ""
      },
      rule: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        date: [{ required: true, message: "请输入日期", trigger: "blur" }],
        state: [{ required: true, trigger: "change" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  methods: {
    init(type, item) {
      this.type = type;
      if (type === "edit") {
        let obj = JSON.parse(JSON.stringify(item));
        this.form = obj;
        if(this.form.state=='重要'){
            this.form.state ='1';
        }
        else if(this.form.state=='一般'){
            this.form.state ='2';
        }
        else if(this.form.state=='次要'){
            this.form.state ='3';
        }
      }
      this.dialogVisible = true;
    },
    dialogClose() {
      this.$refs.form.resetFields();
      this.form = {
        title: "",
        state: "1",
        date: "",
        remark: ""
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
    http({ url: "remeber/update", data: this.form, method: "post" })
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
        http({ url: "remeber/add", data: this.form, method: "post" })
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
