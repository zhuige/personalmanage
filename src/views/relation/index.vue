<template>
  <div class="container">
      <div style="display:flex">
    <el-button v-waves type="primary" size="medium" icon="el-icon-plus" @click="onAdd">添加</el-button>
     <div style="margin-left:10px;width:270px">
        <el-input placeholder="请输入称呼或姓名" v-model="keyWord" @keydown.native.enter="getList"/>
      </div>
      <el-button
      @click="getList"
        v-waves
        type="primary"
        size="medium"
        icon="el-icon-search"
        style="margin-left:10px"
        
        >搜索</el-button>
  </div>
    <div class="table-wrapper">
    <el-table :data="list" v-loading="loading">
      <el-table-column label="称呼"> 
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="姓名"> 
        <template slot-scope="scope">
          {{scope.row.realname}}
        </template>
      </el-table-column>
       <el-table-column label="电话"> 
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="关系"> 
        <template slot-scope="scope">
          {{scope.row.relation}}
        </template>
      </el-table-column>
      <!-- show-overflow-tooltip  -->
       <el-table-column label="备注" > 
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px"> 
        <template slot-scope="scope">
           <el-button size="mini" type="info" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <add-dialog ref="addDialog"/>
  </div>
</template>

<script>
import http from "@/utils/request";
import addDialog from './components/addDialog';
export default {
  name: "Dashboard",
  data() {
    return {
      list: [],
      loading:false,
      keyWord:''
    };
  },
  components:{
    addDialog
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      http({
        url: "relation/list",
        params:{
            keyWord:this.keyWord
        }
      }).then(res => {
        this.list = res.data.data;
      }).finally(()=>{
        this.loading= false;
      });
    },
    onAdd() {
      this.$refs.addDialog.init('add');
    },
    onEdit(item) {
       this.$refs.addDialog.init('edit',item);
    },
    onDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        http({
          url: "relation/delete",
          method: "delete",
          data:{
            id
          }
        }).then(res => {
            this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 1500
          });
        });
      }).catch(()=>{
       
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.table-wrapper{
  margin-top: 20px;
}
</style>
