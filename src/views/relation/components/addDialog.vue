<template>
  <el-dialog
    :title="type === 'add' ? '新增' : '编辑'"
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @closed="dialogClose"
  >
    <el-form ref="form" :model="form" :rules="rule" label-width="80px">
      <el-form-item label="称呼：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="realname">
        <el-input v-model="form.realname"></el-input>
      </el-form-item>
       <el-form-item label="关系：" prop="relation">
        <el-input v-model="form.relation"></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="phone">
        <el-input v-model="form.phone">
          <el-input v-model="form.phone"></el-input>
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
      var reg = /^1(3|4|5|7|8)\d{9}$/;
      if(value){
        if(reg.test(value)){
          callback()
        }else{
          callback(new Error('请输入正确的手机号码'))
        }
      } 
      callback();
    };
    return {
      type: "add",
      loading: false,
      dialogVisible: false,
      form: {
        name: "",
        realname: "",
        phone: "",
        relation:'',
        remark: ""
      },
      rule: {
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        name: [{ required: true, message: "请输入称呼", trigger: "blur" }],
        relation: [{ required: true, message: "请输入关系", trigger: "blur" }],
        phone: [{ validator: validate, trigger: "blur" }]
      }
    };
  },
  methods: {
    init(type, item) {
      this.type = type;
      if (type === "edit") {
        let obj = JSON.parse(JSON.stringify(item));
        this.form = obj;
      }
      this.dialogVisible = true;
    },
    dialogClose() {
      this.$refs.form.resetFields();
      this.form = {
        name: "",
        realname: "",
        phone: "",
        relation:'',
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
    http({ url: "relation/update", data: this.form, method: "post" })
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
        http({ url: "relation/add", data: this.form, method: "post" })
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
